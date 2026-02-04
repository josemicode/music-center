"use client"; // This component must be a client component to use Providers

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

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

    return (
        <html lang="en">
            <body
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Navbar />
                <div style={{ flex: 1 }}>
                    <trpc.Provider
                        client={trpcClient}
                        queryClient={queryClient}
                    >
                        <QueryClientProvider client={queryClient}>
                            {children}
                        </QueryClientProvider>
                    </trpc.Provider>
                </div>
                <Footer />
            </body>
        </html>
    );
}
