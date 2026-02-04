"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <h1 className={styles.logo}>Music Center</h1>
                <div className={styles.links}>
                    <Link
                        href="/"
                        className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
                    >
                        Albums
                    </Link>
                    <Link
                        href="/artists"
                        className={`${styles.link} ${pathname.startsWith("/artists") ? styles.active : ""}`}
                    >
                        Artists
                    </Link>
                </div>
            </div>
        </nav>
    );
}
