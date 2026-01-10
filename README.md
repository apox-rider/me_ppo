 # Secret Diary ✨

A private, passwordless personal diary web app where you secretly write thoughts about people — and surprise them with a unique link that reveals only what you wrote about them.

Built with **React + Vite + Tailwind CSS + Supabase** (auth & database).

![Secret Diary Preview](#)*

## Features

- 🔒 **Passwordless login** using Supabase Magic Links (email only)
- ✍️ **Admin dashboard** — only you can access it via your email
  - Create new entries
  - Edit existing entries
  - Delete entries
  - Generate unique secret links

- 🎁 **Surprise page** — public link that shows the message only to the intended person
- 🌙 Beautiful dark gradient design with glassmorphism cards
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔐 Row Level Security (RLS) in Supabase — secure & private

## Tech Stack

- **Frontend**: React 18 + Vite + React Router v6
- **Styling**: Tailwind CSS + custom gradients & glass effects
- **Backend/Database**: Supabase (PostgreSQL + Authentication)
- **Auth**: Supabase Magic Links (email OTP)
- **Utilities**: nanoid (for secret tokens)

## Live Demo

(Coming soon – deploy to Vercel/Netlify)

 