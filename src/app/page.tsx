'use client';

import { useState, useEffect } from 'react';
import EntryPopup from '@/components/EntryPopup';
import MainContent from '@/components/MainContent';

export default function Home() {
  const [showEntry, setShowEntry] = useState(false);
  const [user, setUser] = useState<{ id: string; emoji: string; nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查是否已有用户信息
    const savedUserId = localStorage.getItem('userId');
    const savedUser = localStorage.getItem('userInfo');

    if (savedUserId && savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
    } else {
      setShowEntry(true);
      setLoading(false);
    }
  }, []);

  const handleEntryComplete = (userInfo: { id: string; emoji: string; nickname: string }) => {
    localStorage.setItem('userId', userInfo.id);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
    setShowEntry(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-ink-muted">加载中...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative z-10">
      {showEntry && <EntryPopup onComplete={handleEntryComplete} />}
      {user && !showEntry && <MainContent user={user} />}
    </main>
  );
}
