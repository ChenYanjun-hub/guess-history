'use client';

import { useState } from 'react';

const EMOJI_LIST = [
  '🎭', '🖌️', '📚', '⚔️', '🎵', '🎨', '🗡️', '📜', '🏺', '🎯',
  '🎪', '🌟', '🔥', '💎', '🌸', '🍀', '🌙', '☀️', '🌊', '⛰️',
  '🦊', '🐉', '🦅', '🐺', '🦁', '🐯', '🐴', '🐮', '🐰', '🐱',
];

interface EntryPopupProps {
  onComplete: (user: { id: string; emoji: string; nickname: string }) => void;
}

export default function EntryPopup({ onComplete }: EntryPopupProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!selectedEmoji) {
      setError('请选择一个头像');
      return;
    }

    if (nickname.length < 2 || nickname.length > 8) {
      setError('昵称需要 2-8 个字符');
      return;
    }

    try {
      // 生成用户 ID
      const id = crypto.randomUUID();

      // 调用 API 创建用户
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, emoji: selectedEmoji, nickname }),
      });

      const data = await res.json();

      if (data.success) {
        onComplete(data.user);
      } else {
        setError(data.error || '创建用户失败');
      }
    } catch {
      setError('网络错误，请重试');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-paper-light rounded-2xl p-6 w-[90%] max-w-sm shadow-xl border border-paper-dark/20">
        <h2 className="text-xl font-semibold text-ink text-center mb-6" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
          欢迎来到猜历史人物
        </h2>

        {/* Emoji 选择 */}
        <div className="mb-4">
          <label className="block text-sm text-ink-light mb-2">选择你的头像</label>
          <div className="grid grid-cols-10 gap-1">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-8 h-8 text-lg rounded-lg transition-all ${
                  selectedEmoji === emoji
                    ? 'bg-warm-yellow/50 ring-2 ring-warm-orange scale-110'
                    : 'bg-paper hover:bg-paper-dark/50'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 昵称输入 */}
        <div className="mb-4">
          <label className="block text-sm text-ink-light mb-2">输入你的昵称（2-8 字）</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={8}
            placeholder="例如：游侠"
            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-paper-dark/30 text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 text-sm text-seal-red text-center">{error}</div>
        )}

        {/* 确认按钮 */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-warm-yellow to-warm-orange text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          开始游戏
        </button>
      </div>
    </div>
  );
}
