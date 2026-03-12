-- Sound library (curated, read-only for users)
CREATE TABLE sound_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('loop', 'one-shot')),
  file_url TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🔊'
);

-- Mood music library (curated, read-only for users)
CREATE TABLE mood_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mood TEXT NOT NULL CHECK (mood IN ('calm', 'mystery', 'tension', 'combat', 'victory', 'sadness')),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL
);

-- User scenes
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🗺️',
  session_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sounds assigned to a scene
CREATE TABLE scene_sounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  sound_id UUID NOT NULL REFERENCES sound_library(id),
  autoplay BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE(scene_id, sound_id)
);

-- Per-user mood session config (which moods are active for current session)
CREATE TABLE session_moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('calm', 'mystery', 'tension', 'combat', 'victory', 'sadness')),
  session_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, mood)
);

-- RLS
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own scenes"
  ON scenes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own scene sounds"
  ON scene_sounds FOR ALL USING (
    scene_id IN (SELECT id FROM scenes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users manage own session moods"
  ON session_moods FOR ALL USING (auth.uid() = user_id);

-- sound_library and mood_library are public read-only
ALTER TABLE sound_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read sound library" ON sound_library FOR SELECT USING (true);
CREATE POLICY "Anyone can read mood library" ON mood_library FOR SELECT USING (true);
