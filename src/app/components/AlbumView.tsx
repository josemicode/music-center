"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";

export type Album = {
    id: string;
    title: string;
    artist_id: number;
};

export default function AlbumView({ albumProp }: { albumProp: Album }) {
    const utils = trpc.useUtils();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(albumProp.title);

    const deleteMutation = trpc.album.delete.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
        },
    });

    const updateMutation = trpc.album.updateById.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
            setIsEditing(false);
            toast.success("Album updated!");
        },
    });

    const handleDeletion = (id: number) => {
        deleteMutation.mutate(id);
        toast("Album deleted!", { icon: "🗑️" });
    };

    const handleEdit = () => {
        setTitle(albumProp.title);
        setIsEditing(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            id: albumProp.id,
            title: title,
            artist_id: albumProp.artist_id,
        });
    };

    return (
        <>
            <div style={{ border: "1px solid #333", padding: "1rem" }}>
                <h3>{albumProp.title}</h3>
                <p>ID: {albumProp.id}</p>
            </div>
            <button onClick={handleEdit}>
                Edit
            </button>
            <button onClick={() => handleDeletion(parseInt(albumProp.id))}>
                Delete
            </button>

            {isEditing && (
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
                        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ marginLeft: "10px", padding: "5px" }}
                                />
                            </label>
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button type="submit" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? "Saving..." : "Save"}
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
