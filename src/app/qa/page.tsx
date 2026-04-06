'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ChatBubble from '@/components/ChatBubble';
import ResultPopup from '@/components/ResultPopup';
import type { GameState, GameEvent, AnswerType } from '@/types';

export default function QAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-ink-muted">加载中...</div>}>
      <QAContent />
    </Suspense>
  );
}

function QAContent() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<{ nickname: string; characterName: string } | null>(null);
  const [user, setUser] = useState<{ id: string; emoji: string; nickname: string } | null>(null);

  // 获取用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  // 初始化游戏
  const initGame = useCallback(async () => {
    try {
      const res = await fetch('/api/game/new', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchGameState();
      }
    } catch (error) {
      console.error('Init game error:', error);
    }
  }, [fetchGameState]);

  // SSE 连接
  useEffect(() => {
    fetchGameState();

    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        const gameEvent: GameEvent = JSON.parse(event.data);
        setGameState(gameEvent.payload);

        // 检查是否猜对
        if (gameEvent.type === 'game:ended') {
          const lastQuestion = gameEvent.payload.questions[gameEvent.payload.questions.length - 1];
          if (lastQuestion?.answer === '猜对了') {
            setWinner({
              nickname: lastQuestion.user?.nickname || '有人',
              characterName: gameEvent.payload.currentCharacter || '',
            });
            setShowResult(true);
          }
        }
      } catch (error) {
        console.error('Parse event error:', error);
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection lost');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [fetchGameState]);

  // 如果没有游戏，初始化一个
  useEffect(() => {
    if (gameState && !gameState.currentGameId) {
      initGame();
    }
  }, [gameState, initGame]);

  // 提交问题
  const handleSubmit = async () => {
    if (!inputValue.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    setInputValue('');

    try {
      const res = await fetch('/api/game/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          question: inputValue.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || '提问失败');
      }
    } catch (error) {
      console.error('Ask error:', error);
      alert('网络错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 开始新游戏
  const handleNewGame = async () => {
    setShowResult(false);
    setWinner(null);
    await initGame();
  };

  // 返回主页
  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部 */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-paper-light/90 backdrop-blur border-b border-paper-dark/20">
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-full bg-paper hover:bg-paper-dark/50 flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-ink" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
          猜历史人物
        </h1>
      </header>

      {/* 问答时间线 */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {gameState?.questions?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-ink-muted text-center px-4">
            <div className="text-4xl mb-4">📜</div>
            <div className="text-lg font-medium text-ink mb-4" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
              线索提示
            </div>
            {gameState?.hints?.length > 0 ? (
              <div className="space-y-3 w-full max-w-sm">
                {gameState.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="bg-paper/80 border border-paper-dark/30 rounded-lg px-4 py-3 text-ink animate-fadeIn"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <span className="text-warm-orange font-medium mr-2">{index + 1}.</span>
                    {hint}
                  </div>
                ))}
              </div>
            ) : (
              <div>正在生成线索...</div>
            )}
            <div className="mt-6 text-sm">输入问题开始猜谜</div>
          </div>
        ) : (
          <div className="space-y-6">
            {gameState?.questions?.map((q, index) => (
              <ChatBubble
                key={q.id}
                index={index + 1}
                question={q.questionText}
                answer={q.answer}
                user={q.user}
              />
            ))}

            {/* AI 判定中 */}
            {gameState?.isLocked && (
              <div className="flex items-center gap-2 text-ink-muted">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>AI 判定中...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 输入区 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-paper-light/95 backdrop-blur border-t border-paper-dark/20">
        <div className="max-w-lg mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="是某个朝代/身份/性别/功绩...吗？"
            disabled={gameState?.isLocked || isSubmitting}
            className="flex-1 px-4 py-3 rounded-full bg-white/50 border border-paper-dark/30 text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-warm-orange/50 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || gameState?.isLocked || isSubmitting}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-yellow to-warm-orange text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="text-center text-xs text-ink-muted mt-2">
          AI 只能回答：是 / 不是 / 不确定 / 无关 / 猜对了
        </div>
      </div>

      {/* 猜对弹窗 */}
      {showResult && winner && (
        <ResultPopup
          winner={winner.nickname}
          characterName={winner.characterName}
          onNewGame={handleNewGame}
          onBackHome={handleBackHome}
        />
      )}
    </div>
  );
}
