/**
 * FILE PURPOSE: Database Connection (Manual / No ORM)
 *
 * Since you requested to learn the "manual connection" flow before using Drizzle/Prisma,
 * this file represents where you would set up your connection pool purely with 'pg' (node-postgres).
 */

/*
// 1. Install dependencies
// npm install pg
// npm install -D @types/pg

// 2. Implementation
import { Pool } from 'pg';

// Create a connection pool.
// This manages multiple connections so you don't open/close one for every request.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'music_center',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Helper function to query
// We export this 'db' object to be used in your routers.
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
*/

// Usage in src/server/routers/album.ts:
// import { db } from '../../utils/db';
// const res = await db.query('SELECT * FROM albums WHERE id = $1', [id]);
