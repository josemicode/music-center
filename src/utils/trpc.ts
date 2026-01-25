import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server";

/**
 * FILE PURPOSE: The Client-Side Hook
 *
 * This file creates the 'trpc' object that you will use in your components.
 * It connects the frontend type definition to the react-query logic.
 */

export const trpc = createTRPCReact<AppRouter>();

// Usage in a component:
// const { data, isLoading } = trpc.album.list.useQuery();
