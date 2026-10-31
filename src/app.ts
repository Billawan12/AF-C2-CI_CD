import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { calculate, MathOperation } from './math.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Validates that required environment variables are set before starting the application.
 * In a university DevOps setting, this demonstrates that application initialization
 * depends on external configuration injected by the runtime environment (Docker or CI runner).
 */
export function validateEnv(): void {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_secret_here_replace_me') {
    throw new Error(
      'FATAL ERROR [CONFIG]: Missing required environment variable "API_KEY".\n' +
      'The application cannot start without an authenticated API_KEY.\n' +
      'Fix: Ensure .env is populated from .env.example, or pass -e API_KEY=... in Docker, or define env.API_KEY in your CI workflow.'
    );
  }
}

export function createApp(): Express {
  // Enforce environment validation on application startup
  validateEnv();

  const app = express();
  app.use(express.json());

  // Health check endpoint (for Docker HEALTHCHECK and monitoring)
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Authentication middleware: Verifies incoming request has valid x-api-key or apiKey query
  const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
    const providedKey = req.headers['x-api-key'] || req.query.apiKey;
    const expectedKey = process.env.API_KEY;

    if (!providedKey || providedKey !== expectedKey) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing API key. Provide the x-api-key header or apiKey query parameter.',
      });
      return;
    }
    next();
  };

  /**
   * Main calculation endpoint
   * GET /calculate?a=10&b=5&op=add
   * POST /calculate body: { a: 10, b: 5, operation: "add" }
   */
  const handleCalculate = (req: Request, res: Response) => {
    try {
      const a = Number(req.body?.a ?? req.query.a);
      const b = Number(req.body?.b ?? req.query.b);
      const op = (req.body?.operation ?? req.query.op ?? 'add') as MathOperation;

      if (isNaN(a) || isNaN(b)) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Parameters "a" and "b" must be valid numeric values.',
        });
        return;
      }

      const result = calculate(a, b, op);
      res.status(200).json({
        a,
        b,
        operation: op,
        result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown calculation error';
      res.status(400).json({
        error: 'Calculation Error',
        message: errorMessage,
      });
    }
  };

  app.get('/calculate', requireApiKey, handleCalculate);
  app.post('/calculate', requireApiKey, handleCalculate);

  return app;
}

export default createApp;