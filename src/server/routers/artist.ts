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
                name: z.string().min(1),
            }),
        )
        .mutation(async (opts) => {
            const { input } = opts;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to create artist: ${response.statusText}`,
                );
            }
            return response.json();
        }),

    delete: publicProcedure.input(z.string()).mutation(async (opts) => {
        const { input } = opts;

        const response = await fetch(`${url}/${input}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete artist: ${response.statusText}`);
        }
        return response.json();
    }),
});
