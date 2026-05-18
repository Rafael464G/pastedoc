'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TemplateSelector from '@/components/TemplateSelector'
import PasteInput from '@/components/PasteInput'
import DocPreview from '@/components/DocPreview'
import ExportBar from '@/components/ExportBar'
import type { Template, DocResult } from '@/types'

export default function NewDocumentPage() {
  const [rawText, setRawText] = useState('')
  const [template, setTemplate] = useState<Template>('general')
  const [docResult, setDocResult] = useState<DocResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    async function fetchDocIfNeeded(userId: string) {
      const params = new URLSearchParams(window.location.search)
      const docId = params.get('docId')
      if (!docId) return

      const { data } = await supabase
        .from('documents')
        .select('raw_input, template, structured_output')
        .eq('id', docId)
        .eq('user_id', userId)
        .single()

      if (data) {
        if (data.raw_input) setRawText(data.raw_input as string)
        if (data.template) setTemplate(data.template as Template)
        if (data.structured_output) setDocResult(data.structured_output as DocResult)
      }
    }

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      await fetchDocIfNeeded(user.id)
    }

    init()
  }, [])

  async function handleGenerate() {
    if (!rawText.trim()) return
    setIsGenerating(true)
    setGenerateError('')
    setDocResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, template }),
      })

      const data = (await res.json()) as DocResult & { error?: string }

      if (!res.ok) {
        setGenerateError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setDocResult(data)
    } catch {
      setGenerateError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Document</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Paste raw text and get a clean document in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column — input */}
        <div className="flex flex-col gap-5">
          <TemplateSelector value={template} onChange={setTemplate} />
          <PasteInput
            value={rawText}
            onChange={setRawText}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            disabled={isGenerating}
          />
          {generateError && (
            <p className="text-sm text-red-600 -mt-2">{generateError}</p>
          )}
        </div>

        {/* Right column — preview + export */}
        <div className="flex flex-col gap-4">
          <DocPreview docResult={docResult} isGenerating={isGenerating} />
          {docResult && <ExportBar docResult={docResult} />}
        </div>
      </div>
    </div>
  )
}
