# Plan: Connect Albums to Artists

## Overview
This plan implements the remaining Phase 2 items from TODO.md:
1. **Enhanced Album Display**: When listing albums, fetch artist details to show "Album Title by Artist Name" instead of just an artist ID.
2. **Improved Album Creation**: Update the "Add Album" form to include a `<select>` dropdown populated with artists from the database.

The implementation will establish proper relational data handling between albums and artists, demonstrating how to work with related entities in a Next.js + tRPC + React Query stack.

## Potential Breaking Changes

### 1. Data Type Inconsistency
- **Current State**: 
  - Artists have string IDs (`id: string`) in `db.json` and backend types
  - Albums have numeric `artist_id` (`artist_id: number`) in `db.json` and frontend Album type
  - Sample data shows mismatched IDs (albums with artist_id 101, 102 but artists have IDs "1", "2", "3")
- **Impact**: Runtime errors when trying to match artists to albums; type mismatches
- **Required Change**: 
  - Convert album `artist_id` to string to match artist ID type
  - Update all album entries in `db.json` to use string `artist_id`
  - Update frontend `Album` type and backend schemas

### 2. Album Router Return Type Changes
- **Current**: `albumRouter.list` returns `Album[]` with only `artist_id`
- **New Requirement**: Need to return albums with artist details (name)
- **Impact**: Frontend components expecting current Album type may break
- **Mitigation**: Create new type `AlbumWithArtist` or extend return type gradually

### 3. Artist Router Dependency
- **Requirement**: Album list needs to fetch artists
- **Impact**: Album listing depends on artist router availability
- **Mitigation**: Handle missing artists gracefully (show "Unknown Artist")

### 4. Create Album Form Changes
- **Current**: Random `artist_id` generation
- **New Requirement**: User-selected artist from dropdown
- **Impact**: Form submission requires valid artist ID from dropdown; validation needed

## Atomic Steps Checklist

### Phase 1: Data Consistency Fix
1. **Fix db.json Data Consistency**
   - File: `src/utils/db.json`
   - Actions:
     - Convert all album `artist_id` values from numbers to strings (e.g., 1 → "1")
     - Update album entries to reference existing artist IDs ("1", "2", "3")
     - Remove or fix albums with non-existent artist IDs (101, 102, 71, 96)
   - Verification: All albums should reference existing artists with string IDs

2. **Update Frontend Album Type**
   - File: `src/app/components/AlbumView.tsx`
   - Actions:
     - Change `Album` type `artist_id: number` to `artist_id: string`
   - Note: This will affect all components using the `Album` type

3. **Update Album Router Schemas**
   - File: `src/server/routers/album.ts`
   - Actions:
     - Update `create` input schema: `artist_id: z.string().min(1)`
     - Update `updateById` input schema: `artist_id: z.string().min(1).optional()`
     - Ensure all mutations accept string `artist_id`

### Phase 2: Enhanced Album Router with Artist Details
4. **Create AlbumWithArtist Type (Optional)**
   - File: `src/app/components/AlbumView.tsx` or new shared types file
   - Actions:
     - Define `type AlbumWithArtist = Album & { artist?: Artist }`
     - Or simply extend Album type with optional artist property
   - Consideration: Keep in same file if only used locally

5. **Update Album Router to Include Artist Details**
   - File: `src/server/routers/album.ts`
   - Actions:
     - Modify `list` procedure to:
       - Fetch albums from `/albums`
       - Fetch artists from `/artists` 
       - Join albums with artists by `artist_id` (both strings now)
       - Return array with album data + artist object (or just artist name)
     - Implementation: Use `Promise.all` for parallel fetching
     - Error handling: Continue if artist fetch fails

6. **Handle Missing Artists Gracefully**
   - Actions in album router:
     - Use `find()` to match artist by ID
     - If no artist found, include `artist: null` or placeholder
     - Frontend should display "Unknown Artist" when artist is null

### Phase 3: Update Frontend Album Display
7. **Update AlbumList Component**
   - File: `src/app/components/AlbumList.tsx`
   - Actions:
     - Continue using `trpc.album.list.useQuery()` (now returns artist data)
     - Update type annotations if using `AlbumWithArtist`
     - Pass full album data (including artist) to AlbumView

8. **Update AlbumView Component**
   - File: `src/app/components/AlbumView.tsx`
   - Actions:
     - Update props to accept artist data
     - Modify display: show `{album.title} by {artist?.name || 'Unknown Artist'}`
     - Update styling if needed for new layout
     - Keep existing edit/delete functionality

9. **Update SearchAlbum Component (if needed)**
   - File: `src/app/components/SearchAlbum.tsx`
   - Actions:
     - Check if `getById` returns artist details
     - May need to update album router's `getById` to include artist
     - Or fetch artist separately in component

### Phase 4: Enhanced Create Album Form
10. **Fetch Artists in CreateAlbumForm**
    - File: `src/app/components/CreateAlbumForm.tsx`
    - Actions:
      - Add `trpc.artist.list.useQuery()` to fetch artists
      - Add loading state while fetching
      - Add error handling for artist fetch failure

11. **Add Artist Dropdown to Form**
    - File: `src/app/components/CreateAlbumForm.tsx`
    - Actions:
      - Add `<select>` element with `value={selectedArtistId}`
      - Populate with `<option value={artist.id}>{artist.name}</option>`
      - Include default option like "Select an artist"
      - Store selected artist ID in state

12. **Update Form Submission**
    - Actions:
      - Remove random `artist_id` generation
      - Use selected artist ID from dropdown
      - Validate that an artist is selected
      - Update mutation call with selected `artist_id` (string)

13. **Improve Form Styling and UX**
    - Actions:
      - Style dropdown to match existing form inputs
      - Add label "Select Artist"
      - Handle empty artists list (show message/link to add artists)
      - Consider disabling form when no artists exist

### Phase 5: Update Album Edit Functionality
14. **Update EditAlbumModal Component**
    - File: `src/app/components/EditAlbumModal.tsx`
    - Actions:
      - Fetch artists list (similar to CreateAlbumForm)
      - Add artist dropdown for editing
      - Pre-select current artist based on album's `artist_id`
      - Update mutation to handle artist changes

### Phase 6: Testing and Validation
15. **Test Data Consistency**
    - Actions:
      - Verify all album `artist_id` values are strings in db.json
      - Verify all albums reference existing artists
      - Test TypeScript compilation for type errors

16. **Test Album Display with Artist Names**
    - Actions:
      - Start development servers (`npm run dev`, `npm run json-server`)
      - Verify album list shows "Album Title by Artist Name"
      - Test with albums that have missing artists (should show "Unknown Artist")

17. **Test Create Album with Artist Dropdown**
    - Actions:
      - Navigate to home page
      - Verify dropdown is populated with artists
      - Create new album with selected artist
      - Verify new album appears with correct artist name

18. **Verify No Regression**
    - Actions:
      - Test existing album CRUD operations
      - Test artist management page
      - Test search functionality
      - Ensure all mutations still work with string IDs

## File Structure Changes
```
src/
├── app/
│   ├── components/
│   │   ├── AlbumView.tsx              (modified - type change, display artist)
│   │   ├── AlbumList.tsx              (modified - use enhanced data)
│   │   ├── CreateAlbumForm.tsx        (modified - add artist dropdown)
│   │   ├── EditAlbumModal.tsx         (modified - add artist dropdown)
│   │   └── SearchAlbum.tsx            (potentially modified)
│   └── styles/                        (may need updates for new layouts)
├── server/
│   └── routers/
│       ├── album.ts                   (modified - string IDs, artist joining)
│       └── artist.ts                  (unchanged)
└── utils/
    └── db.json                        (modified - string artist_id)
```

## Success Criteria
- Album list displays artist names instead of/in addition to artist IDs
- "Add Album" form includes functional artist dropdown populated from database
- All artist IDs are consistent string values throughout the system
- Existing functionality (artist management, album CRUD) continues to work
- Graceful handling of missing artist references ("Unknown Artist")
- No TypeScript errors or console warnings after implementation
- UI remains responsive and user-friendly

## Optional Enhancements (If Time Permits)
- Add artist creation directly from album form (quick add modal)
- Implement client-side caching for artists to avoid repeated fetches
- Add search/filter to artist dropdown for many artists
- Display artist details tooltip or link to artist page
- Implement virtual scrolling for large artist lists