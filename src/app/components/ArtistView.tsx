"use client";

import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import styles from "../styles/ArtistView.module.css";

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
        <div className={styles.mainDiv}>
            <div>
                <h4 className={styles.artistName}>{artistProp.name}</h4>
                <p className={styles.artistId}>ID: {artistProp.id}</p>
            </div>
            <button
                onClick={() => handleDeletion(artistProp.id)}
                disabled={deleteMutation.isPending}
                className={styles.deleteButton}
            >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}
