"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Album } from "./AlbumView";
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
            artist_id: albumProp.artist_id,
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
