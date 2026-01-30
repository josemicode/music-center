"use client";

import { trpc } from "@/utils/trpc";

export type Album = {
    id: string;
    title: string;
    artist_id: number;
};

export default function AlbumView({ albumProp }: { albumProp: Album }) {
    const utils = trpc.useUtils();

    const deleteMutation = trpc.album.delete.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
        },
    });

    const handleDeletion = (id: number) => {
        deleteMutation.mutate(id);
    };

    return (
        <>
            <div style={{ border: "1px solid #333", padding: "1rem" }}>
                <h3>{albumProp.title}</h3>
                <p>ID: {albumProp.id}</p>
            </div>
            <button onClick={() => handleDeletion(parseInt(albumProp.id))}>
                Delete
            </button>
        </>
    );
}
