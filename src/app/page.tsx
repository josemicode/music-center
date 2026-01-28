"use client"; // We use 'useClient' because we are capturing user interaction and using hooks

import { trpc } from "@/utils/trpc";
import { useState } from "react";

const randomIdGenerator = () => {
    return Math.floor(Math.random() * 100);
};

export default function Home() {
    type Album = {
        id: string;
        title: string;
        artist_id: number;
    };

    // 1. Reading Data
    const { data: albums, isLoading } = trpc.album.list.useQuery();

    // 2. Writing Data
    const createMutation = trpc.album.create.useMutation({
        onSuccess: () => {
            alert("Album Created!");
        },
        onError: () => {
            alert("Oops...");
        },
    });

    type Override<T, R> = Omit<T, keyof R> & R;
    const handleCreation = (album: Override<Album, { id: number }>) => {
        createMutation.mutate(album);
    };

    const [title, setTitle] = useState("");
    const [inputSearch, setInputSearch] = useState("");
    const rowQuery = trpc.album.getById.useQuery(parseInt(inputSearch), {
        enabled: false,
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Music Center 2 (Next.js + tRPC)</h1>

            {/* Form Example */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "2rem",
                    border: "1px solid #ccc",
                    padding: "1rem",
                }}
            >
                <div>
                    <h2>Add Album</h2>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Album Title"
                    />
                    <button
                        onClick={() =>
                            handleCreation({
                                id: randomIdGenerator(),
                                title: title,
                                artist_id: randomIdGenerator(),
                            })
                        }
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Saving..." : "Create"}
                    </button>
                </div>
                <div
                    style={{
                        alignSelf: "auto",
                        marginLeft: "3rem",
                        alignContent: "end",
                    }}
                >
                    <h2>Search Album</h2>
                    <input
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                        placeholder="Album ID"
                    />
                    <button
                        onClick={() => {
                            rowQuery.refetch();
                        }}
                    >
                        {"Go"}
                    </button>
                </div>
            </div>

            {/*List Example*/}
            <div style={{ display: "grid", gap: "1rem" }}>
                {albums?.map((album: Album) => (
                    <div
                        key={album.id}
                        style={{ border: "1px solid #333", padding: "1rem" }}
                    >
                        <h3>{album.title}</h3>
                        <p>ID: {album.id}</p>
                    </div>
                ))}
            </div>
            {/*Query Example*/}
            <div style={{ display: "grid", gap: "1rem" }}>
                <h3>Query result:</h3>
                <div
                    key="queryKey"
                    style={{ border: "1px solid #333", padding: "1rem" }}
                >
                    {rowQuery.data ? (
                        <h3>
                            {rowQuery.data.id} - {rowQuery.data.title}
                        </h3>
                    ) : (
                        <p>Hey</p>
                    )}
                </div>
            </div>
        </main>
    );
}
