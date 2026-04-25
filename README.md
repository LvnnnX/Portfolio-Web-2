# Pande Dani | Personal Portfolio 🚀

A high-fidelity personal portfolio website for a **Data Scientist & AI Specialist**. Built with React 19, Vite, and Tailwind CSS v4 — featuring a premium "Liquid Glass" aesthetic, interactive WebGL backgrounds, and physics-driven UI components.

## ✨ Features

- **Liquid Glass Design System** — High-fidelity glassmorphism using custom SVG physical distortion filters and backdrop-blur effects.
- **Dual-Mode Interactive Backgrounds**:
  - **Light Mode**: Features a custom **WebGL Shader** background with animated RGB rays and glowing lines.
  - **Dark Mode**: Features an elegant, physics-inspired **Falling Pattern** animation.
- **Interactive Lanyard Nametag** — A physics-based nametag simulation in the "About Me" section that responds to drag gestures with realistic spring physics.
- **Horizontal Scroll Sliders** — "Experience", "Projects", and "Tools" sections feature smooth, touch-optimized horizontal sliders with dynamic gradient fade masks.
- **Mobile-Optimized & Performant** — Aggressive performance optimizations including lazy-loaded heavy components (`React.lazy`), CSS-composited Framer animations, capped WebGL pixel ratios for mobile GPU relief, and zero `backdrop-filter` lag on small screens.
- **Dynamic Content Management** — Work experiences and featured projects are structured in a centralized JSON file (`experience.json`) for seamless updates.

## 🛠 Tech Stack

- **Core**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Logic**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS v4](https://tailwindcss.com/) (Class-based dark mode)
- **Animations & Physics**: [Framer Motion](https://www.framer.com/motion/)
- **3D/WebGL**: [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── AboutMe.tsx      # Nametag + Profile Section
│   │       ├── Experience.tsx   # Career Timeline + Photo Gallery
│   │       ├── Projects.tsx     # Featured Project Grid
│   │       ├── Nametag.tsx      # Lanyard Physics Simulation
│   │       ├── web-gl-shader.tsx# Light Mode Animated Background
│   │       └── falling-pattern.tsx # Dark Mode Animated Background
│   ├── App.tsx                  # Main entry point & Theme Layer
│   ├── demo.tsx                 # Section layout manager
│   └── index.css                # Global styles & Tailwind v4 config
├── public/
│   └── images/
│       ├── hero_img.jpg         # Profile photo
│       └── work/                # Experience photo assets
├── experience.json              # Career history data
└── package.json                 # Dependencies & scripts
```

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

Pande Dani is based in **Karangasem, Bali**.

---
Developed as a showcase of modern web technologies and design principles.
