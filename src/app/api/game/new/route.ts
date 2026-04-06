import { NextResponse } from 'next/server';
import { gameStore } from '@/lib/store';
import { generateCharacter, getCharacterDescription, generateHints } from '@/lib/ccs';
import { createGame, getExistingCharacterNames, getStats } from '@/lib/db';

export async function POST() {
  try {
    // 检查锁定状态
    if (gameStore.getState().isLocked) {
      return NextResponse.json(
        { success: false, error: 'AI 正在判定中，请稍候' },
        { status: 429 }
      );
    }

    // 加锁
    gameStore.setLocked(true);

    try {
      // 获取已存在的人物名
      const existingNames = await getExistingCharacterNames();

      // 生成新人物
      const characterName = await generateCharacter(existingNames);
      const characterDesc = await getCharacterDescription(characterName);

      // 生成初始提示
      const hints = await generateHints(characterName);

      // 创建游戏记录
      const game = await createGame(characterName, characterDesc);

      // 更新状态
      gameStore.startNewGame(game.id, characterName, characterDesc, hints);

      // 获取统计
      const stats = await getStats();
      gameStore.setState({
        totalGuessed: stats.totalGuessed,
        totalQuestions: stats.totalQuestions,
      });

      // 解锁
      gameStore.setLocked(false);

      return NextResponse.json({
        success: true,
        game: {
          id: game.id,
          characterName,
          hints,
        },
      });
    } catch (error) {
      gameStore.setLocked(false);
      throw error;
    }
  } catch (error) {
    console.error('New game error:', error);
    return NextResponse.json(
      { success: false, error: '创建新游戏失败' },
      { status: 500 }
    );
  }
}
