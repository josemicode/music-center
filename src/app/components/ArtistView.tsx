"use client";

import styles from "../styles/AlbumView.module.css";

export type Artist = {
    id: string;
    name: string;
};

export default function ArtistView({ artistProp }: { artistProp: Artist }) {
    return (
        <div className={styles.albumCard}>
            <h3>{artistProp.name}</h3>
            <p>ID: {artistProp.id}</p>
        </div>
    );
}
