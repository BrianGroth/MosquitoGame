const test = require("node:test");
const assert = require("node:assert/strict");
const { create, clean, STAGES } = require("../progression.js");
function memory() {
  let data = {};
  return { getItem: (k) => data[k] || null, setItem: (k, v) => (data[k] = v) };
}
const result = (overrides = {}) => ({
  score: 235,
  streak: 5,
  webs: 0,
  bites: 0,
  friends: 0,
  friendliesSeen: 2,
  ...overrides,
});
test("stage medals union across retries, records never decrease, unlock on clear", () => {
  const p = create(memory());
  let first = p.complete(3, result({ bites: 1, webs: 1 }), false);
  assert.deepEqual(first.earned, [true, false, true]);
  assert.equal(p.data.unlocked, 4);
  let retry = p.complete(3, result({ score: 100, bites: 0, webs: 0 }), false);
  assert.deepEqual(retry.record.medals, [true, true, true]);
  assert.equal(retry.record.score, 235);
  assert.equal(retry.newBest, false);
  assert.deepEqual(retry.newMedals, [false, true, false]);
});
test("assist progression unlocks stages but does not alter standard records", () => {
  const p = create(memory());
  p.complete(1, result(), true);
  assert.equal(p.data.unlocked, 2);
  assert.ok(p.data.records["assist:1"]);
  assert.equal(p.data.records["normal:1"], undefined);
});
test("achievements are awarded once and cannot be farmed by completion replay", () => {
  const p = create(memory());
  assert.deepEqual(p.event("swat", 1), ["first"]);
  assert.deepEqual(p.event("swat", 1), []);
  assert.ok(p.complete(1, result(), false).awards.includes("gentle"));
  assert.equal(p.complete(1, result(), false).awards.includes("gentle"), false);
  p.complete(2, result(), false);
  assert.ok(p.data.achievements.includes("sunset"));
  assert.deepEqual(p.data.completed, [1, 2]);
});
test("web lifetime achievements cross threshold exactly once and persist", () => {
  const storage = memory(),
    p = create(storage);
  assert.deepEqual(p.event("web"), ["silk"]);
  for (let i = 1; i < 24; i++) p.event("web");
  assert.deepEqual(p.event("web"), ["designer"]);
  assert.deepEqual(p.event("web"), []);
  assert.equal(create(storage).data.lifetime.webs, 26);
});
test("all 24 standard medals unlock mastery; assist completion cannot", () => {
  const p = create(memory());
  for (let n = 1; n <= 8; n++)
    p.complete(n, result({ streak: 30, webs: 3 }), true);
  assert.ok(p.data.achievements.includes("picnic"));
  assert.ok(!p.data.achievements.includes("master"));
  for (let n = 1; n <= 8; n++)
    p.complete(n, result({ streak: 30, webs: 3 }), false);
  assert.ok(p.data.achievements.includes("master"));
  assert.equal(p.data.active, 8);
});
test("storage denial preserves playable session and communicates failure", () => {
  const p = create({
    getItem: () => null,
    setItem: () => {
      throw Error("denied");
    },
  });
  p.complete(1, result(), false);
  assert.equal(p.data.unlocked, 2);
  assert.match(p.warning(), /session/);
});
test("corrupt and future saves are not silently overwritten", () => {
  let writes = 0;
  for (const raw of ["{broken", '{"version":99}']) {
    const p = create({ getItem: () => raw, setItem: () => writes++ });
    p.event("swat", 1);
    assert.ok(p.warning());
  }
  assert.equal(writes, 0);
});
test("restoration validates counters, bounds and cosmetic entitlements", () => {
  const p = clean({
    version: 1,
    unlocked: 999,
    active: -3,
    settings: { sound: "yes", effect: "gold", title: "Master Naturalist" },
    records: {
      "normal:1": { score: -1, streak: 3, medals: [true, "yes", false] },
    },
    achievements: ["fake"],
    lifetime: { swats: -9, webs: 20 },
    completed: [1, 1, 99],
  });
  assert.equal(p.unlocked, 1);
  assert.equal(p.settings.sound, true);
  assert.equal(p.settings.effect, "classic");
  assert.equal(p.settings.title, "Lorie’s field journal");
  assert.deepEqual(p.records["normal:1"].medals, [true, false, false]);
  assert.deepEqual(p.completed, [1]);
  assert.equal(p.lifetime.swats, 0);
});
test("every technique medal is possible within its stage quota", () => {
  STAGES.forEach((s, i) => {
    if (s.goal === "streak" || s.goal === "web")
      assert.ok(s.target <= 5 + 2 * i);
  });
});
