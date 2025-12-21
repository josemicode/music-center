/**
 * FOLDER PURPOSE: Client Components
 * 
 * This is where your reusable UI components go (Buttons, Cards, Forms).
 * In Next.js App Router, these are Server Components by default unless you add "use client";
 * 
 * Since this is a tRPC scaffold, you will likely use 'trpc' hooks inside components here.
 * Example:
 * 
 * // src/app/components/AlbumCard.tsx
 * "use client";
 * import { trpc } from '@/utils/trpc';
 * 
 * export function AlbumCard({ id }) {
 *   const { data } = trpc.album.getById.useQuery(id);
 *   // ...
 * }
 */
