import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// Url for endpoint:
const url = "http://localhost:3000/artists";

export const artistRouter = router({
    list: publicProcedure.query(async () => {
        const result = await fetch(url).then((r) => r.json());
        return result;
    }),

    create: publicProcedure
        .input(
            z.object({
                id: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .mutation(async (opts) => {
            const { input } = opts;

            const result = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });
            return result.json();
        }),
});
