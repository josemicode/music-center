# Project TODO: Music Center 2

This list outlines the next steps to evolve this project from a basic setup to a full-featured CRUD application, helping you master the **Next.js + tRPC + React Query** stack.

## Phase 1: Completing the CRUD Lifecycle

The core of any CRUD application.

- [x] **Fix Create Mutation**: Update `src/server/routers/album.ts` to actually perform a `POST` fetch to the `json-server` instead of just returning dummy data.
- [x] **Implement Delete**:
  - [x] Add a `delete` mutation in the tRPC `albumRouter`.
  - [x] Add a "Delete" button to each album item in the UI.
- [ ] **Implement Update (Edit)**:
  - [x] Add an `update` mutation (using `z.object({ id: z.number(), title: z.string() })`) in tRPC.
  - [ ] Add an "Edit" button that toggles an input field for the album title.

## Phase 2: Relational Data & Multiple Routers

Learning how to handle related entities.

- [ ] **Artist Router**:
  - [ ] Create `src/server/routers/artist.ts` and register it in `src/server/index.ts`.
  - [ ] Implement `list` and `create` for artists.
- [ ] **Connect Albums to Artists**:
  - [ ] When listing albums, fetch the artist details to show "Album Title by Artist Name" instead of just an ID.
  - [ ] Update the "Add Album" form to include a `<select>` dropdown populated with artists from the database.

## Phase 3: UX & State Management Polish

Mastering React Query and modern UI patterns.

- [x] **Cache Invalidation**: Use `utils.album.list.invalidate()` inside the `onSuccess` callback of your mutations so the list refreshes automatically without a page reload.
- [ ] **Optimistic Updates**: Implement optimistic updates for the delete action so the item "disappears" immediately while the request is still pending.
- [ ] **Loading & Error States**:
  - [ ] Add a generic `LoadingSpinner` component.
  - [ ] Handle tRPC errors gracefully in the UI (e.g., if the `json-server` is down).
- [x] **Better Notifications**: Replace the browser `alert()` calls with a toast library like `sonner` or `react-hot-toast`.

## Phase 4: UI Architecture & Styling

Making it look professional.

- [x] **Component Refactoring**: Break down the monolithic `page.tsx` into smaller components: `AlbumView`, `AddAlbumForm`, `SearchAlbum`.
  - [x] AlbumView.
  - [x] AddAlbumForm.
  - [x] SearchAlbum
- [ ] **Modern Styling**: Transition from inline styles to **Tailwind CSS** or **CSS Modules** for better maintainability and responsiveness.
- [ ] **Layouts**: Use the `layout.tsx` file to create a consistent Navigation bar and Footer.

## Phase 5: Transition to "Real" Backend (Optional / Advanced)

Moving away from mock servers.

- [ ] **Database Setup**: Set up a local PostgreSQL or SQLite database.
- [ ] **ORM Integration**: Replace the manual `fetch` calls in your tRPC routers with **Drizzle ORM** (very popular with this stack) or **Prisma**.
- [ ] **Environment Variables**: Properly use `.env` files for database credentials.
