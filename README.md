## Project Overview

This is a Next.js 15 application that creates a Trackmania Map Randomizer. The app reads from a large JSON history file (`data/history.json`) containing Trackmania map data and provides a web interface to randomly select maps with year-based filtering.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **Package Manager**: pnpm
- **UI Library**: Radix UI components via shadcn/ui

### Key Structure
- `/app` - Next.js App Router pages and layouts
- `/components/ui` - shadcn/ui component library
- `/data/history.json` - Large JSON file (~380KB) containing Trackmania map data
- `/lib/utils.ts` - Utility functions (Tailwind class merging)
- `/hooks` - Custom React hooks

### Core Functionality
The main application (`app/page.tsx`) implements:
- Map randomization from history data
- Year-based filtering (2021-2025)
- Interactive map selection with remove/replace functionality
- Responsive UI with dark mode theme

### Configuration Notes
- Next.js config disables ESLint and TypeScript build errors (`next.config.mjs`)
- Uses absolute imports with `@/` prefix for all local modules
- Dark mode is enabled by default in the root layout
- Tailwind configured with shadcn/ui design system and CSS variables

### Data Structure
The history.json file contains a structured format with:
- `format`: version number
- `generated`: timestamp
- `maps[]`: array of map objects with uid, name, author, events, authorTime, votes, download

Each map has events with timestamps that are used for year filtering functionality.
