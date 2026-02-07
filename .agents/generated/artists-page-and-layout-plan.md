# Plan: Artists Page and Layout Implementation

## Overview
This plan outlines the steps to implement:
1. A new artists page for creating and listing artists (similar to albums page)
2. A consistent layout with navigation bar and footer as per Phase 4 requirements
3. Integration with existing tRPC artist router

## Potential Breaking Changes

### 1. Artist Router Mutation Return Type
- **Current**: `artistRouter.create` returns a raw `Response` object from `fetch()`
- **Impact**: Frontend expects JSON response but gets raw Response; may cause runtime errors
- **Required Change**: Update mutation to return `response.json()` instead of `response`

### 2. Layout Styling Conflicts
- **Risk**: Adding navbar and footer may affect existing page layout margins/padding
- **Mitigation**: Use CSS Modules with minimal global styles; ensure responsive design

### 3. Navigation Implementation
- **Consideration**: Using Next.js `Link` component requires proper client/server component boundaries
- **Impact**: Current `layout.tsx` is already a client component; safe to add navigation

### 4. Dependency Version Compatibility
- **Current**: Next.js 14.2.35, tRPC 11.0.0-rc.0, React 18
- **Assessment**: No breaking changes expected for navigation and component creation
- **Note**: All features use existing dependencies; no new packages required

## Atomic Steps Checklist

### Phase 1: Layout Components
1. **Create layout CSS module**
   - File: `src/app/styles/Layout.module.css`
   - Actions:
     - Define styles for `.navContainer`, `.navLinks`, `.navLink`, `.activeLink`
     - Define styles for `.footerContainer` with small text and fake copyright
     - Ensure responsive design with flexbox

2. **Update Root Layout with Navigation and Footer**
   - File: `src/app/layout.tsx`
   - Actions:
     - Import CSS module
     - Import `Link` from `next/link`
     - Add `<nav>` section before `{children}`
     - Create navigation links: "Albums" (home page) and "Artists" (new page)
     - Add active link styling based on current route (optional)
     - Add `<footer>` section after `{children}` with copyright text
     - Maintain existing tRPC and React Query providers

### Phase 2: Artists Page Components
3. **Create ArtistView Component**
   - File: `src/app/components/ArtistView.tsx`
   - Actions:
     - Create client component with "use client" directive
     - Define `Artist` type matching backend structure: `{ id: string, name: string }`
     - Accept `artistProp` prop and display artist name and ID
     - Add basic styling (optional reuse of AlbumView styles)

4. **Create CreateArtistForm Component**
   - File: `src/app/components/CreateArtistForm.tsx`
   - Actions:
     - Create client component with "use client" directive
     - Import `trpc` and `toast` from `react-hot-toast`
     - Create form with input for artist name
     - Implement `randomIdGenerator` similar to albums (or use better ID generation)
     - Use `artist.create` mutation with optimistic updates/invalidation
     - Clear input on successful creation
     - Handle loading and error states

5. **Create ArtistList Component**
   - File: `src/app/components/ArtistList.tsx`
   - Actions:
     - Create client component with "use client" directive
     - Use `trpc.artist.list.useQuery()` to fetch artists
     - Import and use `Loader` component for loading state
     - Handle error state with user-friendly message
     - Map through artists and render `ArtistView` for each
     - Add basic grid/list styling

### Phase 3: Artists Page
6. **Create Artists Page**
   - File: `src/app/artists/page.tsx`
   - Actions:
     - Import `CreateArtistForm`, `ArtistList`, `Toaster`
     - Create page structure similar to home page
     - Add heading "Artists Management"
     - Include form and list sections
     - Add `Toaster` component for notifications
     - Apply consistent styling using existing CSS modules

### Phase 4: Fix Artist Router
7. **Fix Artist Create Mutation Return Type**
   - File: `src/server/routers/artist.ts`
   - Actions:
     - Update `create` mutation to parse JSON response: `return result.json()`
     - Ensure proper error handling for failed requests

### Phase 5: Testing and Validation
8. **Test Navigation**
   - Actions:
     - Start development servers (`npm run dev` and `npm run json-server`)
     - Verify navbar links work between pages
     - Confirm footer appears on all pages

9. **Test Artists Page Functionality**
   - Actions:
     - Navigate to `/artists`
     - Verify artist list displays existing artists from db.json
     - Test creating new artist via form
     - Confirm list updates automatically after creation
     - Verify error handling (e.g., empty form submission)

10. **Test Layout Consistency**
    - Actions:
      - Verify home page (albums) still works correctly
      - Confirm navbar and footer don't break existing styling
      - Test responsive behavior on different screen sizes

## File Structure Changes
```
src/app/
├── components/
│   ├── ArtistView.tsx        (new)
│   ├── CreateArtistForm.tsx  (new)
│   └── ArtistList.tsx        (new)
├── styles/
│   └── Layout.module.css     (new)
├── artists/
│   └── page.tsx              (new)
└── layout.tsx                (modified)
```

## Success Criteria
- Users can navigate between albums and artists pages via navbar
- Artists page displays list of artists and allows creation of new artists
- Footer appears on all pages with copyright text
- All existing functionality (albums CRUD) continues to work
- No console errors or TypeScript errors after implementation