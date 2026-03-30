"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import toast from "react-hot-toast";
import { Artist } from "./ArtistView";

const randomIdGenerator = () => {
    return Math.floor(Math.random() * 100);
};

export default function CreateAlbumForm() {
    const utils = trpc.useUtils();
    const [title, setTitle] = useState("");
    const [selectedArtistId, setSelectedArtistId] = useState("");

    const { data: artists, isLoading: artistsLoading } = trpc.artist.list.useQuery();
    
    const createMutation = trpc.album.create.useMutation({
        onSuccess: () => {
            utils.album.invalidate();
            toast.success("Album Created!");
            setTitle(""); // Clear input on success
            setSelectedArtistId(""); // Reset artist selection
        },
        onError: () => {
            toast.error("Oops...");
        },
    });

    const handleCreation = () => {
        if (!selectedArtistId) {
            toast.error("Please select an artist");
            return;
        }
        
        createMutation.mutate({
            id: randomIdGenerator().toString(),
            title: title,
            artist_id: selectedArtistId,
        });
    };

    return (
        <div>
            <h2>Add Album</h2>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Album Title"
            />
            <div>
                <label>Select Artist: </label>
                <select
                    value={selectedArtistId}
                    onChange={(e) => setSelectedArtistId(e.target.value)}
                    disabled={artistsLoading || !artists?.length}
                >
                    <option value="">-- Select an artist --</option>
                    {artists?.map((artist: Artist) => (
                        <option key={artist.id} value={artist.id}>
                            {artist.name}
                        </option>
                    ))}
                </select>
                {artistsLoading && <span>Loading artists...</span>}
                {!artistsLoading && !artists?.length && (
                    <span>No artists available. Please add artists first.</span>
                )}
            </div>
            <button
                onClick={handleCreation}
                disabled={createMutation.isPending || !selectedArtistId}
            >
                {createMutation.isPending ? "Saving..." : "Create"}
            </button>
        </div>
    );
}
