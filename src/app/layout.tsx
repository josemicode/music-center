"use client"; // This component must be a client component to use Providers

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles/Layout.module.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Initialize State
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: "http://localhost:8080/api/trpc",
                }),
            ],
        }),
    );

    const pathname = usePathname();

    return (
        <html lang="en">
            <body>
                <nav className={styles.navContainer}>
                    <div style={{ color: "white" }}>Music Center</div>
                    <ul className={styles.navLinks}>
                        <li>
                            <Link
                                href="/"
                                className={`${styles.navLink} ${pathname === "/" ? styles.activeLink : ""}`}
                            >
                                Albums
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/artists"
                                className={`${styles.navLink} ${pathname === "/artists" ? styles.activeLink : ""}`}
                            >
                                Artists
                            </Link>
                        </li>
                    </ul>
                </nav>

                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </trpc.Provider>

                <footer className={styles.footerContainer}>
                    <p>
                        &copy; {new Date().getFullYear()} Music Center. All
                        rights reserved.
                    </p>
                </footer>
            </body>
        </html>
    );
}
