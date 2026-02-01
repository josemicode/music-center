import CreateAlbumForm from "./components/CreateAlbumForm";
import AlbumList from "./components/AlbumList";
import SearchAlbum from "./components/SearchAlbum";
import { Toaster } from "react-hot-toast";
import styles from "./styles/Home.module.css";

export default function Home() {
    return (
        <main className={styles.mainContainer}>
            <h1>Music Center 2 (Next.js + tRPC)</h1>

            {/* Form & Search Section */}
            <div className={styles.formSearchSection}>
                <CreateAlbumForm />
                <SearchAlbum />
            </div>

            {/* List Section */}
            <AlbumList />

            <Toaster position="bottom-center" reverseOrder={true} />
        </main>
    );
}
