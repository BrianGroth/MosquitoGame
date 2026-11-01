/* Persistent campaign rules. No DOM or browser storage is required to use this module. */
(function (root) {
  "use strict";
  var STAGES = [
    {
      name: "First Swat",
      scene: 0,
      chapter: "Amsterdam Canal",
      note: "A quiet canal. A few uninvited guests.",
      skill: "Reach a 5-hit streak",
      goal: "streak",
      target: 5,
      hint: "Each accurate swat grows your streak. A miss breaks it.",
    },
    {
      name: "Friendly Neighbors",
      scene: 0,
      chapter: "Amsterdam Canal",
      note: "Fireflies belong here. Mosquitoes do not.",
      skill: "Hurt no friendly bugs",
      goal: "friends",
      target: 0,
      hint: "Let glowing fireflies pass. Circle spiders instead of tapping them.",
    },
    {
      name: "Silk School",
      scene: 1,
      chapter: "Minnesota Lakefront",
      note: "A little silk goes a long way.",
      skill: "Catch 1 mosquito in a web",
      goal: "web",
      target: 1,
      hint: "Circle a spider. Its dotted perch shows where it will weave.",
    },
    {
      name: "Lakeside Breeze",
      scene: 1,
      chapter: "Minnesota Lakefront",
      note: "Watch the breeze. Let your webs do some work.",
      skill: "Catch 2 mosquitoes in webs",
      goal: "web",
      target: 2,
      weather: true,
      hint: "A gust warning appears before the breeze moves airborne bugs.",
    },
    {
      name: "Lantern Watch",
      scene: 2,
      chapter: "Campground",
      note: "Evening settles in. Red-eyed flies join the mosquitoes.",
      skill: "Reach an 8-hit streak",
      goal: "streak",
      target: 8,
      waves: true,
      hint: "Swat red-eyed flies for mosquito points. Swarm warnings point to the entry side.",
    },
    {
      name: "Silk & Embers",
      scene: 2,
      chapter: "Campground",
      note: "Two spider allies. One very busy picnic.",
      skill: "Catch 3 bugs in webs",
      goal: "web",
      target: 3,
      waves: true,
      hint: "A web holds three mosquitoes. Look for the three silk knots.",
    },
    {
      name: "Canopy Dash",
      scene: 3,
      chapter: "Treehouse",
      note: "Meet the darter. Watch for its golden wind-up.",
      skill: "Reach a 10-hit streak",
      goal: "streak",
      target: 10,
      darters: true,
      hint: "Gold-ringed darters pause before a quick dive. Swat them early.",
    },
    {
      name: "The Last Picnic",
      scene: 3,
      chapter: "Treehouse",
      note: "A busy canopy rush. Bring your spider friends.",
      skill: "Catch 3 bugs in webs",
      goal: "web",
      target: 3,
      darters: true,
      waves: true,
      hint: "Mix precise taps with webs. Every catch clears part of the quota.",
    },
    {
      name: "Moonlit Rush", scene: 0, chapter: "Moonlit Canal",
      note: "Back on the canal, the moon brings a faster crowd.",
      skill: "Reach a 12-hit streak", goal: "streak", target: 12,
      darters: true, waves: true, weather: true,
      hint: "Swat the round, red-eyed flies too. Your wristband leaves the forearm exposed.",
    },
    {
      name: "Midnight Silk", scene: 0, chapter: "Moonlit Canal",
      note: "More wings over the water. Put your spider allies to work.",
      skill: "Catch 4 bugs in webs", goal: "web", target: 4,
      darters: true, waves: true,
      hint: "Renew your webs as their three catches run out.",
    },
    {
      name: "Lakeside Patrol", scene: 1, chapter: "Lakeside Finale",
      note: "One last lakeside visit, with the busiest bugs yet.",
      skill: "Reach a 15-hit streak", goal: "streak", target: 15,
      darters: true, waves: true, weather: true,
      hint: "Quick, accurate taps keep your streak alive through the gusts.",
    },
    {
      name: "The Grand Picnic", scene: 1, chapter: "Lakeside Finale",
      note: "The final rush. Protect the picnic with taps and silk.",
      skill: "Catch 5 bugs in webs", goal: "web", target: 5,
      darters: true, waves: true, weather: true,
      hint: "Use both spiders, and keep watching your exposed forearm.",
    },
  ];
  // Keep encounter unlocks tied to campaign stages, while starting the
  // numerical curve two steps higher (new Stage 1 = former Stage 3).
  function stageConfig(L, assist) {
    var difficulty = L + 2;
    var i = difficulty - 1;
    var swarmEvery = Math.max(6, 15 - 1.5 * (difficulty - 3));
    return {
      quota: 5 + 2 * i,
      speed: (55 + 20 * i) * (assist ? 0.72 : 1),
      concurrent: Math.min(2 + Math.floor(i * 0.8), 10),
      spawnGap: Math.max(0.35, 1.4 - 0.14 * i),
      biteTime: Math.max(1, 2.4 - 0.18 * i) * (assist ? 1.55 : 1),
      wander: Math.max(0.6, 2.6 - 0.25 * i),
      swarmEvery: STAGES[L - 1].waves ? Math.min(7, swarmEvery) : swarmEvery,
      swarmSize: Math.min(3 + Math.floor((difficulty - 3) / 2), 8),
      fireflies: Math.min(1 + Math.floor(i / 2), 4),
      spiders: difficulty >= 6 ? 2 : 1,
    };
  }
  var ACHIEVEMENTS = [
    {
      id: "first",
      name: "First Swat",
      description: "Swat your first mosquito.",
      reward: "First Swat badge",
    },
    {
      id: "silk",
      name: "Silk Partnership",
      description: "Catch your first mosquito in a web.",
      reward: "Silk Partnership badge",
    },
    {
      id: "gentle",
      name: "Gentle Guardian",
      description: "Clear a stage with friendlies present and none hurt.",
      reward: "Golden swat effect",
    },
    {
      id: "steady",
      name: "Steady Hand",
      description: "Reach a 15-hit streak in one stage.",
      reward: "Steady Hand title",
    },
    {
      id: "designer",
      name: "Web Designer",
      description: "Catch 25 mosquitoes in webs across your adventures.",
      reward: "Golden silk effect",
    },
    {
      id: "sunset",
      name: "Sunset Defender",
      description: "Complete both stages of any chapter.",
      reward: "Chapter postcard",
    },
    {
      id: "picnic",
      name: "Picnic Protector",
      description: "Complete all twelve stages.",
      reward: "Picnic Protector title",
    },
    {
      id: "master",
      name: "Master Naturalist",
      description: "Earn all 36 campaign medals in standard mode.",
      reward: "Master Naturalist title",
    },
  ];
  function fresh() {
    return {
      version: 1,
      unlocked: 1,
      citronella: { band: false, cleanStage: 0 },
      active: 1,
      tutorial: false,
      settings: {
        sound: true,
        ambience: false,
        motion: true,
        contrast: false,
        assist: false,
        haptics: false,
        effect: "classic",
        title: "Lorie’s field journal",
      },
      records: {},
      achievements: [],
      lifetime: { swats: 0, webs: 0 },
      completed: [],
    };
  }
  function integer(v, fallback, max) {
    return Number.isInteger(v) && v >= 0 && v <= max ? v : fallback;
  }
  function clean(raw) {
    var p = fresh();
    if (!raw || raw.version !== 1) return p;
    p.unlocked = Math.max(1, integer(raw.unlocked, 1, STAGES.length));
    p.active = Math.max(1, Math.min(p.unlocked, integer(raw.active, 1, STAGES.length)));
    // Old eight-stage saves continue directly into the expanded campaign.
    if (Array.isArray(raw.completed) && raw.completed.indexOf(8) >= 0 && p.unlocked === 8)
      p.unlocked = 9;
    if (p.unlocked === 9 && p.active === 8 && Array.isArray(raw.completed) && raw.completed.indexOf(8) >= 0)
      p.active = 9;
    p.citronella.band = (raw.citronella || {}).band === true;
    p.citronella.cleanStage = integer((raw.citronella || {}).cleanStage, 0, STAGES.length);
    p.tutorial = raw.tutorial === true;
    Object.keys(p.settings).forEach(function (k) {
      if (
        typeof p.settings[k] === "boolean" &&
        typeof (raw.settings || {})[k] === "boolean"
      )
        p.settings[k] = raw.settings[k];
    });
    if (["classic", "gold"].indexOf((raw.settings || {}).effect) >= 0)
      p.settings.effect = raw.settings.effect;
    if (
      [
        "Lorie’s field journal",
        "Steady Hand",
        "Picnic Protector",
        "Master Naturalist",
      ].indexOf((raw.settings || {}).title) >= 0
    )
      p.settings.title = raw.settings.title;
    p.achievements = ACHIEVEMENTS.filter(function (a) {
      return (
        Array.isArray(raw.achievements) && raw.achievements.indexOf(a.id) >= 0
      );
    }).map(function (a) {
      return a.id;
    });
    if (p.settings.effect === "gold" && p.achievements.indexOf("gentle") < 0)
      p.settings.effect = "classic";
    var titles = {
      "Steady Hand": "steady",
      "Picnic Protector": "picnic",
      "Master Naturalist": "master",
    };
    if (
      titles[p.settings.title] &&
      p.achievements.indexOf(titles[p.settings.title]) < 0
    )
      p.settings.title = "Lorie’s field journal";
    p.completed = Array.isArray(raw.completed)
      ? raw.completed.filter(function (n, i, a) {
          return Number.isInteger(n) && n >= 1 && n <= STAGES.length && a.indexOf(n) === i;
        })
      : [];
    p.lifetime.swats = integer((raw.lifetime || {}).swats, 0, 1e9);
    p.lifetime.webs = integer((raw.lifetime || {}).webs, 0, 1e9);
    ["normal", "assist"].forEach(function (mode) {
      for (var n = 1; n <= STAGES.length; n++) {
        var key = mode + ":" + n,
          r = (raw.records || {})[key];
        if (r && typeof r === "object")
          p.records[key] = {
            score: integer(r.score, 0, 1e9),
            streak: integer(r.streak, 0, 1e6),
            medals: [0, 1, 2].map(function (i) {
              return Array.isArray(r.medals) && r.medals[i] === true;
            }),
          };
      }
    });
    return p;
  }
  function create(storage) {
    var key = "lories-picnic-v1",
      p = fresh(),
      writable = !!storage,
      warning = storage
        ? ""
        : "Storage is unavailable. Progress lasts for this session.";
    try {
      var saved = storage && storage.getItem(key);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed.version !== 1) {
          writable = false;
          warning =
            "This save is from another version. Playing this session will not overwrite it.";
        } else p = clean(parsed);
      }
    } catch (e) {
      writable = false;
      warning =
        "Saved progress could not be read. You can still play this session.";
    }
    function save() {
      if (!storage || !writable) {
        if (!warning)
          warning = "Storage is unavailable. Progress lasts for this session.";
        return false;
      }
      try {
        storage.setItem(key, JSON.stringify(p));
        return true;
      } catch (e) {
        writable = false;
        warning = "Storage is unavailable. Progress lasts for this session.";
        return false;
      }
    }
    function award(id) {
      if (p.achievements.indexOf(id) >= 0) return false;
      p.achievements.push(id);
      return true;
    }
    function event(kind, streak) {
      var unlocked = [];
      if (kind === "swat") {
        p.lifetime.swats++;
        if (award("first")) unlocked.push("first");
        if (streak >= 15 && award("steady")) unlocked.push("steady");
      }
      if (kind === "web") {
        p.lifetime.webs++;
        if (award("silk")) unlocked.push("silk");
        if (p.lifetime.webs >= 25 && award("designer"))
          unlocked.push("designer");
      }
      save();
      return unlocked;
    }
    function complete(level, stats, assist) {
      var protection = p.citronella;
      var bandEarned = false;
      if (stats.bites === 0) {
        if (protection.cleanStage === level - 1 && protection.cleanStage > 0 && !protection.band) {
          protection.band = true;
          bandEarned = true;
        }
        protection.cleanStage = level;
      } else {
        protection.band = false;
        protection.cleanStage = 0;
      }
      var stage = STAGES[level - 1],
        skill =
          stage.goal === "streak"
            ? stats.streak >= stage.target
            : stage.goal === "web"
              ? stats.webs >= stage.target
              : stats.friends === 0;
      var earned = [true, stats.bites === 0, skill],
        key = (assist ? "assist" : "normal") + ":" + level,
        previous = p.records[key] || {
          score: 0,
          streak: 0,
          medals: [false, false, false],
        };
      var newBest = stats.score > previous.score,
        newMedals = earned.map(function (v, i) {
          return v && !previous.medals[i];
        });
      p.records[key] = {
        score: Math.max(previous.score, stats.score),
        streak: Math.max(previous.streak, stats.streak),
        medals: earned.map(function (v, i) {
          return v || previous.medals[i];
        }),
      };
      p.unlocked = Math.max(p.unlocked, Math.min(STAGES.length, level + 1));
      p.active = Math.min(STAGES.length, level + 1);
      if (p.completed.indexOf(level) < 0) p.completed.push(level);
      var awards = [];
      function give(id) {
        if (award(id)) awards.push(id);
      }
      if (stats.friendliesSeen > 0 && stats.friends === 0) give("gentle");
      for (var n = 1; n <= STAGES.length; n += 2)
        if (p.completed.indexOf(n) >= 0 && p.completed.indexOf(n + 1) >= 0)
          give("sunset");
      if (p.completed.length === STAGES.length) give("picnic");
      var all = true;
      for (var j = 1; j <= STAGES.length; j++) {
        var r = p.records["normal:" + j];
        if (!r || !r.medals.every(Boolean)) all = false;
      }
      if (all) give("master");
      save();
      return {
        bandEarned: bandEarned,
        earned: earned,
        newMedals: newMedals,
        newBest: newBest,
        awards: awards,
        record: p.records[key],
      };
    }
    return {
      data: p,
      save: save,
      event: event,
      complete: complete,
      breakCleanRun: function () { p.citronella.cleanStage = 0; save(); },
      sting: function () {
        var lost = p.citronella.band;
        p.citronella.band = false;
        p.citronella.cleanStage = 0;
        save();
        return lost;
      },
      warning: function () {
        return warning;
      },
      record: function (level) {
        return (
          p.records[
            (p.settings.assist ? "assist" : "normal") + ":" + level
          ] || { score: 0, streak: 0, medals: [false, false, false] }
        );
      },
    };
  }
  function audio(settings) {
    var context = null,
      ambient = null;
    function unlock() {
      try {
        if (!context)
          context = new (root.AudioContext || root.webkitAudioContext)();
        if (context.state === "suspended")
          context.resume().catch(function () {});
      } catch (e) {}
    }
    function tone(freq, time, type, volume, delay) {
      if (!context || context.state !== "running") return;
      var o = context.createOscillator(),
        g = context.createGain(),
        t = context.currentTime + (delay || 0);
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(volume || 0.07, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + time);
      o.connect(g);
      g.connect(context.destination);
      o.start(t);
      o.stop(t + time + 0.02);
    }
    function play(kind, streak) {
      if (!settings.sound) return;
      if (kind === "swat") {
        tone(260 + Math.min(streak || 0, 21) * 24, 0.09, "triangle", 0.1);
        tone(110, 0.05, "sine", 0.1);
      } else if (kind === "web") {
        tone(660, 0.2);
        tone(880, 0.22, "sine", 0.05, 0.08);
      } else if (kind === "bite" || kind === "friend") {
        tone(145, 0.2, "triangle", 0.08);
        tone(110, 0.16, "triangle", 0.06, 0.1);
      } else if (kind === "win") {
        [523, 659, 784, 1046].forEach(function (f, i) {
          tone(f, 0.22, "sine", 0.07, i * 0.12);
        });
      } else tone(360, 0.06, "sine", 0.025);
    }
    function ambience(active) {
      if (ambient) {
        ambient.osc.stop();
        ambient = null;
      }
      if (
        !active ||
        !settings.ambience ||
        !context ||
        context.state !== "running"
      )
        return;
      var o = context.createOscillator(),
        g = context.createGain();
      o.type = "sine";
      o.frequency.value = 174;
      g.gain.value = 0.012;
      o.connect(g);
      g.connect(context.destination);
      o.start();
      ambient = { osc: o };
    }
    function suspend() {
      ambience(false);
      if (context && context.state === "running")
        context.suspend().catch(function () {});
    }
    return { unlock: unlock, play: play, ambience: ambience, suspend: suspend };
  }
  var api = {
    STAGES: STAGES,
    stageConfig: stageConfig,
    ACHIEVEMENTS: ACHIEVEMENTS,
    create: create,
    clean: clean,
    fresh: fresh,
    audio: audio,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Picnic = api;
})(typeof window !== "undefined" ? window : globalThis);
