import { router } from './trpc';
import { albumRouter } from './routers/album';

/**
 * FILE PURPOSE: The Root Router
 * 
 * This file is the "Main Menu" of your API.
 * In Express, this would be your 'app.js' where you do `app.use('/albums', albumRoutes)`.
 * 
 * Here, we merge all our sub-routers into one big 'appRouter'.
 * This 'appRouter' type is what the frontend imports to know about your API.
 */

export const appRouter = router({
  // We mount the album router under the 'album' namespace.
  // Frontend usage: trpc.album.list.useQuery()
  album: albumRouter,
  
  // You can add more routers here:
  // artist: artistRouter,
  // track: trackRouter,
});

// Export the TYPE of the router only.
// The frontend never imports the actual code, just this type definition!
export type AppRouter = typeof appRouter;
