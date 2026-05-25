# PasteDoc

Turn messy text into clean, professional documents in seconds — powered by Claude AI.

**[Live demo →](https://pastedoc.vercel.app)**

## What it does

Paste any unstructured text (meeting notes, contracts, job listings, emails) and PasteDoc formats it into a downloadable PDF or DOCX using Claude AI. Authentication and document history are handled through Supabase; payments via Stripe and MercadoPago.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** — auth and database
- **Anthropic Claude** — AI formatting engine
- **Stripe / MercadoPago** — payments
- **@react-pdf/renderer, docx, jspdf** — document generation

## Getting Started

```bash
git clone https://github.com/Rafael464G/pastedoc.git
cd pastedoc
npm install
```

Copy `.env.example` to `.env.local` and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Author

**Rafael González** — [GitHub](https://github.com/Rafael464G) · [LinkedIn](https://www.linkedin.com/in/rafael-gonzalez-86a037370/) · [Workana](https://www.workana.com/freelancer/1de0dbb7abee74488ea4a8210811c022)

## License

MIT
