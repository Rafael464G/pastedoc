import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildPdf } from '@/lib/pdf'
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from 'docx'
import type { DocResult } from '@/types'

export const runtime = 'nodejs'

async function buildDocx(docResult: DocResult): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: docResult.title,
      heading: HeadingLevel.HEADING_1,
    }),
    ...docResult.sections.flatMap((section) => [
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [new TextRun({ text: section.content, size: 24 })],
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
      }),
    ]),
  ]

  const doc = new Document({
    sections: [{ children }],
  })

  return Buffer.from(await Packer.toBuffer(doc))
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch profile for analytics counter only — no quota enforcement
    const { data: profile } = await supabase
      .from('profiles')
      .select('exports_used')
      .eq('id', user.id)
      .single()

    const body = (await request.json()) as {
      docResult: DocResult
      format: 'pdf' | 'docx'
    }
    const { docResult, format } = body

    if (!docResult || !docResult.title || !Array.isArray(docResult.sections)) {
      return NextResponse.json({ error: 'Invalid docResult' }, { status: 400 })
    }
    if (format !== 'pdf' && format !== 'docx') {
      return NextResponse.json({ error: 'format must be pdf or docx' }, { status: 400 })
    }

    const buffer = format === 'pdf' ? await buildPdf(docResult) : await buildDocx(docResult)

    // Increment exports_used for analytics
    if (profile) {
      await supabase
        .from('profiles')
        .update({ exports_used: (profile.exports_used ?? 0) + 1 })
        .eq('id', user.id)
    }

    const contentType =
      format === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    const filename = `${encodeURIComponent(docResult.title)}.${format}`

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
