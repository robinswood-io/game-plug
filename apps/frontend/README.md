# Game Plug Frontend

Next.js 16 frontend for the Game Plug Call of Cthulhu RPG platform.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **tRPC** - End-to-end type-safe API client
- **TanStack Query v5** - Server state management
- **Socket.io** - Real-time communication
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Turbopack** - Fast builds

## Getting Started

### Prerequisites

- Node.js 20+
- Backend running on http://localhost:4000

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
apps/frontend/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   ├── (dashboard)/       # Protected routes
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # Client providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Base UI components
├── hooks/                # Custom hooks
├── lib/                  # Utilities
│   ├── trpc.ts          # tRPC client
│   ├── socket.ts        # Socket.io client
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## Backend Integration

### tRPC Client

The tRPC client provides end-to-end type safety with the NestJS backend:

```typescript
'use client';

import { trpc } from '@/lib/trpc';

export function CharacterList() {
  const { data, isLoading } = trpc.characters.list.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(character => (
        <div key={character.id}>{character.name}</div>
      ))}
    </div>
  );
}
```

### Socket.io Client

Real-time updates via Socket.io:

```typescript
'use client';

import { useEffect } from 'react';
import { connectSocket, onSocketEvent } from '@/lib/socket';

export function GameBoard() {
  useEffect(() => {
    const socket = connectSocket();

    const cleanup = onSocketEvent('gameboard:update', (data) => {
      console.log('GameBoard updated:', data);
    });

    return cleanup;
  }, []);

  return <div>GameBoard</div>;
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Migration Status

This frontend is part of the Phase 2 migration from the legacy Vite + React stack to Next.js 16.

See `/srv/workspace/game-plug/MIGRATION_PLAN.md` for full details.
