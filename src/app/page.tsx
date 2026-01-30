import CreateAlbumForm from "./components/CreateAlbumForm";
import AlbumList from "./components/AlbumList";
import SearchAlbum from "./components/SearchAlbum";
import { Toaster } from "react-hot-toast";

export default function Home() {
    return (
        <main style={{ padding: "2rem" }}>
            <h1>Music Center 2 (Next.js + tRPC)</h1>

            {/* Form & Search Section */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "2rem",
                    border: "1px solid #ccc",
                    padding: "1rem",
                }}
            >
                <CreateAlbumForm />
                <SearchAlbum />
            </div>

            {/* List Section */}
            <AlbumList />

            <Toaster position="bottom-center" reverseOrder={true} />
        </main>
    );
}
