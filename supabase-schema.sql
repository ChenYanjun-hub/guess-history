-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji VARCHAR(4) NOT NULL,
  nickname VARCHAR(8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 游戏场次表
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  character_name VARCHAR(50) NOT NULL,
  character_desc TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  winner_id UUID REFERENCES users(id)
);

-- 问答记录表
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id),
  user_id UUID REFERENCES users(id),
  question_text TEXT NOT NULL,
  answer VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 历史人物表（防重复）
CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
