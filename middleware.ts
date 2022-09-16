import { NextRequest, NextResponse } from 'next/server';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { Token } from './src/types/token';

export function middleware(req: NextRequest) {
  console.log('middleware file');

  return NextResponse.rewrite(req.url);
}
