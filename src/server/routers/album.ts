import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

/**
 * FILE PURPOSE: Album Router (The "Controller")
 * 
 * This file replaces 'controllers/albumController.js' AND 'routes/albumRoutes.js'.
 * Here we define functions (procedures) that the frontend can call directly.
 */

// Mock Database Helper (See src/utils/db.ts for the real deal implementation guide)
// import { db } from '../../utils/db'; 

export const albumRouter = router({
  
  /**
   * 1. A READ Operation (Query)
   * Equivalent to: GET /api/albums
   */
  list: publicProcedure
    .query(async () => {
      // LOGIC: detailed explanation
      // In a manual implementation (No ORM), you would do:
      // const result = await db.query('SELECT * FROM albums');
      // return result.rows; 
      
      // For now, we return mock data to show type safety:
      return [
        { id: 1, title: 'Mock Album', artist_id: 101 },
        { id: 2, title: 'Another Album', artist_id: 102 }
      ];
    }),

  /**
   * 2. A WRITE Operation (Mutation)
   * Equivalent to: POST /api/albums
   */
  create: publicProcedure
    // INPUT VALIDATION: Zod checks the input *before* your function runs.
    .input(z.object({
      title: z.string().min(1),
      artist_id: z.number(),
      year: z.number().optional(),
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      
      // LOGIC:
      // const sql = 'INSERT INTO albums (title, artist_id) VALUES ($1, $2) RETURNING *';
      // const values = [input.title, input.artist_id];
      // const result = await db.query(sql, values);
      // return result.rows[0];
      
      return { success: true, createdAlbum: input };
    }),

    /**
     * 3. A GET BY ID Operation
     * Equivalent to: GET /api/albums/:id
     */
    getById: publicProcedure
      .input(z.number()) // The input is just a number
      .query(async (opts) => {
        const { input } = opts; // input is the ID
        
        // LOGIC:
        // const result = await db.query('SELECT * FROM albums WHERE id = $1', [input]);
        // return result.rows[0];

        return { id: input, title: `Album ${input}` };
      }),
});
