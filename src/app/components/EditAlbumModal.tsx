"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Album } from "./AlbumView";
import { Artist } from "./ArtistView";
import toast from "react-hot-toast";
import styles from "../styles/EditAlbumModal.module.css";

/**
 * NOTE:
 * When declaring the type of an argument as a function, you must use the typical function notation and not the { foo: (status: boolean) => bar }
 * The following link leads to a pattern that solves this https://github.com/vercel/next.js/issues/74343#issuecomment-2870184138
 */

export default function EditAlbumModal({
    albumProp,
    setIsEditing,
}: {
    albumProp: Album;
    setIsEditing(status: boolean): void;
}) {
    const utils = trpc.useUtils();

    const [title, setTitle] = useState(albumProp.title);
    const [selectedArtistId, setSelectedArtistId] = useState(albumProp.artist_id);

    const { data: artists, isLoading: artistsLoading } = trpc.artist.list.useQuery();
    
    const updateMutation = trpc.album.updateById.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
            setIsEditing(false);
            toast.success("Album updated!");
        },
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            id: albumProp.id,
            title: title,
            artist_id: selectedArtistId,
        });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Edit Album</h3>
                <form
                    onSubmit={handleUpdate}
                    className={styles.form}
                >
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.inputField}
                        />
                    </label>
                    <label>
                        Artist:
                        <select
                            value={selectedArtistId}
                            onChange={(e) => setSelectedArtistId(e.target.value)}
                            disabled={artistsLoading || !artists?.length}
                            className={styles.inputField}
                        >
                            <option value="">-- Select an artist --</option>
                            {artists?.map((artist: Artist) => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                        {artistsLoading && <span>Loading artists...</span>}
                        {!artistsLoading && !artists?.length && (
                            <span>No artists available.</span>
                        )}
                    </label>
                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
