import { NextResponse } from 'next/server'
import { getAvailableProviders, isAIAvailable } from '@/lib/ai/orchestrator'

export async function GET() {
  const providers = getAvailableProviders()
  const aiAvailable = isAIAvailable()

  return NextResponse.json({
    aiAvailable,
    providers,
    configured: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      mongodb: !!process.env.NEXT_PUBLIC_MONGODB_URL,
    },
    defaults: {
      framework: 'framer-motion',
      model: 'auto',
    },
  })
}
