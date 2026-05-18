import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">PasteDoc</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          Powered by Claude AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight max-w-3xl mx-auto">
          Turn messy text into clean documents in seconds
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Paste meeting notes, contracts, or job listings. Get a professionally
          formatted PDF or DOCX instantly.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all text-sm"
          >
            Start free →
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
          >
            See how it works ↓
          </a>
        </div>
      </section>

      {/* Demo mockup */}
      <section id="demo" className="bg-gray-50 py-20 px-4 scroll-mt-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            See it in action
          </h2>
          <p className="text-gray-500 text-center mb-12 text-sm">
            Raw text in. Clean document out.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Fake input */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Raw input
              </p>
              <div className="text-sm text-gray-500 leading-relaxed font-mono bg-gray-50 rounded-lg p-4 min-h-[180px]">
                <span className="text-gray-700">Team meeting — discussed Q3 roadmap.</span>
                <br /><br />
                action items: finish auth by friday, deploy staging next week, john to review
                designs. Budget approved for cloud infra. Next meeting tuesday 2pm.
                <br /><br />
                also: need to fix the login bug asap
              </div>
              <div className="mt-3 flex justify-end">
                <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">
                  Meeting Notes
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-sm pointer-events-none">
              <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* Fake output */}
            <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Formatted document
              </p>
              <div className="min-h-[180px]">
                <h3 className="text-base font-bold text-gray-900 mb-3">Q3 Roadmap Team Meeting</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Action Items</p>
                    <p className="text-gray-500 leading-relaxed">
                      Complete authentication feature by Friday. Deploy to staging environment next
                      week. John to review designs. Login bug to be fixed immediately.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Budget & Resources</p>
                    <p className="text-gray-500">Cloud infrastructure budget approved.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Next Steps</p>
                    <p className="text-gray-500">Next meeting scheduled for Tuesday at 2:00 PM.</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                  PDF
                </span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                  DOCX
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-10">No surprises. Cancel any time.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-semibold text-gray-900 mb-1">Free</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">$0</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ 30 exports per month</li>
                <li>✓ PDF export</li>
                <li>✓ 5 templates</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-md">
              <p className="font-semibold text-indigo-600 mb-1">Pro</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                $9<span className="text-base font-normal text-gray-400">/mo</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>✓ Unlimited exports</li>
                <li>✓ PDF + DOCX export</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>

          <Link
            href="/pricing"
            className="inline-block mt-6 text-sm text-indigo-600 hover:underline font-medium"
          >
            View full pricing →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 text-center">
        <p className="text-sm text-gray-400">
          PasteDoc © 2026 &nbsp;·&nbsp;{' '}
          <span className="text-gray-300">Built with Claude</span>
        </p>
      </footer>
    </div>
  )
}
