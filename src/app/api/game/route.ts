import { NextResponse } from 'next/server';
import { gameStore } from '@/lib/store';

export async function GET() {
  try {
    const state = gameStore.getState();

    // 检测异常状态：锁定但没有游戏，自动修复
    if (state.isLocked && !state.currentGameId) {
      console.log('检测到异常状态（锁定但无游戏），自动重置');
      gameStore.reset();
    }

    return NextResponse.json({ success: true, state: gameStore.getState() });
  } catch (error) {
    console.error('Get game state error:', error);
    return NextResponse.json(
      { success: false, error: '获取游戏状态失败' },
      { status: 500 }
    );
  }
}
