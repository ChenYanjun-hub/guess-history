import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { eq, desc, isNull, isNotNull, sql } from 'drizzle-orm';

// 数据库连接
const connectionString = process.env.DATABASE_URL;

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!client && connectionString) {
    client = postgres(connectionString);
    db = drizzle(client, { schema });
  }
  return db;
}

// 导出 schema
export * from './schema';

// 用户操作
export async function createUser(id: string, emoji: string, nickname: string) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.insert(schema.users).values({ id, emoji, nickname }).returning();
  return result[0];
}

export async function getUser(id: string) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.select().from(schema.users).where(eq(schema.users.id, id));
  return result[0];
}

// 游戏操作
export async function createGame(characterName: string, characterDesc?: string) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.insert(schema.games).values({ characterName, characterDesc }).returning();
  return result[0];
}

export async function getCurrentGame() {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.select().from(schema.games).where(isNull(schema.games.endedAt)).orderBy(desc(schema.games.startedAt)).limit(1);
  return result[0];
}

export async function getGameById(gameId: number) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.select().from(schema.games).where(eq(schema.games.id, gameId));
  return result[0];
}

export async function endGameRecord(gameId: number, winnerId: string) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.update(schema.games).set({ endedAt: new Date(), winnerId }).where(eq(schema.games.id, gameId)).returning();
  return result[0];
}

// 问答操作
export async function createQuestionRecord(gameId: number, userId: string, questionText: string, answer: string) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.insert(schema.questions).values({ gameId, userId, questionText, answer }).returning();
  return result[0];
}

export async function getQuestionsByGame(gameId: number) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  return database.select().from(schema.questions).where(eq(schema.questions.gameId, gameId)).orderBy(schema.questions.createdAt);
}

// 历史人物操作
export async function addCharacter(name: string) {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  try {
    const result = await database.insert(schema.characters).values({ name }).returning();
    return result[0];
  } catch {
    // 已存在，忽略
    return null;
  }
}

export async function getExistingCharacterNames() {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  const result = await database.select({ name: schema.characters.name }).from(schema.characters);
  return result.map(r => r.name);
}

// 统计数据
export async function getStats() {
  const database = getDb();
  if (!database) throw new Error('Database not configured');

  const completedGames = await database.select().from(schema.games).where(isNotNull(schema.games.endedAt));
  const allQuestions = await database.select().from(schema.questions);

  return {
    totalGuessed: completedGames.length,
    totalQuestions: allQuestions.length,
  };
}

// 历史记录
export async function getCompletedGames() {
  const database = getDb();
  if (!database) throw new Error('Database not configured');
  return database.select().from(schema.games).where(isNotNull(schema.games.endedAt)).orderBy(desc(schema.games.endedAt));
}
