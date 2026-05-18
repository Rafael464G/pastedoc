import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDoc } from '@/lib/claude'
import type { Template } from '@/types'

export const runtime = 'edge'

const VALID_TEMPLATES = new Set<Template>([
  'meeting_notes',
  'sow',
  'brief',
  'job_post',
  'general',
])

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { rawText: unknown; template: unknown }
    const { rawText, template } = body

    if (!rawText || typeof rawText !== 'string') {
      return NextResponse.json({ error: 'rawText is required' }, { status: 400 })
    }
    if (rawText.length < 10) {
      return NextResponse.json(
        { error: 'rawText must be at least 10 characters' },
        { status: 400 }
      )
    }
    if (rawText.length > 8000) {
      return NextResponse.json(
        { error: 'rawText must be under 8000 characters' },
        { status: 400 }
      )
    }
    if (!template || typeof template !== 'string' || !VALID_TEMPLATES.has(template as Template)) {
      return NextResponse.json(
        { error: `template must be one of: ${[...VALID_TEMPLATES].join(', ')}` },
        { status: 400 }
      )
    }

    const result = await generateDoc(rawText, template as Template)

    await supabase.from('documents').insert({
      user_id: user.id,
      title: result.title,
      template,
      raw_input: rawText,
      structured_output: result,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
