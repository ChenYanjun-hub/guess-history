'use client';

import { useState } from 'react';
import HistoryPopup from './HistoryPopup';

interface HistoryListProps {
  games: Array<{
    id: number;
    characterName: string;
    winnerId: string;
    endedAt: string;
  }>;
}

export default function HistoryList({ games }: HistoryListProps) {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-ink-muted text-sm">
        还没有猜出的历史人物
      </div>
    );
  }

  return (
    <>
      <div className="border-t border-paper-dark/30 pt-4">
        <h3 className="text-sm text-ink-light mb-3 px-2">已猜出的人物</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
            >
              <span className="text-ink font-medium">{game.characterName}</span>
              <span className="text-xs text-ink-muted">
                {new Date(game.endedAt).toLocaleDateString('zh-CN')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedGame && (
        <HistoryPopup
          gameId={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </>
  );
}
