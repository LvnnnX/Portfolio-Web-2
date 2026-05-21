# Pande Dani | Personal Portfolio 🚀

A high-fidelity personal portfolio website for a **Data Scientist & AI Specialist**. Built with React 19, Vite, and Tailwind CSS v4 — featuring a premium "Liquid Glass" aesthetic, interactive WebGL backgrounds, physics-driven UI components, and a personal blog.

**Live**: [daniwismagatha.my.id](https://daniwismagatha.my.id)

## ✨ Features

- **Liquid Glass Design System** — High-fidelity glassmorphism using custom SVG physical distortion filters and backdrop-blur effects.
- **Dual-Mode Interactive Backgrounds**:
  - **Light Mode**: Custom **WebGL Shader** background with animated RGB rays and glowing lines.
  - **Dark Mode**: Elegant, physics-inspired **Falling Pattern** animation.
- **Interactive Lanyard Nametag** — A physics-based nametag simulation in the "About Me" section that responds to drag gestures with realistic spring physics.
- **Horizontal Scroll Sliders** — "Experience", "Projects", and "Tools" sections feature smooth, touch-optimized horizontal sliders with dynamic gradient fade masks.
- **Blog / Writing** — Personal essays on economics, politics, and data science reflections. MDX-powered with editorial voice.
- **Case Studies** — In-depth project breakdowns (MEWS BBMKG, Smandapura Exam App, Fruit Ninja YOLOv8).
- **Mobile-Optimized & Performant** — Lazy-loaded heavy components, CSS-composited Framer animations, capped WebGL pixel ratios for mobile GPU relief.

## 🛠 Tech Stack

- **Core**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Logic**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS v4](https://tailwindcss.com/) (Class-based dark mode)
- **Content**: MDX for blog posts and case studies
- **Animations & Physics**: [Framer Motion](https://www.framer.com/motion/)
- **3D/WebGL**: [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: React Router (SPA with dedicated pages)

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── ui/           # Core UI components (Hero, Skills, Contact, etc.)
│   │   ├── layout/       # Navigation, Footer, CaseStudyLayout
│   │   ├── sections/     # OpenSource section
│   │   └── seo/          # SEO component
│   ├── content/
│   │   ├── posts/        # Blog articles (MDX)
│   │   └── case-studies/ # Project case studies (MDX)
│   ├── pages/            # Route pages (Home, Writing, CaseStudy, Services)
│   ├── lib/              # Utilities
│   ├── App.tsx           # Main entry point & Theme Layer
│   ├── routes.tsx        # Route definitions
│   └── main.tsx          # React DOM entry
├── public/
│   └── images/           # Static assets (profile, work photos)
├── experience.json       # Career history data
└── package.json          # Dependencies & scripts
```

## ✍️ Blog Posts

| # | Title | Date |
|---|-------|------|
| 01 | Rupiah Menuju Merdeka 17.845 | 2026-05-20 |
| 02 | Kasus Nadiem dan Dua Cermin | 2026-05-20 |
| 03 | Pesta Babi, Salib Merah, dan Cara Kita Mengukur Pembangunan | 2026-05-21 |
| 04 | Yang Tidak Dijawab di Senayan | 2026-05-21 |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/LvnnnX/Portfolio-Web-2.git

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the site.

## 📍 Location

Pande Dani is based in **Karangasem, Bali, Indonesia**.

## 📬 Contact

- Email: pandedani5@gmail.com
- LinkedIn: [kokopandan](https://linkedin.com/in/kokopandan)
- GitHub: [LvnnnX](https://github.com/LvnnnX)
- Web: [daniwismagatha.my.id](https://daniwismagatha.my.id)

---
Built with modern web technologies. Designed to reflect craft, not just code.
