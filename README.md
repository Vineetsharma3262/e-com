# Your Brand

A Next.js storefront cloned from the Your Brand fashion shop: men's and women's clothing, footwear, and bags, with WhatsApp checkout.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Accounts, addresses, and orders are stored in PostgreSQL. With no `DATABASE_URL`, the app uses a local Postgres database in `.data/pg`. To use your own server, copy `.env.example` to `.env.local` and set `DATABASE_URL`.

Registration emails a 6-digit code through [Resend](https://resend.com). Add `RESEND_API_KEY` in `.env.local`. Until that key is set, development shows the code on the verify screen. The free `onboarding@resend.dev` sender only delivers to the email on your Resend account until you verify a domain.

## Libraries

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- lucide-react
- DM Sans and Fraunces via `next/font`

Orders are confirmed on WhatsApp. There is no card gateway in this demo, matching the original shop.
