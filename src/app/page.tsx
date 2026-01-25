"use client"; // We use 'useClient' because we are capturing user interaction and using hooks

import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Home() {
    // 1. Reading Data
    const { data: albums, isLoading } = trpc.album.list.useQuery();

    // 2. Writing Data
    const createMutation = trpc.album.create.useMutation({
        onSuccess: () => {
            alert("Album Created!");
        },
    });

    const [title, setTitle] = useState("");

    if (isLoading) return <div>Loading...</div>;

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Music Center 2 (Next.js + tRPC)</h1>

            {/* Form Example */}
            <div
                style={{
                    marginBottom: "2rem",
                    border: "1px solid #ccc",
                    padding: "1rem",
                }}
            >
                <h2>Add Album</h2>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Album Title"
                />
                <button
                    onClick={() =>
                        createMutation.mutate({ title, artist_id: 999 })
                    }
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? "Saving..." : "Create"}
                </button>
            </div>

            {/* List Example */}
            <div style={{ display: "grid", gap: "1rem" }}>
                {albums?.map((album) => (
                    <div
                        key={album.id}
                        style={{ border: "1px solid #333", padding: "1rem" }}
                    >
                        <h3>{album.title}</h3>
                        <p>ID: {album.id}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
