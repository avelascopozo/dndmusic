-- Seed data with real royalty-free / CC0 / Public Domain audio URLs
--
-- Sources used:
--   BigSoundBank (bigsoundbank.com) — CC0 public domain, no attribution required
--   SoundBible (soundbible.com)     — Public Domain tracks only (noted per sound)
--   FreePD via Internet Archive     — CC0 public domain (freepd.com archive at archive.org)
--
-- All URLs verified as accessible. archive.org URLs redirect to CDN servers — this is normal.

INSERT INTO sound_library (name, category, type, emoji, file_url) VALUES
  -- Tavern
  -- BigSoundBank CC0: crowd of 50-60 people discussing (good tavern ambience)
  ('Tavern crowd', 'tavern', 'loop', '🍺', 'https://bigsoundbank.com/UPLOAD/mp3/3516.mp3'),
  -- BigSoundBank CC0: open-hearth fireplace crackling loop (~1 min)
  ('Fireplace crackling', 'tavern', 'loop', '🔥', 'https://bigsoundbank.com/UPLOAD/mp3/0031.mp3'),
  -- SoundBible Public Domain: coins dropped on a table (id=2081)
  ('Coins on table', 'tavern', 'one-shot', '💰', 'http://soundbible.com/grab.php?id=2081&type=mp3'),

  -- Cave / Dungeon
  -- BigSoundBank CC0: many drops of water (#1, 20 sec)
  ('Water dripping', 'cave', 'loop', '💧', 'https://bigsoundbank.com/UPLOAD/mp3/1384.mp3'),
  -- BigSoundBank CC0: wind recorded from inside a house during a storm — eerie, cave-like
  ('Underground wind', 'cave', 'loop', '💨', 'https://bigsoundbank.com/UPLOAD/mp3/1714.mp3'),
  -- SoundBible Public Domain: creaking door spooky (id=1717)
  ('Creaking door', 'cave', 'one-shot', '🚪', 'http://soundbible.com/grab.php?id=1717&type=mp3'),
  -- BigSoundBank CC0: thunder strike (#4)
  ('Distant thunder', 'cave', 'one-shot', '⚡', 'https://bigsoundbank.com/UPLOAD/mp3/3115.mp3'),
  -- BigSoundBank CC0: rat nibbling (real pet rat, 35 sec)
  ('Rats and scurrying', 'cave', 'loop', '🐀', 'https://bigsoundbank.com/UPLOAD/mp3/0185.mp3'),
  -- BigSoundBank CC0: a man whispering (#1, 28 sec)
  ('Eerie whispers', 'cave', 'loop', '👻', 'https://bigsoundbank.com/UPLOAD/mp3/3255.mp3'),
  -- BigSoundBank CC0: fireplace #3 (longer loop, 3 min — usable as torch ambience)
  ('Torch flickering', 'cave', 'loop', '🔦', 'https://bigsoundbank.com/UPLOAD/mp3/2855.mp3'),

  -- Forest
  -- SoundBible Public Domain: warm sunny day with birds and bees outdoor ambience (id=1661)
  ('Birds and wind', 'forest', 'loop', '🌲', 'http://soundbible.com/grab.php?id=1661&type=mp3'),
  -- BigSoundBank CC0: rain under an umbrella in a street, 34 sec — rain drops on surface
  ('Rain on leaves', 'forest', 'loop', '🌧️', 'https://bigsoundbank.com/UPLOAD/mp3/2679.mp3'),
  -- SoundBible Public Domain: medium pack of wolves howling with crickets (id=277)
  ('Wolves howling', 'forest', 'one-shot', '🐺', 'http://soundbible.com/grab.php?id=277&type=mp3'),
  -- BigSoundBank CC0: small stream #1 (56 sec)
  ('Stream flowing', 'forest', 'loop', '🌊', 'https://bigsoundbank.com/UPLOAD/mp3/0213.mp3'),

  -- City
  -- BigSoundBank CC0: pedestrian place — a hundred people on a square in Chartres (1:34)
  ('City crowds', 'city', 'loop', '🏙️', 'https://bigsoundbank.com/UPLOAD/mp3/0526.mp3'),
  -- BigSoundBank CC0: outdoor market #1 — market ambience with vendors and shoppers (3:19)
  ('Market chatter', 'city', 'loop', '🛒', 'https://bigsoundbank.com/UPLOAD/mp3/2728.mp3'),
  -- BigSoundBank CC0: manifestation/demonstration in Paris — protest crowd shouting (2:08)
  ('Angry mob', 'city', 'loop', '😤', 'https://bigsoundbank.com/UPLOAD/mp3/3385.mp3'),
  -- BigSoundBank CC0: four church bells ringing simultaneously (51 sec)
  ('Church bells', 'city', 'one-shot', '🔔', 'https://bigsoundbank.com/UPLOAD/mp3/0829.mp3'),

  -- Castle
  -- BigSoundBank CC0: whistling of the wind #1 — outdoor wind howl
  ('Castle wind', 'castle', 'loop', '🏰', 'https://bigsoundbank.com/UPLOAD/mp3/0147.mp3'),
  -- BigSoundBank CC0: opening of a large metal barn barrier — heavy metallic gate (2 sec)
  ('Heavy gate', 'castle', 'one-shot', '⛩️', 'https://bigsoundbank.com/UPLOAD/mp3/2355.mp3'),
  -- BigSoundBank CC0: heavy chain sound effect
  ('Dungeon chains', 'castle', 'loop', '⛓️', 'https://bigsoundbank.com/UPLOAD/mp3/0359.mp3');

-- Mood music — all from FreePD collection archived at archive.org (CC0 / Public Domain)
-- Base URL: https://archive.org/download/freepd/
-- These URLs redirect (302) to CDN nodes — this is normal Internet Archive behaviour.

INSERT INTO mood_library (mood, name, file_url) VALUES
  -- Calm / peaceful
  ('calm', 'Meadow Rest',      'https://archive.org/download/freepd/misc/Kalimba%20Relaxation%20Music.mp3'),
  ('calm', 'Tavern Lute',      'https://archive.org/download/freepd/misc/Dancing%20at%20the%20Inn.mp3'),
  ('calm', 'Gentle Strings',   'https://archive.org/download/freepd/misc/Elf%20Meditation.mp3'),

  -- Mystery / dark atmospheric
  ('mystery', 'Dark Corridors',  'https://archive.org/download/freepd/misc/Dark%20Hallway.mp3'),
  ('mystery', 'Ancient Secrets', 'https://archive.org/download/freepd/scoring/Desert%20Fox%20Underscore.mp3'),
  ('mystery', 'Whispering Fog',  'https://archive.org/download/freepd/misc/Ancient%20Winds.mp3'),
  ('mystery', 'Haunted Hall',    'https://archive.org/download/freepd/misc/Cold%20Journey.mp3'),

  -- Tension / suspenseful
  ('tension', 'The Pursuit',      'https://archive.org/download/freepd/scoring/Beginning%20of%20Conflict.mp3'),
  ('tension', 'Rising Dread',     'https://archive.org/download/freepd/scoring/Find%20Them.mp3'),
  ('tension', 'Before the Storm', 'https://archive.org/download/freepd/scoring/The%20Drama.mp3'),
  ('tension', 'Crumbling Hope',   'https://archive.org/download/freepd/scoring/Desert%20Fox.mp3'),

  -- Combat / battle intense
  ('combat', 'Clash of Steel', 'https://archive.org/download/freepd/epic/Black%20Knight.mp3'),
  ('combat', 'Final Stand',    'https://archive.org/download/freepd/epic/Epic%20Boss%20Battle.mp3'),
  ('combat', 'Dragon Fight',   'https://archive.org/download/freepd/epic/Battle%20Ready.mp3'),
  ('combat', 'Boss Battle',    'https://archive.org/download/freepd/epic/Night%20Attack.mp3'),
  ('combat', 'Siege',          'https://archive.org/download/freepd/epic/Hit%20n%20Smash.mp3'),

  -- Victory / triumphant
  ('victory', 'Hero''s Triumph', 'https://archive.org/download/freepd/epic/Heroic%20Adventure.mp3'),
  ('victory', 'Glory March',     'https://archive.org/download/freepd/epic/Fanfare%20X.mp3'),

  -- Sadness / melancholic
  ('sadness', 'Fallen Comrade', 'https://archive.org/download/freepd/epic/Go%20On%20Without%20Me.mp3'),
  ('sadness', 'Lost and Alone', 'https://archive.org/download/freepd/misc/Infinite%20Peace.mp3');
