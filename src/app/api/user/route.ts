import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, emoji, nickname } = body;

    // 如果有 id，尝试获取已有用户
    if (id) {
      const existingUser = await getUser(id);
      if (existingUser) {
        return NextResponse.json({ success: true, user: existingUser });
      }
    }

    // 创建新用户
    const newId = id || randomUUID();
    const user = await createUser(newId, emoji, nickname);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: '创建用户失败' },
      { status: 500 }
    );
  }
}
