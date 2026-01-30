"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { Album } from "./AlbumView";

const randomIdGenerator = () => {
    return Math.floor(Math.random() * 100);
};

export default function CreateAlbumForm() {
    const utils = trpc.useUtils();
    const [title, setTitle] = useState("");

    const createMutation = trpc.album.create.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
            toast.success("Album Created!");
            setTitle(""); // Clear input on success
        },
        onError: () => {
            toast.error("Oops...");
        },
    });

    const handleCreation = () => {
        createMutation.mutate({
            id: randomIdGenerator().toString(),
            title: title,
            artist_id: randomIdGenerator(),
        });
    };

    return (
        <div>
            <h2>Add Album</h2>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Album Title"
            />
            <button
                onClick={handleCreation}
                disabled={createMutation.isPending}
            >
                {createMutation.isPending ? "Saving..." : "Create"}
            </button>
        </div>
    );
}
