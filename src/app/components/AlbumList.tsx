"use client";

import { trpc } from "@/utils/trpc";
import AlbumView, { Album } from "./AlbumView";

export default function AlbumList() {
    const utils = trpc.useUtils();
    const { data: albums, isLoading } = trpc.album.list.useQuery();

    const deleteMutation = trpc.album.delete.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
        },
    });

    const handleDeletion = (id: number) => {
        deleteMutation.mutate(id);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            {albums?.map((album: Album) => (
                <AlbumView
                    key={album.id}
                    albumProp={album}
                    deleteAlbum={handleDeletion}
                />
            ))}
        </div>
    );
}
