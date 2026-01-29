export type Album = {
    id: string;
    title: string;
    artist_id: number;
};

export default function AlbumView({
    albumProp,
    deleteAlbum,
}: {
    albumProp: Album;
    deleteAlbum: (id: number) => void;
}) {
    return (
        <>
            <div style={{ border: "1px solid #333", padding: "1rem" }}>
                <h3>{albumProp.title}</h3>
                <p>ID: {albumProp.id}</p>
            </div>
            <button onClick={() => deleteAlbum(parseInt(albumProp.id))}>
                Delete
            </button>
        </>
    );
}
