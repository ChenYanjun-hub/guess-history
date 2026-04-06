'use client';
import type { AnswerType } from '@/types';

interface ChatBubbleProps {
  index: number;
  question: string;
  answer: AnswerType;
  user?: {
    emoji: string;
    nickname: string;
  };
}

const answerColors: Record<AnswerType, string> = {
  '是': 'text-accent-green',
  '不是': 'text-seal-red',
  '不确定': 'text-warm-orange',
  '无关': 'text-ink-muted',
  '猜对了': 'text-seal-red font-semibold text-lg',
};

export default function ChatBubble({ index, question, answer, user }: ChatBubbleProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 时间线标记 */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-paper-dark border-2 border-ink-muted flex items-center justify-center text-xs text-ink-light font-medium">
          {index}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-ink-muted/50 to-transparent" />
      </div>

      {/* 用户问题气泡 */}
      <div className="flex flex-col items-end">
        <div className="bg-gradient-to-br from-ink to-ink-light text-paper-light px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] shadow-md">
          {question}
        </div>
        {user && (
          <div className="flex items-center gap-1 mt-1 text-xs text-ink-muted">
            <span>{user.nickname}</span>
            <span>{user.emoji}</span>
          </div>
        )}
      </div>

      {/* AI 回答气泡 */}
      <div className="flex flex-col items-start">
        <div className="bg-warm-yellow/20 border border-warm-yellow/40 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[85%]">
          <span className={answerColors[answer]}>{answer}</span>
        </div>
        <div className="text-xs text-ink-muted mt-1">AI 判定</div>
      </div>
    </div>
  );
}
