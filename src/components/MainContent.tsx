'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import GameCard from './GameCard';
import HistoryList from './HistoryList';
import type { GameState, GameEvent } from '@/types';

interface MainContentProps {
  user: { id: string; emoji: string; nickname: string };
}

export default function MainContent({ user }: MainContentProps) {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [completedGames, setCompletedGames] = useState<any[]>([]);

  // 获取初始状态
  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      if (data.success) {
        setGameState(data.state);
      }
    } catch (error) {
      console.error('Fetch game state error:', error);
    }
  }, []);

  // 获取历史记录
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        setCompletedGames(data.games || []);
      }
    } catch (error) {
      console.error('Fetch history error:', error);
    }
  }, []);

  // SSE 连接
  useEffect(() => {
    fetchGameState();
    fetchHistory();

    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        const gameEvent: GameEvent = JSON.parse(event.data);
        setGameState(gameEvent.payload);

        // 如果游戏结束，刷新历史
        if (gameEvent.type === 'game:ended') {
          fetchHistory();
        }
      } catch (error) {
        console.error('Parse event error:', error);
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection lost, reconnecting...');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [fetchGameState, fetchHistory]);

  const handleCardClick = () => {
    router.push('/qa');
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* 顶部状态栏 */}
      <header className="flex justify-center gap-8 py-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-warm-orange" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
            {gameState?.totalGuessed || 0}
          </div>
          <div className="text-xs text-ink-muted">累计猜对</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-warm-orange" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
            {gameState?.totalQuestions || 0}
          </div>
          <div className="text-xs text-ink-muted">累计提问</div>
        </div>
      </header>

      {/* 中央猜谜卡片 */}
      <div className="flex-1 flex items-center justify-center">
        <GameCard
          questionCount={gameState?.questions?.length || 0}
          onClick={handleCardClick}
        />
      </div>

      {/* 底部历史列表 */}
      <HistoryList games={completedGames} />
    </div>
  );
}
