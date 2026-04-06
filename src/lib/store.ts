import type { GameState, Question, GameEvent, GameEventType } from '@/types';

// 全局游戏状态
class GameStore {
  private state: GameState = {
    currentGameId: null,
    currentCharacter: null,
    currentCharacterDesc: '',
    hints: [],
    questions: [],
    isLocked: false,
    totalGuessed: 0,
    totalQuestions: 0,
  };

  private subscribers = new Set<(event: GameEvent) => void>();
  private eventQueue: GameEvent[] = [];

  // 获取当前状态
  getState(): GameState {
    return { ...this.state };
  }

  // 更新状态
  setState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
  }

  // 订阅状态变更
  subscribe(callback: (event: GameEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // 通知所有订阅者
  notify(type: GameEventType): void {
    const event: GameEvent = {
      type,
      payload: this.getState(),
    };

    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // 添加问题
  addQuestion(question: Question): void {
    this.state.questions.push(question);
    this.state.totalQuestions++;
  }

  // 设置锁定状态
  setLocked(locked: boolean): void {
    this.state.isLocked = locked;
    this.notify('lock:changed');
  }

  // 开始新游戏
  startNewGame(gameId: number, character: string, desc: string, hints: string[] = []): void {
    this.state = {
      currentGameId: gameId,
      currentCharacter: character,
      currentCharacterDesc: desc,
      hints,
      questions: [],
      isLocked: false,
      totalGuessed: this.state.totalGuessed,
      totalQuestions: this.state.totalQuestions,
    };
    this.notify('game:new');
  }

  // 重置状态（用于异常恢复）
  reset(): void {
    this.state = {
      currentGameId: null,
      currentCharacter: null,
      currentCharacterDesc: '',
      hints: [],
      questions: [],
      isLocked: false,
      totalGuessed: this.state.totalGuessed,
      totalQuestions: this.state.totalQuestions,
    };
    this.notify('game:reset');
  }

  // 结束游戏（猜对了）
  endGame(winnerId: string): void {
    this.state.totalGuessed++;
    this.notify('game:ended');
  }

  // 清空问题列表
  clearQuestions(): void {
    this.state.questions = [];
  }
}

// 导出单例
export const gameStore = new GameStore();
