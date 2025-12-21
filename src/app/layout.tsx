"use client"; // This component must be a client component to use Providers

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { httpBatchLink } from '@trpc/client';

/**
 * FILE PURPOSE: The Application Wrapper
 * 
 * In Next.js App Router, 'layout.tsx' wraps your entire application.
 * This is where we need to inject the tRPC and React Query providers so that
 * any component inside your app can use the 'trpc' hooks.
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Initialize State
  // We use useState to ensure the client is only created once per application lifecycle
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        //TODO: Figure out url handling on real projects
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc', // URL to your API handler
        }),
      ],
    })
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
