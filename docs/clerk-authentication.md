# Clerk Authentication Conventions

## Overview

This project uses **Clerk 7.0.11** as the exclusive authentication solution. No alternative authentication methods should be implemented. Clerk handles user sign-in, sign-up, session management, and user identity.

**Important**: Clerk is the ONLY auth method for this project. Do not implement custom auth, OAuth from other providers, or JWT solutions.

## Environment Setup

Required environment variables in `.env.local`:

```env
# Clerk public key (exposed to client)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...

# Clerk secret key (server-side only)
CLERK_SECRET_KEY=sk_...

# Webhook secret for Webhook events
CLERK_WEBHOOK_SECRET=whsec_...

# Optional: Custom domain
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Never commit `.env.local` to version control. Use `.env.example` to document required variables.

## Authentication in Server Components & Route Handlers

### Getting User Identity

Import `auth()` from `@clerk/nextjs/server` to retrieve the current user session:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId, sessionId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // userId is safe to use here
  return NextResponse.json({ message: 'Success' });
}
```

### Protected Pages (Server Components)

Create protected pages in layout groups like `app/(dashboard)/{feature}/page.tsx`:

```typescript
import { auth, redirectToSignIn } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirectToSignIn();
  }
  
  // Render protected content
  return <div>Protected Dashboard</div>;
}
```

For post-login redirects, use `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` environment variable set to `/dashboard`.

## Protected Routes Pattern

### Dashboard Layout

The `/dashboard` route and all its child routes require authentication:

```
app/
  (dashboard)/
    layout.tsx          # Checks auth, applies dashboard styling
    page.tsx            # Redirects to default dashboard section
    links/
      page.tsx          # Protected: shows user's links
    settings/
      page.tsx          # Protected: user settings
```

**Rule**: Any page under `(dashboard)` must verify authentication and redirect unauthenticated users to sign-in.

```typescript
// app/(dashboard)/layout.tsx
import { auth, redirectToSignIn } from '@clerk/nextjs/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirectToSignIn();
  }
  
  return (
    <div className="dashboard-layout">
      {/* Navigation, sidebar, etc. */}
      {children}
    </div>
  );
}
```

## Home Page Redirect for Logged-In Users

If a logged-in user navigates to the home page (`/`), redirect them to `/dashboard`:

```typescript
// app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();
  
  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }
  
  // Render login/signup landing page
  return (
    <div>
      {/* Welcome, features, sign-up CTA, etc. */}
    </div>
  );
}
```

## Clerk UI Components (Modal Mode)

All sign-in and sign-up flows must use modal components to avoid page navigation. Place the modal components in your layout or use Clerk's provided components:

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { SignInModal, SignUpModal } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {children}
      {/* Modals always available */}
    </ClerkProvider>
  );
}
```

### Sign-In Button (Client Component)

```typescript
'use client';

import { SignInButton } from '@clerk/nextjs';

export function AuthButton() {
  return (
    <SignInButton mode="modal">
      <button>Sign In</button>
    </SignInButton>
  );
}
```

### Sign-Up Button (Client Component)

```typescript
'use client';

import { SignUpButton } from '@clerk/nextjs';

export function SignUpCTA() {
  return (
    <SignUpButton mode="modal">
      <button>Get Started</button>
    </SignUpButton>
  );
}
```

### User Menu (Client Component)

```typescript
'use client';

import { UserButton } from '@clerk/nextjs';

export function UserMenu() {
  return <UserButton afterSignOutUrl="/" />;
}
```

## Authentication in Client Components

For Client Components that need to access user data, use the `useAuth()` hook:

```typescript
'use client';

import { useAuth } from '@clerk/nextjs';

export function ClientComponent() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;
  
  return <div>User ID: {userId}</div>;
}
```

## API Route Protection

All API routes that operate on user-specific data must check authentication:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Fetch user's links
  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));
  
  return NextResponse.json(userLinks);
}
```

## Storing User ID in Database

When creating records associated with a user, always store their `userId` from Clerk:

```typescript
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { originalUrl } = await request.json();
  
  const newLink = await db.insert(links).values({
    userId,
    originalUrl,
  });
  
  return NextResponse.json(newLink);
}
```

Schema example:

```typescript
export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Clerk's userId
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Webhook Integration (Optional)

Clerk webhooks can sync user events to your database:

```typescript
import { Webhook } from 'svix';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const headers = request.headers;
  
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  
  try {
    const event = wh.verify(payload, headers as any);
    
    if (event.type === 'user.created') {
      // Handle new user
    }
    if (event.type === 'user.updated') {
      // Handle user update
    }
    if (event.type === 'user.deleted') {
      // Handle user deletion
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

## Security Best Practices

- ✅ Always check `userId` before accessing user data
- ✅ Filter database queries by `userId` to prevent data leaks
- ✅ Use `redirectToSignIn()` for unauthenticated access to protected pages
- ✅ Validate request bodies with Zod before processing
- ✅ Keep `CLERK_SECRET_KEY` server-side only
- ✅ Only expose `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to client

- ❌ Never expose user IDs without verification
- ❌ Don't trust client-side user claims without server verification
- ❌ Don't skip `userId` checks in API routes
- ❌ Don't hardcode redirect URLs; use environment variables

## Common Patterns

### Check if user is authenticated

```typescript
const { userId } = await auth();
const isAuthenticated = !!userId;
```

### Get current user session

```typescript
const session = await auth();
// Contains: userId, sessionId, orgId, orgRole, orgPermissions, ...
```

### Redirect to sign-in (Server Component)

```typescript
import { redirectToSignIn } from '@clerk/nextjs/server';

if (!userId) {
  redirectToSignIn();
}
```

### Require specific user in route

```typescript
const { userId } = await auth();
const requestedUserId = params.userId; // from URL

if (userId !== requestedUserId) {
  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  );
}
```

## Environment Variables Checklist

Before deployment, ensure these are configured:

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Set in Clerk Dashboard
- [ ] `CLERK_SECRET_KEY` - Set in Clerk Dashboard
- [ ] `CLERK_WEBHOOK_SECRET` - Set if using webhooks
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard` - Post-login redirect
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard` - Post-signup redirect
- [ ] Never commit secrets to `.env.local`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `auth()` returns `null` | Ensure code runs on server (not Client Component); check `CLERK_SECRET_KEY` is set |
| Sign-in/sign-up redirect to home | Set `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard` env var |
| User data not accessible in component | Use Server Component with `auth()`, or use `useAuth()` hook in Client Component |
| CSRF token errors | Ensure ClerkProvider wraps your app in `app/layout.tsx` |

## Related Documentation

- [API & Routes Conventions](api-conventions.md) - Authentication checks in route handlers
- [React & Next.js Conventions](react-conventions.md) - Using Clerk in components
- [Coding Standards](coding-standards.md) - Security practices
