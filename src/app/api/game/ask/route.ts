import { NextRequest, NextResponse } from 'next/server';
import { gameStore } from '@/lib/store';
import { judgeAnswer, generateCharacter, getCharacterDescription } from '@/lib/ccs';
import { createQuestionRecord, getUser, endGameRecord, addCharacter, createGame, getExistingCharacterNames, getStats } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 检查锁定状态
    if (gameStore.getState().isLocked) {
      return NextResponse.json(
        { success: false, error: 'AI 正在判定中，请稍候' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userId, question } = body;

    if (!userId || !question) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取当前游戏状态
    const state = gameStore.getState();

    // 如果没有当前游戏，创建新游戏
    if (!state.currentGameId || !state.currentCharacter) {
      return NextResponse.json(
        { success: false, error: '没有进行中的游戏' },
        { status: 400 }
      );
    }

    // 加锁
    gameStore.setLocked(true);

    try {
      // 获取用户信息
      const user = await getUser(userId);

      // 调用 AI 判定
      const answer = await judgeAnswer(
        state.currentCharacter,
        state.currentCharacterDesc || '',
        question
      );

      // 存储问答记录
      const questionRecord = await createQuestionRecord(
        state.currentGameId,
        userId,
        question,
        answer
      );

      // 更新状态
      gameStore.addQuestion({
        ...questionRecord,
        user,
      } as any);

      // 如果猜对了
      if (answer === '猜对了') {
        // 结束游戏
        await endGameRecord(state.currentGameId, userId);

        // 添加到历史人物列表
        await addCharacter(state.currentCharacter);

        // 更新状态
        gameStore.endGame(userId);

        // 获取统计
        const stats = await getStats();
        gameStore.setState({
          totalGuessed: stats.totalGuessed,
          totalQuestions: stats.totalQuestions,
        });
      }

      // 解锁
      gameStore.setLocked(false);
      gameStore.notify('question:added');

      return NextResponse.json({
        success: true,
        answer,
        question: questionRecord,
      });
    } catch (error) {
      gameStore.setLocked(false);
      throw error;
    }
  } catch (error) {
    console.error('Ask error:', error);
    return NextResponse.json(
      { success: false, error: '提问失败' },
      { status: 500 }
    );
  }
}
