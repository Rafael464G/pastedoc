export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          Early Access
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PasteDoc is free during early access
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          Unlimited exports, all five templates, PDF and DOCX — no credit card,
          no limits, no catch.
        </p>
        <a
          href="/signup"
          className="inline-block mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all text-sm"
        >
          Get started free →
        </a>
        <p className="mt-4 text-xs text-gray-400">
          No account yet?{' '}
          <a href="/signup" className="underline hover:text-gray-600">
            Sign up with your email
          </a>
          {' '}— just a magic link, no password.
        </p>
      </div>
    </div>
  )
}
