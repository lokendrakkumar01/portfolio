import fs from 'fs';
import path from 'path';

const files = {
  "package.json": `{
  "name": "portfolio-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@tanstack/react-query": "^5.51.21",
    "@tanstack/react-query-devtools": "^5.51.21",
    "axios": "^1.7.2",
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.8",
    "lucide-react": "^0.414.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.52.1",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.25.1",
    "tailwind-merge": "^2.5.2",
    "zod": "^3.23.8",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}`,
  "tsconfig.json": `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}`,
  "tsconfig.app.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,
  "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
  "tailwind.config.ts": `import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 60px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;`,
  "postcss.config.js": `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <title>Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  "public/robots.txt": `User-agent: *
Allow: /
Disallow: /admin/`,
  "public/favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#2563eb"/></svg>`,
  ".env.example": `VITE_API_BASE_URL=http://localhost:5000/api/v1`,
  "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: 248 250 252;
    --color-surface: 255 255 255;
    --color-card: 255 255 255;
    --color-primary: 37 99 235;
    --color-primary-hover: 29 78 216;
    --color-text: 15 23 42;
    --color-text-muted: 100 116 139;
    --color-border: 226 232 240;
    --color-success: 34 197 94;
    --color-warning: 245 158 11;
    --color-error: 239 68 68;
    --color-accent: 139 92 246;
  }

  [data-theme="dark"] {
    --color-bg: 10 10 15;
    --color-surface: 17 24 39;
    --color-card: 31 41 55;
    --color-primary: 96 165 250;
    --color-primary-hover: 147 197 253;
    --color-text: 248 250 252;
    --color-text-muted: 148 163 184;
    --color-border: 55 65 81;
    --color-success: 74 222 128;
    --color-warning: 251 191 36;
    --color-error: 248 113 113;
    --color-accent: 167 139 250;
  }

  * {
    @apply border-border;
    transition: background-color 0.3s ease, color 0.2s ease, border-color 0.3s ease;
  }

  body {
    @apply bg-bg text-text font-sans antialiased;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .bg-bg { background-color: rgb(var(--color-bg)); }
  .bg-surface { background-color: rgb(var(--color-surface)); }
  .bg-card { background-color: rgb(var(--color-card)); }
  .bg-primary { background-color: rgb(var(--color-primary)); }
  .text-text { color: rgb(var(--color-text)); }
  .text-muted { color: rgb(var(--color-text-muted)); }
  .text-primary { color: rgb(var(--color-primary)); }
  .border-border { border-color: rgb(var(--color-border)); }
  .bg-error { background-color: rgb(var(--color-error)); }
  .bg-success { background-color: rgb(var(--color-success)); }
  .bg-warning { background-color: rgb(var(--color-warning)); }
}`,
  "src/vite-env.d.ts": `/// <reference types="vite/client" />`,
  "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  "src/App.tsx": `export default function App() { return <div>Works!</div>; }`,
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join('e:/portfolio/frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log("Done");
