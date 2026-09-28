import { NextResponse } from 'next/server';

// Versión publicada (61 Gate 9): permite comprobar que producción corre el
// mismo commit que la evidencia de la auditoría. No expone nada sensible.
export function GET() {
  return NextResponse.json({
    git_sha: process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    env: process.env.VERCEL_ENV ?? 'development',
  });
}
