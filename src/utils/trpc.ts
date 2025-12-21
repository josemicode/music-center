import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server';

/**
 * FILE PURPOSE: The Client-Side Hook
 * 
 * This file creates the 'trpc' object that you will use in your components.
 * It connects the frontend type definition to the react-query logic.
 */

// 1. Create the hooks
// We pass <AppRouter> as a generic. This is how the frontend knows about 
// all the procedures you defined in 'src/server/index.ts'.
// It effectively "downloads" the types from the server file.

export const trpc = createTRPCReact<AppRouter>();

// Usage in a component:
// const { data, isLoading } = trpc.album.list.useQuery();
