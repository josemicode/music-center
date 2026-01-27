import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";

/**
 * FILE PURPOSE: The API Gateway
 *
 * This file is magical. In Next.js App Router, a file named 'route.ts' inside 'api/...'
 * acts as an API endpoint.
 *
 * The path 'api/trpc/[trpc]' is a "dynamic route".
 * It captures ALL requests starting with '/api/trpc/'.
 * Examples:
 * - /api/trpc/album.list
 * - /api/trpc/album.create
 *
 * This single file handles EVERY request for your entire API.
 */

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => ({}), // You can pass auth headers here later
    });

export { handler as GET, handler as POST };

//TODO: Find out more about this...
