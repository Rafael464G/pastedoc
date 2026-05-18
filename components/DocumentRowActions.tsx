'use client'

import { useState } from 'react'
import { FileText, FileDown } from 'lucide-react'
import type { DocResult } from '@/types'

type Format = 'pdf' | 'docx'

interface Props {
  docId: string
  docResult: DocResult
}

export default function DocumentRowActions({ docResult }: Props) {
  const [loadingFormat, setLoadingFormat] = useState<Format | null>(null)
  const [error, setError] = useState('')

  async function handleDownload(format: Format) {
    if (loadingFormat) return
    setLoadingFormat(format)
    setError('')

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docResult, format }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? 'Export failed')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${docResult.title}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Export failed')
    } finally {
      setLoadingFormat(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDownload('pdf')}
        disabled={!!loadingFormat}
        title="Download PDF"
        className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all"
      >
        {loadingFormat === 'pdf' ? (
          <Spinner />
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => handleDownload('docx')}
        disabled={!!loadingFormat}
        title="Download DOCX"
        className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all"
      >
        {loadingFormat === 'docx' ? (
          <Spinner />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
