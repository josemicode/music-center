"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";

const randomIdGenerator = () => {
    return Math.floor(Math.random() * 100).toString();
};

export default function CreateArtistForm() {
    const utils = trpc.useUtils();
    const [name, setName] = useState("");

    const createMutation = trpc.artist.create.useMutation({
        onSuccess: () => {
            utils.artist.invalidate();
            toast.success("Artist Created!");
            setName(""); // Clear input on success
        },
        onError: () => {
            toast.error("Oops... Failed to create artist");
        },
    });

    const handleCreation = () => {
        if (!name.trim()) {
            toast.error("Please enter artist name");
            return;
        }

        createMutation.mutate({
            id: randomIdGenerator(),
            name: name.trim(),
        });
    };

    return (
        <div>
            <h2>Add Artist</h2>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Artist Name"
                disabled={createMutation.isPending}
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
