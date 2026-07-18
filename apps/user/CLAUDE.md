# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the web frontend for **AS59105 Service Online** (dsbd-web) - a network service management platform for HomeNOC. Built with React 18, TypeScript 5, and Vite.

## Development Commands

```bash
# Setup
nvm use                 # Uses Node.js LTS/Hydrogen
npm ci                  # Install dependencies

# Development
npm start               # Start dev server (Vite, opens browser automatically)
npm start-prod          # Start dev server with production config

# Build
npm run build           # Development build
npm run build-staging   # Staging build
npm run build-prod      # Production build

# Quality
npm run lint            # ESLint check
npm run lint:fix        # ESLint auto-fix
npm test                # Run Jest tests
```

## Environment Variables

Configure in `.env.development`, `.env.staging`, or `.env.production`:
- `VITE_API_URL` - Backend API endpoint
- `VITE_WS_URL` - WebSocket endpoint
- `VITE_DONATE_URL` - Donation service URL
- `VITE_HCAPTCHA_SITE_KEY` - hCaptcha site key
- `VITE_ENABLE_MONEY` - Enable payment features

## Architecture

### Directory Structure

```
src/
├── api/          # API layer - each file handles one domain (Auth, Group, Service, etc.)
├── components/   # Reusable UI components including Dashboard layout
├── pages/        # Page-level components organized by feature
├── routes/       # Route protection (PrivateRoute wrapper)
├── store/        # Redux store, reducers, and actions
├── interface.ts  # TypeScript interfaces for all data types
└── style.ts      # Shared MUI styled components
```

### Key Patterns

**API Layer** (`src/api/`):
- All API functions return `Promise<{ error: string; data: any }>`
- Authentication uses dual tokens: `USER_TOKEN` (client-generated) and `ACCESS_TOKEN` (server-provided)
- Tokens stored in cookies via js-cookie

**State Management**:
- Redux with two main reducers: `infos` (user/group/service data) and `templates` (service templates, IP routes)
- Key thunks: `renewInfos()` fetches user data, `getTemplates()` fetches templates
- Use `useSelector((state: RootState) => state.infos)` to access store

**Routing**:
- Protected routes wrapped with `PrivateRoute` component
- Public routes: `/`, `/login`, `/register`, `/forget`
- All dashboard routes under `/dashboard/*` require authentication

**Forms**:
- React Hook Form with Yup validation
- Default data objects defined in `interface.ts` (e.g., `DefaultGroupAddData`)

**UI**:
- Material-UI v5 with dark theme (defined in `components/Theme.ts`)
- Notistack for toast notifications

### Authentication Flow

1. User submits email/password
2. Frontend receives token from server, generates random `USER_TOKEN`
3. Password hashed with SHA256 using server token
4. Hash verified by server, `ACCESS_TOKEN` returned
5. Both tokens stored in cookies for API authentication

### Data Types

Main interfaces in `interface.ts`:
- `InfoData` - Root data structure containing user, group, services, connections
- `GroupData`, `ServiceData`, `ConnectionData` - Entity types
- `TicketData`, `ChatData` - Support ticket system
- `TemplateData` - Service/connection templates
