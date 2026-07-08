import app from '../server/app.js';
import { connectDb } from '../server/db.js';

// Connect to MongoDB before handling the request
let dbPromise = null;

export default async function handler(req, res) {
  try {
    // Ensure DB connection is established before processing the route
    if (!dbPromise) {
      dbPromise = connectDb().catch(err => {
        dbPromise = null; // Reset so next invocation can try again
        throw err;
      });
    }
    await dbPromise;
    
    // Vercel's Node runtime natively provides req/res objects compatible with Express.
    return app(req, res);
  } catch (err) {
    console.error('Fatal Initialization Error:', err);
    res.status(500).json({ error: `Database Connection Failed: ${err.message}` });
  }
}
