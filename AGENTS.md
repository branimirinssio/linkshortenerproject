# Link Shortener Project - Agent Instructions

> **IMPORTANT — READ THIS FIRST:** ALWAYS read the relevant individual instruction file(s) in the `/docs` directory BEFORE generating ANY CODE. NO EXCEPTIONS. These documents contain project-specific conventions, security checks, and required patterns; failing to follow them can introduce bugs, security issues, or non-compliant implementations. If you're unsure which doc applies, stop and ask for clarification before writing code.

This document contains coding standards and best practices for LLM agents working on this Next.js link shortener project. All code contributions should adhere to these guidelines.

## Quick Start for Agents

1. **Read the Relevant Guides**: Before working on any part of the codebase, consult the appropriate documentation file below
2. **Understand the Stack**: This is a **Next.js 16.2.2** project with **React 19**, **TypeScript (strict mode)**, and **Drizzle ORM**
3. **Follow Conventions**: Apply the project's coding standards consistently
4. **Verify Your Code**: Check that TypeScript compiles, ESLint passes, and types are explicit

For detailed guidlines on specific topics, refer to the modular docummentation
in the `/docs` directory, ALWAYS refer to the relevant .md file BEFORE generating any code:

## Project Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.2 | Full-stack framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5 | Type safety |
| Drizzle ORM | 0.45.2 | Database layer |
| Clerk | 7.0.11 | Authentication |
| Tailwind CSS | 4 | Styling |
| Shadcn UI | 4.2.0 | Component library |
| ESLint | 9 | Code quality |

## Core Features

This link shortener application allows users to:
- Create shortened versions of long URLs
- Track click counts on shortened links
- Manage their links in a personal dashboard
- Authenticate securely with Clerk

## Documentation Structure

### 1. **[Coding Standards](docs/coding-standards.md)** 📋
Core principles, code quality practices, security, error handling, and pre-submission checklist.

**When to read**: Before starting any implementation

**Key topics**:
- Core principles (type safety, clarity, consistency)
- ESLint and code formatting
- Security practices (input validation, auth checks, env vars)
- Error handling patterns
- Pre-submission checklist

---

### 2. **[Project Structure](docs/project-structure.md)** 📁
Directory organization, file naming conventions, and module structure.

**When to read**: When creating new files or understanding how the project is organized

**Key topics**:
- Complete directory layout
- File organization rules
- Naming conventions for files, directories, routes
- Import path conventions (`@/` absolute imports)
- Configuration files explained

---

### 3. **[TypeScript Conventions](docs/typescript-conventions.md)** 📘
TypeScript configuration, type safety guidelines, and usage patterns.

**When to read**: When writing any TypeScript code

**Key topics**:
- Strict mode enforcement
- Interface vs. Type usage
- Generic types
- Naming conventions (UPPER_SNAKE_CASE, camelCase, PascalCase)
- Null/undefined handling with optional chaining
- Error handling with `unknown` type

---

### 4. **[React & Next.js Conventions](docs/react-conventions.md)** ⚛️
React component patterns, hooks usage, Server vs Client Components, and styling.

**When to read**: When creating or modifying React components

**Key topics**:
- Functional components only (no class components)
- Server Components by default, Client Components when needed
- Props interface naming and destructuring
- Custom hooks patterns
- State management
- Form handling with Server Actions
- Styling with Tailwind and `cn()` utility
- Async patterns in components

---

### 5. **[Database & ORM Conventions](docs/database-conventions.md)** 🗄️
Drizzle schema design, query patterns, and database best practices.

**When to read**: When working with database queries or schema

**Key topics**:
- Schema structure and naming conventions (snake_case in DB, camelCase in TS)
- Column naming patterns (id, createdAt, updatedAt, isActive)
- Query patterns (select, insert, update, delete)
- Transactions
- Prepared statements
- N+1 query prevention
- Relations and joins

---

### 6. **[API & Routes Conventions](docs/api-conventions.md)** 🔌
Route handlers, API response formatting, authentication, and webhooks.

**When to read**: When building API endpoints or route handlers

**Key topics**:
- Route structure and organization
- Handler naming (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Dynamic segments with `context.params`
- Response formatting (success/error)
- Status codes
- Authentication checks with Clerk
- Request body validation with Zod
- Webhook handling pattern

---

### 7. **[Shadcn/UI Conventions](docs/shadcn-ui-conventions.md)** 🎨
Shadcn/UI component library standards, usage patterns, and best practices.

**When to read**: When building any UI component or interface

**Key topics**:
- Shadcn/UI overview and component installation
- Using components from `@/components/ui`
- Component variants and sizing
- Styling with Tailwind CSS and `cn()` utility
- Component composition patterns
- Accessibility best practices
- DOM/wrapper components for domain-specific UI
- Common components reference (Button, Input, Card, Dialog, Form, etc.)
- Type safety with component props
- Do NOTs (never create custom components)
- Component selection guide

---

### 8. **[Component Patterns](docs/component-patterns.md)** 🧩
Reusable component structure, UI patterns, and domain-specific components.

**When to read**: When creating new components or UI features

**Key topics**:
- Component file structure and organization
- Props interface patterns
- Composable shadcn UI components
- Composable components
- Form components
- List and item components
- Layout components
- Error boundaries
- Loading states and Suspense
- Skeletons and loading UI

---

### 9. **[Clerk Authentication](docs/clerk-authentication.md)** 🔐
Clerk integration, protected routes, authentication flows, and security practices.

**When to read**: When implementing authentication, protected pages, or user-specific features

**Key topics**:
- Environment setup and configuration
- Protected pages and dashboard routes
- Authentication in Server Components and Route Handlers
- Clerk UI components in modal mode
- Sign-in/sign-up/user menu components
- Home page redirect for authenticated users
- API route protection and user verification
- Storing user IDs in database
- Webhook integration patterns
- Security best practices and common patterns

---

## Technology-Specific Guidance

### Next.js 16 Breaking Changes ⚠️
This project uses **Next.js 16.2.2**, which has breaking changes from earlier versions. Before implementing features:
1. Read `AGENTS.md` and `CLAUDE.md` in the project root for version-specific notes
2. Check the Next.js official docs in `node_modules/next/dist/docs/`
3. Pay attention to deprecation notices

Key difference: Route parameter handling changed to use `Promise` in context:
```typescript
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  // ...
}
```

### TypeScript Strict Mode
This project enforces strict TypeScript:
- ✅ Always use explicit types
- ✅ Use interfaces for object shapes
- ✅ Handle null/undefined explicitly
- ❌ Never use `any`
- ❌ Avoid non-null assertions (`!`) unless 100% certain

### ESLint Configuration
Run before committing:
```bash
npm run lint
```

ESLint checks include:
- TypeScript best practices
- Next.js recommended patterns
- Core Web Vitals
- Unused variables and imports

## Authentication (Clerk Integration)

All protected operations must verify authentication with Clerk. See [Clerk Authentication Conventions](docs/clerk-authentication.md) for comprehensive guidance.

**Key rules**:
- Clerk is the ONLY authentication method for this project
- Protected routes under `/dashboard` must check `userId` with `auth()`
- Use `redirectToSignIn()` for unauthenticated access to protected pages
- Logged-in users accessing `/` should redirect to `/dashboard`
- Sign-in and sign-up must use Clerk's modal mode, not page navigation

**Example: Protected API Route**

```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Protected logic here
}
```

**Example: Protected Server Component**

```typescript
import { auth, redirectToSignIn } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirectToSignIn();
  }
  
  // Render protected content
  return <div>Dashboard</div>;
}
```

For complete patterns, environment variables, webhooks, and security best practices, see [Clerk Authentication Conventions](docs/clerk-authentication.md).

## Database (Neon PostgreSQL + Drizzle)

The database uses serverless PostgreSQL hosted on Neon:
- Connect via `@neondatabase/serverless` driver
- Define schema in `db/schema.ts` using Drizzle table definitions
- Query via `db` instance exported from `db/index.ts`
- Run migrations with `npm run db:push`

Always export types from schema for TypeScript safety:
```typescript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Common Tasks

### Creating a New API Route
1. Create file at `app/api/{resource}/route.ts`
2. Export named functions: `GET`, `POST`, etc.
3. Check authentication with `auth()`
4. Validate input body
5. Query database using Drizzle
6. Return consistent response format
7. See: [API & Routes Conventions](docs/api-conventions.md)

### Creating a New Component
1. Create file at `components/{domain}/{feature}.tsx`
2. Define props interface: `interface FeatureProps { ... }`
3. Use Tailwind for styling, `cn()` for conditional classes
4. Mark as `'use client'` only if using hooks/interactivity
5. Use shadcn components from `@/components/ui`
6. See: [Component Patterns](docs/component-patterns.md)

### Adding a New Database Table
1. Define table in `db/schema.ts` with snake_case column names
2. Define TypeScript types by exporting inferred types
3. Add table to relations if needed
4. Export table for use in queries
5. Run `npm run db:push` to apply schema
6. See: [Database & ORM Conventions](docs/database-conventions.md)

### Implementing Protected Pages
1. Create page at `app/(dashboard)/{feature}/page.tsx`
2. Make it `async` (Server Component)
3. Call `auth()` to get `userId`
4. Redirect to sign-in if not authenticated
5. Fetch user's data from database
6. Render with fetched data
7. See: [React & Next.js Conventions](docs/react-conventions.md)

## Code Review Checklist

Before opening a PR or requesting review, verify:

- [ ] **TypeScript**: Strict mode passes, no `any` types
- [ ] **ESLint**: `npm run lint` produces no errors
- [ ] **Types**: All function parameters and returns have explicit types
- [ ] **Naming**: Files, variables, functions follow conventions
- [ ] **Security**: No hardcoded secrets, input validated, auth checked
- [ ] **Errors**: Comprehensive error handling with try/catch
- [ ] **Comments**: Complex logic explained, JSDoc for public APIs
- [ ] **Performance**: No unnecessary renders, efficient queries
- [ ] **Accessibility**: Semantic HTML, ARIA labels where appropriate
- [ ] **Documentation**: Updated if adding new patterns or features

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Commit Messages
Use conventional commits:
```
feat: Add link analytics dashboard
fix: Correct authentication redirect loop
docs: Update React conventions
refactor: Extract URL validation to utils
```

## Running the Project

```bash
# Development server
npm run dev

# Production build
npm build
npm start

# Run linting
npm run lint

# Database migrations
npm run db:push
npm run db:generate
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

```
# Database
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Public URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Seeking Help

1. **Check the docs**: Consult the relevant guide first
2. **Search the codebase**: Look for similar patterns already implemented
3. **Read error messages**: TypeScript and ESLint errors are usually descriptive
4. **Check Next.js docs**: For Next.js 16 specific issues

## Project Roadmap

This project aims to build a fully-featured link shortener with:
- ✅ Core link creation and shortening
- ✅ User authentication with Clerk
- ✅ Link management dashboard
- 🔄 Advanced analytics (clicks, referrers, etc.)
- 🔄 Custom domain support
- 🔄 Link expiration and QR codes
- 🔄 Sharing and collaboration features

---

**Last Updated**: April 2026

**Questions?** Refer to the specific documentation file for your task, consult the codebase pattern, or check the Next.js 16 breaking changes notes.
