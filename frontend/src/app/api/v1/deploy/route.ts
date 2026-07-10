import { NextRequest, NextResponse } from 'next/server'
import { buildProjectFiles, deployToVercel } from '@/lib/deploy/vercel'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, componentName, projectName, deploy } = body

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      )
    }

    // Build project files from generated code
    const files = buildProjectFiles(code, componentName || 'AnimatedComponent')

    if (deploy) {
      // Deploy to Vercel
      const vercelToken = process.env.VERCEL_TOKEN
      const result = await deployToVercel(
        {
          projectName: projectName || 'webmotion-deploy',
          framework: 'nextjs',
          files,
        },
        vercelToken
      )

      return NextResponse.json({
        success: result.success,
        url: result.url,
        projectId: result.projectId,
        deploymentId: result.deploymentId,
        error: result.error,
        files: files.length,
      })
    }

    // Just build and return file list
    return NextResponse.json({
      success: true,
      files: files.map(f => ({ path: f.path, size: f.content.length })),
      totalFiles: files.length,
      totalSize: files.reduce((acc, f) => acc + f.content.length, 0),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Build failed' },
      { status: 500 }
    )
  }
}
