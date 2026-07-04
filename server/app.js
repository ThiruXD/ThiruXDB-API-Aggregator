import express from 'express';
import cors from 'cors';
import endpointsRouter from './routes/endpoints.js';
import recordsRouter from './routes/records.js';
import logsRouter from './routes/logs.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount routes
// Note: We use /api prefix because Netlify redirects /api/* to the serverless function
// but the function receives the path with /api intact.
app.use('/api/endpoints', endpointsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
