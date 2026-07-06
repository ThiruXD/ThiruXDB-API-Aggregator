/**
 * Project: ThiruXDB
 * Author: ThiruXD
 * Description: A self-hosted API data aggregation dashboard — configure external REST endpoints, fetch & store their data into MongoDB, browse and search records, all from a clean web UI.
 */
import jwt from 'jsonwebtoken';

import { getDb } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'thiruxdb_super_secret_key_change_me';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    
    const envAdminUsername = process.env.VITE_ADMIN_USERNAME;
    if (decodedUser.username === envAdminUsername) {
      req.user = decodedUser;
      return next();
    }

    try {
      const db = getDb();
      const userDoc = await db.collection('thiruxdb_users').findOne({ username: decodedUser.username });
      
      if (!userDoc) {
        return res.status(401).json({ error: 'User no longer exists.' });
      }
      
      if (!userDoc.is_active) {
        return res.status(403).json({ error: 'User account is disabled.' });
      }

      req.user = {
        id: userDoc._id.toString(),
        username: userDoc.username,
        role: userDoc.role,
        is_active: userDoc.is_active,
        restricted_pages: userDoc.restricted_pages || []
      };
      next();
    } catch (dbErr) {
      console.error('Auth DB Error:', dbErr);
      return res.status(500).json({ error: 'Database error during authentication.' });
    }
  });
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Requires one of: ${roles.join(', ')}` });
    }
    next();
  };
}
