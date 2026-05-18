import type { Template, DocResult } from '@/types'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Uses OpenRouter's auto-router to distribute across all free models
const MODEL = 'openrouter/free'

const SYSTEM_PROMPT =
  'You are a professional document formatter. Convert raw input text into a clean, structured document. ' +
  'Return ONLY valid JSON matching this shape: { title: string, sections: [{ heading: string, content: string }] }. ' +
  'Do not add markdown fences. Infer a short document title from the content.'

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string | null
    }
  }>
  error?: { message: string }
}

function parseDocResult(raw: string): DocResult {
  try {
    return JSON.parse(raw) as DocResult
  } catch {
    const stripped = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()
    try {
      return JSON.parse(stripped) as DocResult
    } catch {
      throw new Error('Failed to parse Claude response as JSON')
    }
  }
}

export async function generateDoc(rawText: string, template: Template): Promise<DocResult> {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Template type: ${template}\n\nRaw input:\n${rawText}` },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenRouter request failed (${res.status}): ${text}`)
  }

  const data = (await res.json()) as OpenRouterResponse

  if (data.error) {
    throw new Error(`OpenRouter error: ${data.error.message}`)
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from OpenRouter')
  }

  return parseDocResult(content)
}
