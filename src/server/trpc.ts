import { initTRPC } from "@trpc/server";

/**
 * FILE PURPOSE: tRPC Initialization
 *
 * This file is the "engine room" of your backend. It's where you initialize tRPC
 * and define reusable pieces like 'publicProcedure' and 'router'.
 *
 * You only need to set this up once per project.
 */

// 1. Initialize tRPC
// We create the tRPC instance. You can add context types here later (for things like session auth).
const t = initTRPC.context().create({
    errorFormatter({ shape, error }) {
        console.error("tRPC error: ", error);
        return shape;
    },
});

/**
 * 2. Export Reusable Helpers
 *
 * Instead of importing 't' everywhere, we export specific builders.
 * This keeps your code clean and allows you to add middleware to these builders later.
 */

// 'router': Use this to create a collection of procedures (like a controller in Express).
// Think of this as: const app = express.router();
export const router = t.router;

// 'publicProcedure': This is the base builder for any API endpoint that is open to the public.
// If you needed authentication, you would create a 'protectedProcedure' here that checks for a session.
export const publicProcedure = t.procedure;
