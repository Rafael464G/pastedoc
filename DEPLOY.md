# PasteDoc Deployment Checklist

## Supabase
- [ ] Auth → URL Configuration → Site URL set to https://yourdomain.com
- [ ] Auth → Redirect URLs → Add https://yourdomain.com/**
- [ ] Database → Tables: profiles and documents exist
- [ ] Database → RLS policies enabled on documents

## Stripe
- [ ] Products → Create Pro product ($9/month, $79/year)
- [ ] Developers → Webhooks → Add endpoint: https://yourdomain.com/api/stripe/webhook
  - Events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
- [ ] Copy webhook signing secret to STRIPE_WEBHOOK_SECRET env var
- [ ] Copy price ID to STRIPE_PRO_PRICE_ID env var
- [ ] Customer portal configured (optional for MVP)

## Anthropic
- [ ] API key valid in console.anthropic.com
- [ ] Usage limits sufficient

## Vercel
- [ ] Import project from GitHub
- [ ] Add all 8 environment variables in Settings → Environment Variables
- [ ] Deploy
- [ ] Custom domain (optional)

## Post-deploy
- [ ] Test magic link login on production
- [ ] Test generate → export flow with real text
- [ ] Test Stripe checkout with test card 4242 4242 4242 4242
- [ ] Verify webhook received in Stripe Dashboard → Developers → Webhooks → Events
- [ ] Test 30-export limit gate (export 30 times as free user, confirm 403)
- [ ] Test mobile layout on a real phone
- [ ] Post to one community (X, Reddit, Hacker News, Product Hunt)
