import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, tone, wordCount, type } = body

    const content = generateContent(topic, tone, wordCount, type)

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

function generateContent(topic: string, tone: string, wordCount: string, type: string) {
  const wordCounts = { short: 400, medium: 1000, long: 2000 }
  const targetWords = wordCounts[wordCount as keyof typeof wordCounts] || 1000

  if (type === 'blog') {
    return {
      title: `The Ultimate Guide to ${topic}`,
      sections: [
        {
          heading: `Understanding ${topic}`,
          content: `In today's rapidly evolving digital landscape, ${topic} has become increasingly important. This comprehensive guide will walk you through everything you need to know.\n\n## Why ${topic} Matters\n\n${topic} is crucial for several reasons:\n\n1. **Market Demand** - The demand continues to grow\n2. **Competitive Advantage** - Organizations that master this gain an edge\n3. **Future-Proofing** - These skills remain relevant\n\n## Key Concepts\n\nBefore diving deeper, let's establish a solid foundation.\n\n### The Fundamentals\n\nEvery great understanding starts with the basics. ${topic} is no different.\n\n### Strategic Approach\n\nOnce you understand the basics, it's time to develop a strategic approach.\n\n## Best Practices\n\n- Start with manageable projects\n- Measure everything from day one\n- Iterate constantly using data\n- Stay updated with latest trends\n\n## Getting Started\n\n1. Assess your current situation\n2. Define clear objectives\n3. Create a roadmap\n4. Take the first step today`,
          metaDescription: `Learn everything about ${topic} in this comprehensive guide.`,
          keywords: [topic, `${topic} guide`, `${topic} tips`],
          readTime: `${Math.ceil(targetWords / 200)} min read`,
        },
      ],
    }
  }

  if (type === 'email') {
    return {
      title: `Email: ${topic}`,
      sections: [
        {
          heading: topic,
          content: `Subject: ${topic}\n\nHi there,\n\nWe're excited to share some updates with you.\n\n${topic} is something we've been working hard on, and we think you'll love the results.\n\nHere's what's new:\n\n• Improved performance\n• Better user experience\n• New features you've been asking for\n\nWe'd love to hear your feedback!\n\nBest regards,\nThe Team`,
          metaDescription: '',
          keywords: [],
          readTime: '1 min read',
        },
      ],
    }
  }

  return {
    title: topic,
    sections: [
      {
        heading: topic,
        content: `Discover ${topic}. This is a comprehensive piece covering all aspects.`,
        metaDescription: `Learn about ${topic}`,
        keywords: [topic],
        readTime: '2 min read',
      },
    ],
  }
}
