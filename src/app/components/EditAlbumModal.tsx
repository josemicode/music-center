"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Album } from "./AlbumView";
import toast from "react-hot-toast";

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
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    minWidth: "300px",
                    color: "black",
                }}
            >
                <h3>Edit Album</h3>
                <form
                    onSubmit={handleUpdate}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                        }}
                    >
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
