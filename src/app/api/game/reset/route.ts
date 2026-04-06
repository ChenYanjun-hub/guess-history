import { NextResponse } from 'next/server';
import { gameStore } from '@/lib/store';

export async function POST() {
  try {
    gameStore.reset();
    return NextResponse.json({ success: true, message: '状态已重置' });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { success: false, error: '重置失败' },
      { status: 500 }
    );
  }
}
