import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await loginUser(body);
  return NextResponse.json(result);
}