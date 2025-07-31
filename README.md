# AI Phone Screen Interview Project

## Overview

This is a starter template for building an AI-powered phone screening system. The goal is to automate first-round phone screens with candidates, allowing recruiters to initiate calls and review structured call logs through an operator console.

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see the application

## Project Requirements

### MVP Features to Implement

1. **Outbound Voice Call**
   - Create a button/form to initiate calls
   - For MVP, simulate the call process (no actual phone integration required)

2. **Scripted Dialogue**
   - Implement an AI agent that asks screening questions:
     - Role interest
     - Years of experience
     - Tech stack familiarity
     - Work authorization status

3. **Transcription Storage**
   - Store call transcripts in a database
   - Design appropriate data models

4. **Operator Console**
   - Start Call form with phone number input
   - Call logs table view
   - Call detail view with full transcript

5. **API Design**
   - Define and implement necessary API endpoints for:
     - Starting calls
     - Fetching call logs
     - Retrieving call details/transcripts

### Technical Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Database**: Your choice (consider SQLite, PostgreSQL, or even in-memory for MVP)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── example/       # Example API endpoint (see route.ts)
│   └── page.tsx          # Main operator console page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── example-api-usage.tsx  # Example of API interaction
├── types/                # TypeScript type definitions
│   └── index.ts         # Put your types here
└── lib/                 # Utility functions
```

## Available Resources

### Example API Endpoint
See `src/app/api/example/route.ts` for an example of how to create API endpoints in Next.js 14.

### Example Component
See `src/components/example-api-usage.tsx` for an example of how to interact with API endpoints from React components.

### Type Definitions
Basic TypeScript interfaces are provided in `src/types/index.ts`. Expand these based on your implementation needs.

### UI Components
shadcn/ui components are pre-installed:
- Button
- Card
- Form
- Input
- Label
- Table
- Badge
- Dialog

Good luck! Focus on demonstrating your ability to structure a clean, functional application.
