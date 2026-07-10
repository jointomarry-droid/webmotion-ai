import { NextRequest, NextResponse } from 'next/server'
import { generateWithAI, type AnimationFramework, type AIProvider } from '@/lib/ai/orchestrator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, framework = 'framer-motion', model, provider } = body

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const result = await generateWithAI({
      prompt,
      framework: framework as AnimationFramework,
      model,
      provider: provider as AIProvider | undefined,
    })

    return NextResponse.json({
      content: result.content,
      tokens_used: result.tokens,
      model: result.model,
      provider: result.provider,
      framework,
      latency: result.latency,
    })
  } catch (error) {
    console.error('Animation generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate animation' },
      { status: 500 }
    )
  }
}
