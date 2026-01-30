"use client";

import { trpc } from "@/utils/trpc";
import AlbumView, { Album } from "./AlbumView";

export default function AlbumList() {
    const { data: albums, isLoading } = trpc.album.list.useQuery();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            {albums?.map((album: Album) => (
                <AlbumView key={album.id} albumProp={album} />
            ))}
        </div>
    );
}
