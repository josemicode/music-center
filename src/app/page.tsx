"use client"; // We use 'useClient' because we are capturing user interaction and using hooks

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type Album = {
    id: string;
    title: string;
    artist_id: number;
};

const randomIdGenerator = () => {
    return Math.floor(Math.random() * 100);
};

export function AlbumView(props: Album) {
    return (
        <div style={{ border: "1px solid #333", padding: "1rem" }}>
            <h3>{props.title}</h3>
            <p>ID: {props.id}</p>
        </div>
    );
}

export default function Home() {
    const utils = trpc.useUtils();

    const { data: albums, isLoading } = trpc.album.list.useQuery();

    const createMutation = trpc.album.create.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
            toast.success("Album Created!");
        },
        onError: () => {
            toast.error("Oops...");
        },
    });

    const handleCreation = (album: Album) => {
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
                                id: randomIdGenerator().toString(),
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
                    <button onClick={() => rowQuery.refetch()}>{"Go"}</button>
                </div>
            </div>

            {/*List Example*/}
            <div style={{ display: "grid", gap: "1rem" }}>
                {albums?.map((album: Album) => (
                    <AlbumView key={album.id} {...album} />
                ))}
            </div>

            {/*Query Example*/}
            <div style={{ display: "grid", gap: "1rem" }}>
                <h3>Query result:</h3>
                {rowQuery.data ? (
                    <AlbumView key="queryKey" {...rowQuery.data} />
                ) : (
                    <p>
                        Insert an <em>ID</em> first!
                    </p>
                )}
            </div>
            <Toaster position="bottom-center" reverseOrder={true} />
        </main>
    );
}
