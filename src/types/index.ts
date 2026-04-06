// 用户类型
export interface User {
  id: string;
  emoji: string;
  nickname: string;
  createdAt: Date;
}

// 游戏类型
export interface Game {
  id: number;
  characterName: string;
  characterDesc?: string;
  startedAt: Date;
  endedAt?: Date;
  winnerId?: string;
  winner?: User;
}

// 问答记录类型
export interface Question {
  id: number;
  gameId: number;
  userId: string;
  user?: User;
  questionText: string;
  answer: AnswerType;
  createdAt: Date;
}

// AI 回答类型
export type AnswerType = '是' | '不是' | '不确定' | '无关' | '猜对了';

// 游戏状态类型
export interface GameState {
  currentGameId: number | null;
  currentCharacter: string | null;
  currentCharacterDesc?: string;
  hints: string[];
  questions: Question[];
  isLocked: boolean;
  totalGuessed: number;
  totalQuestions: number;
}

// 历史人物类型
export interface Character {
  id: number;
  name: string;
  createdAt: Date;
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// SSE 事件类型
export type GameEventType =
  | 'game:new'
  | 'question:added'
  | 'game:ended'
  | 'lock:changed';

export interface GameEvent {
  type: GameEventType;
  payload: GameState;
}
