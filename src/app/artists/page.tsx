import CreateArtistForm from "../components/CreateArtistForm";
import ArtistList from "../components/ArtistList";
import { Toaster } from "react-hot-toast";
import styles from "../styles/Home.module.css";

export default function ArtistsPage() {
    return (
        <main className={styles.mainContainer}>
            <h1>Artists Management</h1>

            {/* Form Section */}
            <div className={styles.formSearchSection}>
                <CreateArtistForm />
            </div>

            {/* List Section */}
            <ArtistList />

            <Toaster position="bottom-center" reverseOrder={true} />
        </main>
    );
}
