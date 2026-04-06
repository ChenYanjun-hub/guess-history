import { pgTable, uuid, varchar, text, timestamp, serial, integer, boolean } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  emoji: varchar('emoji', { length: 4 }).notNull(),
  nickname: varchar('nickname', { length: 8 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 游戏场次表
export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  characterName: varchar('character_name', { length: 50 }).notNull(),
  characterDesc: text('character_desc'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  winnerId: uuid('winner_id').references(() => users.id),
});

// 问答记录表
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').references(() => games.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  questionText: text('question_text').notNull(),
  answer: varchar('answer', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 历史人物表（防重复）
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Character = typeof characters.$inferSelect;
