"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import AlbumView from "./AlbumView";
import styles from "../styles/SearchAlbum.module.css";

export default function SearchAlbum() {
    const [inputSearch, setInputSearch] = useState("");
    const [lastSearchedId, setLastSearchedId] = useState<string | null>(null);

    const rowQuery = trpc.album.getById.useQuery(lastSearchedId!, {
        enabled: lastSearchedId !== null,
    });

    const handleSearch = () => {
        const id = inputSearch.trim();
        if (id) {
            setLastSearchedId(id);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <h2>Search Album</h2>
            <input
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder="Album ID"
            />
            <button onClick={handleSearch}>Go</button>

            <div className={styles.resultContainer}>
                <h3>Query result:</h3>
                {rowQuery.isLoading && <p>Searching...</p>}
                {rowQuery.isError && (
                    <p className={styles.error}>
                        Error: {rowQuery.error.message}
                    </p>
                )}
                {rowQuery.data ? (
                    <AlbumView
                        key={rowQuery.data.id}
                        albumProp={rowQuery.data}
                    />
                ) : (
                    !rowQuery.isLoading &&
                    lastSearchedId !== null && (
                        <p>No album found with ID {lastSearchedId}</p>
                    )
                )}
                {lastSearchedId === null && (
                    <p>
                        Insert an <em>ID</em> first!
                    </p>
                )}
            </div>
        </div>
    );
}
