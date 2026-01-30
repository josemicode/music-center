"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import EditAlbumModal from "./EditAlbumModal";
import toast from "react-hot-toast";

export type Album = {
    id: string;
    title: string;
    artist_id: number;
};

export default function AlbumView({ albumProp }: { albumProp: Album }) {
    const utils = trpc.useUtils();
    const [isEditing, setIsEditing] = useState(false);

    const deleteMutation = trpc.album.delete.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
        },
    });

    const handleDeletion = (id: number) => {
        deleteMutation.mutate(id);
        toast("Album deleted!", { icon: "🗑️" });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <div style={{ border: "1px solid #333", padding: "1rem" }}>
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
