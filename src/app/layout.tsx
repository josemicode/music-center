"use client"; // This component must be a client component to use Providers

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server";

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
                    url: "http://localhost:3000/api/trpc",
                }),
            ],
        }),
    );

    return (
        <html lang="en">
            <body>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </trpc.Provider>
            </body>
        </html>
    );
}
