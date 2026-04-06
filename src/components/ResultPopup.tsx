'use client';

interface ResultPopupProps {
  winner: string;
  characterName: string;
  onNewGame: () => void;
  onBackHome: () => void;
}

export default function ResultPopup({ winner, characterName, onNewGame, onBackHome }: ResultPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-paper-light rounded-2xl p-6 w-[90%] max-w-sm shadow-xl border border-paper-dark/20 text-center">
        {/* 庆祝图标 */}
        <div className="text-6xl mb-4">🎉</div>

        {/* 标题 */}
        <h2 className="text-xl font-semibold text-ink mb-2" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
          猜对了！
        </h2>

        {/* 内容 */}
        <p className="text-ink-light mb-6">
          <span className="text-warm-orange font-medium">{winner}</span>
          {' '}猜对了！答案是{' '}
          <span className="text-seal-red font-semibold">{characterName}</span>
          ！
        </p>

        {/* 按钮组 */}
        <div className="space-y-3">
          <button
            onClick={onNewGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-warm-yellow to-warm-orange text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            再猜一个
          </button>
          <button
            onClick={onBackHome}
            className="w-full py-3 rounded-xl bg-paper-dark/30 text-ink hover:bg-paper-dark/50 transition-colors"
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
}
