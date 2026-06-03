-- Cards: master deck (read-only for users)
CREATE TABLE cards (
  id BIGINT PRIMARY KEY,
  chinese TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  english TEXT NOT NULL,
  audio TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User progress per card (FSRS params)
CREATE TABLE user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  difficulty REAL DEFAULT 0.0,
  stability REAL DEFAULT 0.0,
  retrievability REAL DEFAULT 0.0,
  elapsed_days INTEGER DEFAULT 0,
  scheduled_days INTEGER DEFAULT 0,
  reps INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  state INTEGER DEFAULT 0,
  last_review TIMESTAMPTZ,
  due TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Profiles: user metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  dragon_level INTEGER DEFAULT 1,
  last_study_date DATE,
  daily_xp_goal INTEGER DEFAULT 30,
  daily_new_limit INTEGER DEFAULT 10,
  hanzi_mode TEXT DEFAULT 'simplified',
  pinyin_mode TEXT DEFAULT 'tones',
  language TEXT DEFAULT 'es',
  dark_mode BOOLEAN DEFAULT false,
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS: profiles are readable/updatable by the owner
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS: cards are readable by all authenticated users
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cards are readable by authenticated users"
  ON cards FOR SELECT USING (auth.role() = 'authenticated');

-- RLS: user_cards is private per user
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own progress"
  ON user_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own progress"
  ON user_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own progress"
  ON user_cards FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_user_cards_due ON user_cards(user_id, due);
CREATE INDEX idx_cards_tags ON cards USING GIN(tags);

-- Achievements: user unlocked badges
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own achievements"
  ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own achievements"
  ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shop: purchasable items
CREATE TABLE IF NOT EXISTS shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  price INTEGER NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'dragon_skin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User purchases
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES shop_items(id),
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read shop items"
  ON shop_items FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own purchases"
  ON user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own purchases"
  ON user_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert default shop items
INSERT INTO shop_items (id, name, description, icon, price, item_type) VALUES
  ('skin_ruby', 'Dragon Rubí', 'Tu dragón brilla en rojo rubí', '🔴', 200, 'dragon_skin'),
  ('skin_sapphire', 'Dragon Zafiro', 'Tu dragón resplandece en azul zafiro', '🔵', 500, 'dragon_skin'),
  ('skin_amethyst', 'Dragon Amatista', 'Tu dragón irradia púrpura amatista', '🟣', 1000, 'dragon_skin'),
  ('skin_gold', 'Dragon Dorado', 'Tu dragón es de oro puro', '🟡', 2000, 'dragon_skin'),
  ('theme_night', 'Tema Nocturno', 'Fondo oscuro premium con estrellas', '🌙', 300, 'theme')
ON CONFLICT (id) DO NOTHING;

-- Daily quests: user progress
CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  goal INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  date DATE NOT NULL,
  UNIQUE(user_id, quest_id, date)
);

ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own quests"
  ON daily_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users can insert own quests"
  ON daily_quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own quests"
  ON daily_quests FOR UPDATE USING (auth.uid() = user_id);
