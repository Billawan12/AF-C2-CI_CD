import dotenv from 'dotenv';
import { createApp } from './app.js';

// Ensure environment variables are loaded
dotenv.config();

const port = process.env.PORT || 3000;

try {
  const app = createApp();
  app.listen(port, () => {
    console.log(`[INFO] DevOps Course Service listening on port ${port}`);
    console.log(`[INFO] Health check available at http://localhost:${port}/health`);
    console.log(`[INFO] Calculation endpoint at http://localhost:${port}/calculate`);
  });
} catch (error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[FATAL] Server initialization failed:`);
  console.error(msg);
  process.exit(1);
}