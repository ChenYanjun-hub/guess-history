'use client';

import { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import type { AnswerType } from '@/types';

interface HistoryPopupProps {
  gameId: number;
  onClose: () => void;
}

interface Question {
  id: number;
  questionText: string;
  answer: AnswerType;
  user?: {
    emoji: string;
    nickname: string;
  };
  createdAt: string;
}

export default function HistoryPopup({ gameId, onClose }: HistoryPopupProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/history?gameId=${gameId}`);
        const data = await res.json();
        if (data.success) {
          const typedQuestions = data.questions.map((q: any) => ({
            ...q,
            answer: q.answer as AnswerType,
          }));
          setQuestions(typedQuestions);
        }
      } catch (error) {
        console.error('Fetch questions error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [gameId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-paper-light rounded-2xl w-[90%] max-w-md max-h-[80vh] flex flex-col shadow-xl border border-paper-dark/20">
        <div className="flex items-center justify-between p-4 border-b border-paper-dark/20">
          <h2 className="text-lg font-semibold text-ink" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
            历史问答
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-paper hover:bg-paper-dark/50 flex items-center justify-center text-ink-light"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-ink-muted py-8">加载中...</div>
          ) : questions.length === 0 ? (
            <div className="text-center text-ink-muted py-8">暂无问答记录</div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <ChatBubble
                  key={q.id}
                  index={index + 1}
                  question={q.questionText}
                  answer={q.answer}
                  user={q.user}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-paper-dark/20">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-paper-dark/30 text-ink hover:bg-paper-dark/50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
