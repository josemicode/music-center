"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import ArtistView from "@/app/components/ArtistView";
import styles from "../styles/Home.module.css";
import { Artist } from "@/app/components/ArtistView";

export default function ArtistsPage() {
    const utils = trpc.useUtils();
    const [name, setName] = useState("");

    const {
        data: artists,
        isLoading,
        isError,
        error,
    } = trpc.artist.list.useQuery();

    const createMutation = trpc.artist.create.useMutation({
        onSuccess: () => {
            utils.artist.invalidate();
            toast.success("Artist created!");
            setName("");
        },
        onError: (err) => {
            toast.error(`Failed to create artist: ${err.message}`);
        },
    });

    const handleCreate = () => {
        if (!name.trim()) {
            toast.error("Please enter artist name");
            return;
        }
        createMutation.mutate({
            name: name.trim(),
        });
    };

    return (
        <main className={styles.mainContainer}>
            <h1>Artists Management</h1>

            <div className={styles.formSearchSection}>
                <div>
                    <h2>Add Artist</h2>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Artist Name"
                        style={{ marginRight: "0.5rem", padding: "0.5rem" }}
                    />
                    <button
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                        style={{ padding: "0.5rem 1rem" }}
                    >
                        {createMutation.isPending ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>

            <div>
                <h2>Artists List</h2>
                {isLoading && <p>Loading artists...</p>}
                {isError && <p>Error loading artists: {error?.message}</p>}
                {artists && (
                    <div>
                        {artists.map((artist: Artist) => (
                            <ArtistView key={artist.id} artistProp={artist} />
                        ))}
                    </div>
                )}
                {artists?.length === 0 && (
                    <p>No artists found. Add one above!</p>
                )}
            </div>

            <Toaster position="bottom-center" reverseOrder={true} />
        </main>
    );
}
