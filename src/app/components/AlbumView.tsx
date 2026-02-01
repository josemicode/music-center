"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import EditAlbumModal from "./EditAlbumModal";
import toast from "react-hot-toast";
import styles from "../styles/AlbumView.module.css";

export type Album = {
    id: string;
    title: string;
    artist_id: number;
};

export default function AlbumView({ albumProp }: { albumProp: Album }) {
    const utils = trpc.useUtils();
    const [isEditing, setIsEditing] = useState(false);

    const deleteMutation = trpc.album.delete.useMutation({
        onMutate: async (idToDelete) => {
            // Cancel outgoing fetches (list and specific getById)
            await utils.album.list.cancel();
            await utils.album.getById.cancel(idToDelete);

            // Snapshot the previous values
            const previousAlbums = utils.album.list.getData();
            const previousAlbum = utils.album.getById.getData(idToDelete);

            // Optimistically update list
            utils.album.list.setData(undefined, (old: Album[] | undefined) =>
                old
                    ? old.filter((album) => parseInt(album.id) !== idToDelete)
                    : [],
            );

            // Optimistically clear the individual record
            utils.album.getById.setData(idToDelete, undefined);

            return { previousAlbums, previousAlbum };
        },
        onSuccess: () => {
            toast("Album deleted!", { icon: "🗑️" });
        },
        onError: (err, newAlbum, context) => {
            utils.album.list.setData(undefined, context?.previousAlbums);
            if (context?.previousAlbum && typeof newAlbum === "number") {
                utils.album.getById.setData(newAlbum, context.previousAlbum);
            }
            toast.error("Failed to delete album");
        },
        onSettled: () => {
            utils.album.invalidate();
        },
    });

    const handleDeletion = (id: number) => {
        deleteMutation.mutate(id);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div className={styles.albumCard}>
                <h3>{albumProp.title}</h3>
                <p>ID: {albumProp.id}</p>
            </div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => handleDeletion(parseInt(albumProp.id))}>
                Delete
            </button>

            {isEditing && (
                <EditAlbumModal
                    albumProp={albumProp}
                    setIsEditing={setIsEditing}
                />
            )}
        </>
    );
}
