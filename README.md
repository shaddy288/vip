# Vision in Pixels: website

React + Vite + Tailwind + GSAP (ScrollTrigger, Flip).

## Run locally
1. Install Node.js LTS (https://nodejs.org), then check with `node -v`.
2. Unzip this folder, open a terminal inside it.
3. `npm install`
4. `npm run dev`  -> opens http://localhost:5173
5. Edit `src/site.ts` (phone, WhatsApp, email, address, Instagram). The page updates instantly.

## Build for hosting
`npm run build` creates a `dist/` folder. Upload it to Netlify, Vercel or Cloudflare Pages,
then point visioninpixels.com to it in Namecheap (Advanced DNS).

## Where things are
- `src/site.ts`   business details + switches
- `src/App.tsx`   page content and sections
- `src/motion.ts` all GSAP animation
- `src/index.css` colors, fonts, layout (colors are the variables at the top)
- `public/`       favicon and robots.txt (replace favicon.svg with your logo)
