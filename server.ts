/**
 * Local development server only.
 *
 * Vercel deploys this project as a static Vite build (`dist/`); this file is not deployed and the
 * site has no server-side API. It serves the Vite dev middleware locally and `dist/` when
 * NODE_ENV=production. The educational guide answers in the browser from pre-written rules
 * (src/utils/clinicalGuidance.ts), so no chat endpoint or language-model client exists here.
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

export { app };

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import vite for development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Meridian Vascular app listening on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
