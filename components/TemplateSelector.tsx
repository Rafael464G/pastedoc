'use client'

import type { Template } from '@/types'

const TEMPLATES: { value: Template; label: string }[] = [
  { value: 'meeting_notes', label: 'Meeting Notes' },
  { value: 'sow', label: 'SOW' },
  { value: 'brief', label: 'Brief' },
  { value: 'job_post', label: 'Job Post' },
  { value: 'general', label: 'General' },
]

interface Props {
  value: Template
  onChange: (template: Template) => void
}

export default function TemplateSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Document type</p>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={
              t.value === value
                ? 'px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all bg-indigo-600 text-white shadow-sm'
                : 'px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
