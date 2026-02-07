"use client";

import styles from "../styles/AlbumList.module.css";
import { trpc } from "@/utils/trpc";
import ArtistView, { Artist } from "./ArtistView";
import Loader from "./Loader";

export default function ArtistList() {
    const { data: artists, isLoading, isError, error } = trpc.artist.list.useQuery();

    if (isLoading) return <Loader />;
    if (isError) return <div className={styles.error}>Error loading artists: {error.message}</div>;

    return (
        <div className={styles.albumGrid}>
            {artists?.map((artist: Artist) => (
                <ArtistView key={artist.id} artistProp={artist} />
            ))}
        </div>
    );
}
