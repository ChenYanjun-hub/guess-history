import { NextRequest, NextResponse } from 'next/server';
import { getCompletedGames, getQuestionsByGame, getUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (gameId) {
      // 获取特定游戏的问答记录
      const questions = await getQuestionsByGame(parseInt(gameId));

      // 获取用户信息
      const questionsWithUsers = await Promise.all(
        questions.map(async (q) => {
          const user = await getUser(q.userId);
          return { ...q, user };
        })
      );

      return NextResponse.json({
        success: true,
        questions: questionsWithUsers,
      });
    }

    // 获取已完成的游戏列表
    const games = await getCompletedGames();

    return NextResponse.json({
      success: true,
      games,
    });
  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { success: false, error: '获取历史记录失败' },
      { status: 500 }
    );
  }
}
