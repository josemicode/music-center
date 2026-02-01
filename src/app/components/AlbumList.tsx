"use client";

import styles from "../styles/AlbumList.module.css";
import { trpc } from "@/utils/trpc";
import AlbumView, { Album } from "./AlbumView";
import Loader from "./Loader";

export default function AlbumList() {
    const { data: albums, isLoading, isError, error } = trpc.album.list.useQuery();

    if (isLoading) return <Loader />;
    if (isError) return <div className={styles.error}>Error loading albums: {error.message}</div>;

    return (
        <div className={styles.albumGrid}>
            {albums?.map((album: Album) => (
                <AlbumView key={album.id} albumProp={album} />
            ))}
        </div>
    );
}
