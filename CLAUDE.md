# Project Guidelines

## Overview

Rhythm Run is a Next.js app that finds tracks by artist + tempo. It utilizes
APIs from MetaMusic, MusicBrainz, Last.fm, and GetSongBPM. It allows users to
export selected tracks to Spotify playlists.

Stack: Next 16, React 19, Tailwind 4, Jest.

## Commands

`pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm tsc --noEmit`

## Architecture

- `components/` - feature and composite UI components, with subfolders for more specialized components
- `components/elements/` - styled primitives that wrap native HTML elements and forward all native attributes, e.g., A => a, Button => button, P => p
- `hooks/` - reusable React hooks for state, UI/focus, session, and business logic
- `hooks/api/` - subfolder for hooks specifically for data fetching
- `lib/` - shared non-UI logic: API clients, auth, caching, normalization, constants, and utilities
- `models/` - TypeScript types: one file per external API, plus the app's canonical types in `rhythmRun.ts`
- `proxy.ts` - Next request interception. The `proxy` function runs on every page request before route handlers. Notably here it redirects uppercase paths to lowercase.

## Code Patterns

- Never use nested ternaries. Extract the logic to a named function above `return` using a flat sequence of guard returns--one `if (...) return ...` per branch with the fallback last.
- Avoid multiline ternaries inline in JSX props. Extract them to a named function above `return`.
- Import ordering: subfolders (A–Z) before root files (A–Z). Example for `@/components/`: `elements/` and `icons/` imports before `ArtistSearch`, `Button`, etc.
- All project imports in source files use the `@/` alias, never relative paths--even same-folder siblings. Only test files use `./`.
- Tests structure: flat `it()` calls, no `describe`, assign DOM queries to a const before `expect`/`userEvent`.
- New code should be formatted by Prettier according to the `.prettierrc` file (tabs, single quotes).

## Gotchas

- Important: `proxy.ts` and its exported `proxy` function are the current Next convention (they replaced `middleware`). Never rename them to `middleware.ts`/`middleware`. The rename breaks the build in newer Next versions.
- Never invent Tailwind classes. Check `app/globals.css` for the full set of color tokens.

## Definition of Done

Run these after making changes, before reporting work done.

### After any changes

- `pnpm test` — all tests must pass
- `pnpm tsc --noEmit` — must pass with zero errors
- `pnpm lint` — must pass with zero errors
- Check that no real API keys or secrets are present in any changed files. They belong in `.env.local` only and must never be committed

### After renaming a component or file

- Re-check import order in every file that imports the renamed symbol. The rename may have broken alphabetical ordering.
