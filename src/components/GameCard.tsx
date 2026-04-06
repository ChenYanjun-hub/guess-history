'use client';

interface GameCardProps {
  questionCount: number;
  onClick: () => void;
}

export default function GameCard({ questionCount, onClick }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-64 h-64 rounded-3xl bg-gradient-to-br from-paper to-paper-dark border-2 border-paper-dark/30 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-4"
    >
      {/* 问号图标 */}
      <div
        className="text-8xl text-ink/80"
        style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
      >
        ?
      </div>

      {/* 已提问次数 */}
      <div className="text-sm text-ink-muted">
        已提问 {questionCount} 次
      </div>

      {/* 点击提示 */}
      <div className="text-xs text-ink-light mt-2">
        点击开始猜谜
      </div>
    </button>
  );
}
