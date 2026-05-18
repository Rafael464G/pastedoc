'use client'

import { useState } from 'react'
import { FileText, FileDown } from 'lucide-react'
import type { DocResult } from '@/types'

interface Props {
  docResult: DocResult | null
}

type Format = 'pdf' | 'docx'
type ExportState = 'idle' | 'loading'

export default function ExportBar({ docResult }: Props) {
  const [pdfState, setPdfState] = useState<ExportState>('idle')
  const [docxState, setDocxState] = useState<ExportState>('idle')
  const [exportError, setExportError] = useState('')

  const isAnyLoading = pdfState === 'loading' || docxState === 'loading'

  async function handleExport(format: Format) {
    if (!docResult || isAnyLoading) return

    setExportError('')

    const setState = format === 'pdf' ? setPdfState : setDocxState
    setState('loading')

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docResult, format }),
      })

      if (!res.ok) {
        setExportError('Export failed. Please try again.')
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
      setExportError('Export failed. Please try again.')
    } finally {
      setState('idle')
    }
  }

  const disabled = !docResult || isAnyLoading

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <ExportButton
          label="Export PDF"
          icon={<FileText className="h-4 w-4" />}
          loading={pdfState === 'loading'}
          disabled={disabled}
          onClick={() => handleExport('pdf')}
        />
        <ExportButton
          label="Export .docx"
          icon={<FileDown className="h-4 w-4" />}
          loading={docxState === 'loading'}
          disabled={disabled}
          onClick={() => handleExport('docx')}
        />
      </div>

      {exportError && (
        <p className="text-sm text-red-600">{exportError}</p>
      )}
    </div>
  )
}

function ExportButton({
  label,
  icon,
  loading,
  disabled,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all w-full sm:w-auto ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-200 bg-white text-gray-500'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
      }`}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
      {label}
    </button>
  )
}
