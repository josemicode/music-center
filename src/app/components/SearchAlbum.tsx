"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import AlbumView from "./AlbumView";

export default function SearchAlbum() {
    const utils = trpc.useUtils();
    const [inputSearch, setInputSearch] = useState("");
    
    // Using TRPC generic error handling might be needed if parseInt returns NaN? 
    // But getById likely expects number.
    // Ensure we don't pass NaN to the query if possible, or let it fail gracefully.
    // Current impl: parseInt(inputSearch)
    
    const rowQuery = trpc.album.getById.useQuery(parseInt(inputSearch) || 0, {
        enabled: false,
    });

    const deleteMutation = trpc.album.delete.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
            // Optionally clear the search result or refetch?
            rowQuery.refetch(); 
        },
    });

    const handleDeletion = (id: number) => {
        deleteMutation.mutate(id);
    };

    return (
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
            
            <div style={{ marginTop: "1rem" }}>
                <h3>Query result:</h3>
                {rowQuery.data ? (
                    <AlbumView
                        key="queryKey"
                        albumProp={rowQuery.data}
                        deleteAlbum={handleDeletion}
                    />
                ) : (
                    <p>
                        Insert an <em>ID</em> first!
                    </p>
                )}
            </div>
        </div>
    );
}
