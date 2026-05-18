import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import DocumentRowActions from '@/components/DocumentRowActions'
import type { DocResult, Template } from '@/types'

const TEMPLATE_LABELS: Record<Template, string> = {
  meeting_notes: 'Meeting Notes',
  sow: 'SOW',
  brief: 'Brief',
  job_post: 'Job Post',
  general: 'General',
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

interface DocumentRow {
  id: string
  title: string | null
  template: string | null
  structured_output: DocResult | null
  created_at: string
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: documents } = await supabase
    .from('documents')
    .select('id, title, template, structured_output, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const docs = (documents ?? []) as DocumentRow[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Your generated documents</p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + New document
        </Link>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-lg text-gray-500 font-medium">No documents yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Generate your first document to see it here.
          </p>
          <Link
            href="/dashboard/new"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Create your first document
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Desktop table */}
          <table className="hidden sm:table w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500 w-1/2">Title</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Template</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Created</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900 truncate max-w-xs">
                    {doc.title ?? 'Untitled'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {doc.template ? (TEMPLATE_LABELS[doc.template as Template] ?? doc.template) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {formatDate(doc.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/new?docId=${doc.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                      >
                        Open
                      </Link>
                      {doc.structured_output && (
                        <DocumentRowActions
                          docId={doc.id}
                          docResult={doc.structured_output}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile card list */}
          <ul className="sm:hidden divide-y divide-gray-100">
            {docs.map((doc) => (
              <li key={doc.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.title ?? 'Untitled'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.template ? (TEMPLATE_LABELS[doc.template as Template] ?? doc.template) : '—'}
                      {' · '}
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/dashboard/new?docId=${doc.id}`}
                      className="text-indigo-600 text-sm font-medium"
                    >
                      Open
                    </Link>
                    {doc.structured_output && (
                      <DocumentRowActions docId={doc.id} docResult={doc.structured_output} />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
