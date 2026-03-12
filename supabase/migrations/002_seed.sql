-- Placeholder file URLs — replace with real Supabase Storage URLs after uploading audio files

INSERT INTO sound_library (name, category, type, emoji, file_url) VALUES
  -- Tavern
  ('Tavern crowd', 'tavern', 'loop', '🍺', 'https://placeholder/tavern-crowd.mp3'),
  ('Fireplace crackling', 'tavern', 'loop', '🔥', 'https://placeholder/fireplace.mp3'),
  ('Coins on table', 'tavern', 'one-shot', '💰', 'https://placeholder/coins.mp3'),
  -- Cave / Dungeon
  ('Water dripping', 'cave', 'loop', '💧', 'https://placeholder/drip.mp3'),
  ('Underground wind', 'cave', 'loop', '💨', 'https://placeholder/cave-wind.mp3'),
  ('Creaking door', 'cave', 'one-shot', '🚪', 'https://placeholder/door-creak.mp3'),
  ('Distant thunder', 'cave', 'one-shot', '⚡', 'https://placeholder/thunder.mp3'),
  ('Rats and scurrying', 'cave', 'loop', '🐀', 'https://placeholder/rats.mp3'),
  ('Eerie whispers', 'cave', 'loop', '👻', 'https://placeholder/whispers.mp3'),
  ('Torch flickering', 'cave', 'loop', '🔦', 'https://placeholder/torch.mp3'),
  -- Forest
  ('Birds and wind', 'forest', 'loop', '🌲', 'https://placeholder/forest.mp3'),
  ('Rain on leaves', 'forest', 'loop', '🌧️', 'https://placeholder/rain.mp3'),
  ('Wolves howling', 'forest', 'one-shot', '🐺', 'https://placeholder/wolves.mp3'),
  ('Stream flowing', 'forest', 'loop', '🌊', 'https://placeholder/stream.mp3'),
  -- City
  ('City crowds', 'city', 'loop', '🏙️', 'https://placeholder/city.mp3'),
  ('Market chatter', 'city', 'loop', '🛒', 'https://placeholder/market.mp3'),
  ('Angry mob', 'city', 'loop', '😤', 'https://placeholder/mob.mp3'),
  ('Church bells', 'city', 'one-shot', '🔔', 'https://placeholder/bells.mp3'),
  -- Castle
  ('Castle wind', 'castle', 'loop', '🏰', 'https://placeholder/castle-wind.mp3'),
  ('Heavy gate', 'castle', 'one-shot', '⛩️', 'https://placeholder/gate.mp3'),
  ('Dungeon chains', 'castle', 'loop', '⛓️', 'https://placeholder/chains.mp3');

INSERT INTO mood_library (mood, name, file_url) VALUES
  ('calm', 'Meadow Rest', 'https://placeholder/calm-1.mp3'),
  ('calm', 'Tavern Lute', 'https://placeholder/calm-2.mp3'),
  ('calm', 'Gentle Strings', 'https://placeholder/calm-3.mp3'),
  ('mystery', 'Dark Corridors', 'https://placeholder/mystery-1.mp3'),
  ('mystery', 'Ancient Secrets', 'https://placeholder/mystery-2.mp3'),
  ('mystery', 'Whispering Fog', 'https://placeholder/mystery-3.mp3'),
  ('mystery', 'Haunted Hall', 'https://placeholder/mystery-4.mp3'),
  ('tension', 'The Pursuit', 'https://placeholder/tension-1.mp3'),
  ('tension', 'Rising Dread', 'https://placeholder/tension-2.mp3'),
  ('tension', 'Before the Storm', 'https://placeholder/tension-3.mp3'),
  ('tension', 'Crumbling Hope', 'https://placeholder/tension-4.mp3'),
  ('combat', 'Clash of Steel', 'https://placeholder/combat-1.mp3'),
  ('combat', 'Final Stand', 'https://placeholder/combat-2.mp3'),
  ('combat', 'Dragon Fight', 'https://placeholder/combat-3.mp3'),
  ('combat', 'Boss Battle', 'https://placeholder/combat-4.mp3'),
  ('combat', 'Siege', 'https://placeholder/combat-5.mp3'),
  ('victory', 'Hero''s Triumph', 'https://placeholder/victory-1.mp3'),
  ('victory', 'Glory March', 'https://placeholder/victory-2.mp3'),
  ('sadness', 'Fallen Comrade', 'https://placeholder/sadness-1.mp3'),
  ('sadness', 'Lost and Alone', 'https://placeholder/sadness-2.mp3');
