'use client'

const MAX_CHARS = 8000
const WARN_AT = 7800

interface Props {
  value: string
  onChange: (text: string) => void
  onGenerate: () => void
  isGenerating: boolean
  disabled: boolean
}

export default function PasteInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
  disabled,
}: Props) {
  const isOverLimit = value.length > MAX_CHARS
  const isNearLimit = value.length > WARN_AT
  const canGenerate = value.trim().length > 0 && !disabled && !isGenerating && !isOverLimit

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length > MAX_CHARS) return
    onChange(e.target.value)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste your raw text here — meeting notes, contracts, job listings, anything..."
          className="w-full min-h-[240px] max-h-[400px] resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all leading-relaxed"
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
        <span
          className={`absolute bottom-3 right-3 text-xs pointer-events-none select-none ${
            isNearLimit ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {value.length} / {MAX_CHARS}
        </span>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all w-full sm:w-auto ${
          canGenerate
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isGenerating ? (
          <>
            <Spinner />
            Generating...
          </>
        ) : (
          'Generate document →'
        )}
      </button>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
