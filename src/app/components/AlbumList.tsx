"use client";

import styles from "../styles/AlbumList.module.css";
import { trpc } from "@/utils/trpc";
import AlbumView, { Album } from "./AlbumView";
import Loader from "./Loader";

export default function AlbumList() {
    const { data: albums, isLoading } = trpc.album.list.useQuery();

    if (isLoading) return <Loader />;

    return (
        <div className={styles.albumGrid}>
            {albums?.map((album: Album) => (
                <AlbumView key={album.id} albumProp={album} />
            ))}
        </div>
    );
}
