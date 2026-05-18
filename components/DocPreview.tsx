'use client'

import { FileText } from 'lucide-react'
import type { DocResult } from '@/types'

interface Props {
  docResult: DocResult | null
  isGenerating?: boolean
}

export default function DocPreview({ docResult, isGenerating = false }: Props) {
  if (isGenerating) {
    return (
      <div className="h-full min-h-[320px] rounded-xl border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-px bg-gray-100 w-full" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/6" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!docResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
        <FileText className="h-10 w-10 text-gray-300 mb-3" strokeWidth={1.5} />
        <p className="text-gray-400 font-medium text-sm">
          Your formatted document will appear here
        </p>
        <p className="text-gray-300 text-sm mt-1">Paste text and click Generate</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in rounded-xl border border-gray-200 bg-white max-h-[640px] overflow-y-auto p-6 scrollbar-thin">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{docResult.title}</h1>
      {docResult.sections.map((section, i) => (
        <div key={i} className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{section.heading}</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  )
}
