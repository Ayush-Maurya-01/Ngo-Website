# PCHR&R NGO Website

A premium, bilingual (English & Hindi) web platform for the **Possible Council of Human Rights and Responsibilities (PCHR&R)**. This platform focuses on promoting human rights awareness, state-wise initiatives, and community engagement.

## 🚀 Features

- **Premium Design:** Modern, sleek UI with glassmorphism, micro-animations, and a responsive layout.
- **Bilingual Support:** Full support for English and Hindi across all core pages.
- **SEO Optimized:** Server-side metadata, dynamic sitemap generation, and JSON-LD structured data.
- **State-wise Initiatives:** Dedicated tracking and reporting for NGO activities across Indian states and UTs.
- **Events Hub:** Integrated event management with photo galleries and rich-text reports.
- **Legal & Human Rights Hub:** A repository for educational resources and articles.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Hosting:** [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Animations:** Framer Motion & CSS Animations
- **Icons:** Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- NPM or Yarn
- Supabase Account
- Firebase CLI (for deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayush-Maurya-01/Ngo-Website.git
   cd Ngo-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file with the following keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   # ... add other keys as per .env example
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚀 Deployment

The site is configured for Firebase Hosting.

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase:**
   ```bash
   npx firebase deploy
   ```

## 📄 License

This project is developed for the Possible Council of Human Rights and Responsibilities. All rights reserved.
