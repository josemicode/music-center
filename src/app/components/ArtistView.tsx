"use client";

import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";

// NOTE: Although a little inconsistent, an artist's identifier will not be a number
export type Artist = {
    id: string;
    name: string;
};

export default function ArtistView({ artistProp }: { artistProp: Artist }) {
    const utils = trpc.useUtils();

    const deleteMutation = trpc.artist.delete.useMutation({
        onMutate: async (idToDelete) => {
            // Cancel outgoing fetches
            await utils.artist.list.cancel();

            // Snapshot the previous value
            const previousArtists = utils.artist.list.getData();

            // Optimistically update list
            utils.artist.list.setData(undefined, (old: Artist[] | undefined) =>
                old ? old.filter((artist) => artist.id !== idToDelete) : [],
            );

            return { previousArtists };
        },
        onSuccess: () => {
            toast("Artist deleted!", { icon: "\u2716" });
        },
        onError: (err, idToDelete, context) => {
            utils.artist.list.setData(undefined, context?.previousArtists);
            toast.error("Failed to delete artist");
        },
        onSettled: () => {
            utils.artist.invalidate();
        },
    });

    const handleDeletion = (id: string) => {
        deleteMutation.mutate(id);
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div>
                <h4 style={{ margin: 0, fontWeight: "bold" }}>
                    {artistProp.name}
                </h4>
                <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
                    ID: {artistProp.id}
                </p>
            </div>
            <button
                onClick={() => handleDeletion(artistProp.id)}
                disabled={deleteMutation.isPending}
                style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                }}
            >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}
