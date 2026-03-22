import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// Mock Database Helper (See src/utils/db.ts for the real deal implementation guide)
// import { db } from '../../utils/db';

// Url for endpoint:
const url = "http://localhost:3000/albums";

export const albumRouter = router({
    /**
     * 1. A READ Operation (Query)
     * Equivalent to: GET /api/albums
     */
    list: publicProcedure.query(async () => {
        // LOGIC: detailed explanation
        // In a manual implementation (No ORM), you would do:
        // const result = await db.query('SELECT * FROM albums');
        // return result.rows;

        // Testing with fake json server
        const [albums, artists] = await Promise.all([
            fetch(url).then((r) => r.json()),
            fetch("http://localhost:3000/artists").then((r) => r.json()),
        ]);

        // Join albums with artists
        const albumsWithArtists = albums.map((album: any) => {
            const artist = artists.find((a: any) => a.id === album.artist_id);
            return {
                ...album,
                artist: artist || null,
            };
        });

        return albumsWithArtists;
    }),

    /**
     * 2. A WRITE Operation (Mutation)
     * Equivalent to: POST /api/albums
     */
    create: publicProcedure
        // NOTE: The id shouldn't be inputted but generated within the procedure (or with a helper). I doubt json-server provides auto-gen...
        .input(
            z.object({
                id: z.string().min(1),
                title: z.string().min(1),
                artist_id: z.string().min(1),
            }),
        )
        .mutation(async (opts) => {
            const { input } = opts;

            // LOGIC:
            // const sql = 'INSERT INTO albums (title, artist_id) VALUES ($1, $2) RETURNING *';
            // const values = [input.title, input.artist_id];
            // const result = await db.query(sql, values);
            // return result.rows[0];

            const result = await fetch(url, {
                method: "POST",
                body: JSON.stringify(input),
            });
            return result;
        }),

    /**
     * 3. A GET BY ID Operation
     * Equivalent to: GET /api/albums/:id
     */
    getById: publicProcedure
        .input(z.string()) // The input is just a string
        .query(async (opts) => {
            const { input } = opts;

            const response = await fetch(`${url}/${input}`);
            if (!response.ok) {
                return null;
            }
            const album = await response.json();
            
            // Fetch artist for this album
            const artistResponse = await fetch(`http://localhost:3000/artists/${album.artist_id}`);
            if (artistResponse.ok) {
                const artist = await artistResponse.json();
                return {
                    ...album,
                    artist,
                };
            }
            
            return {
                ...album,
                artist: null,
            };
        }),

    /**
     * 4. AN UPDATE BY ID Operation
     * Equivalent to: PATCH /api/albums/:id
     */
    updateById: publicProcedure
        // NOTE: the reason I'm not going to abstract the album schema is because it will contain optionals here; I expect the client to only change the title
        .input(
            z.object({
                id: z.string().min(1),
                title: z.string().min(1),
                artist_id: z.string().min(1).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const { id, ...data } = input;

            // We could use the put method and merge the old and new data; granted, this means firing a GET request for the existing
            // const updated = { ...existing, ...patch };

            const result = await fetch(url + "/" + id, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            return result;
        }),

    /**
     * 5. A DELETE Operation
     * Equivalent to: DELETE /api/albums/:id
     */
    delete: publicProcedure.input(z.string()).mutation(async (opts) => {
        const { input } = opts;

        const result = await fetch(url + "/" + input, {
            method: "DELETE",
        });
        return result;
    }),
});
