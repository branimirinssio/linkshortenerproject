# Shadcn/UI Conventions

## Overview

This project uses **shadcn/ui 4.2.0** exclusively for all UI components. Shadcn/ui provides high-quality, accessible React components built on Radix UI primitives and styled with Tailwind CSS.

**Core Rule**: DO NOT create custom components. ALWAYS use shadcn/ui components.

## Why Shadcn/UI

- ✅ Pre-built, production-ready components
- ✅ Fully accessible (WCAG 2.1 compliant)
- ✅ Customizable via Tailwind CSS
- ✅ Copy-paste component approach (no npm package lock-in)
- ✅ Built on proven primitives (Radix UI)
- ✅ TypeScript-first design
- ✅ Consistent theming and styling

## Available Components

All shadcn/ui components are stored in `components/ui/`:

```
components/ui/
  button.tsx
  input.tsx
  card.tsx
  dialog.tsx
  dropdown-menu.tsx
  sheet.tsx
  form.tsx
  ... [other components as added]
```

## Component Installation

To add a new shadcn/ui component:

```bash
npx shadcn-ui@latest add {component-name}
```

This copies the component code into `components/ui/{component-name}.tsx`. Never modify the installation process or component code location.

## Using Shadcn/UI Components

### Import Components

Always import from `@/components/ui`:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

### Basic Usage

```typescript
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

### With Variants

Shadcn components support variant props for different styles:

```typescript
import { Button } from '@/components/ui/button';

export function ButtonVariants() {
  return (
    <div>
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

### With Size Props

```typescript
import { Button } from '@/components/ui/button';

export function ButtonSizes() {
  return (
    <div>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
```

## Common Shadcn/UI Components

### Button
```typescript
import { Button } from '@/components/ui/button';

<Button onClick={handleClick}>Action</Button>
```

### Input
```typescript
import { Input } from '@/components/ui/input';

<Input placeholder="Enter text" type="email" />
```

### Card
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content here</CardContent>
</Card>
```

### Dialog
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Form
Use shadcn's form component with React Hook Form:

```typescript
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MyForm() {
  const form = useForm();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Sheet (Sidebar/Drawer)
```typescript
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

### Dropdown Menu
```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Option 1</DropdownMenuItem>
    <DropdownMenuItem>Option 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Styling with Tailwind

Shadcn components are styled with Tailwind CSS. You can extend styling using the `className` prop with the `cn()` utility:

```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function StyledButton() {
  return (
    <Button className={cn(
      'rounded-full',
      'bg-gradient-to-r from-blue-500 to-purple-600'
    )}>
      Styled Button
    </Button>
  );
}
```

### Using cn() Utility

The `cn()` function (from `@/lib/utils.ts`) merges Tailwind classes intelligently:

```typescript
import { cn } from '@/lib/utils';

className={cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50'
)}
```

## Composition Pattern

Build complex UIs by composing multiple shadcn components:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UserCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Name" />
        <Button className="mt-4">Save</Button>
      </CardContent>
    </Card>
  );
}
```

## DOM Components (Wrapper Components)

For domain-specific UI that composes multiple shadcn components, create wrapper components in `components/{domain}/`:

```
components/
  ui/               # Raw shadcn components (untouched)
  links/            # Domain-specific compositions
    link-card.tsx
    link-list.tsx
  auth/
    sign-in-form.tsx
    sign-up-form.tsx
```

These wrapper components use shadcn as building blocks:

```typescript
// components/links/link-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LinkCardProps {
  title: string;
  url: string;
  onDelete: () => void;
}

export function LinkCard({ title, url, onDelete }: LinkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{url}</p>
        <Button variant="destructive" onClick={onDelete} className="mt-4">
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Type Safety with Props

All shadcn components are fully typed. Always use TypeScript for component props:

```typescript
import { Button, type ButtonProps } from '@/components/ui/button';

interface MyButtonProps extends ButtonProps {
  label: string;
}

export function MyButton({ label, ...props }: MyButtonProps) {
  return <Button {...props}>{label}</Button>;
}
```

## Accessibility

Shadcn components are built on accessible primitives. Always:

- ✅ Use semantic HTML elements
- ✅ Provide labels for form inputs
- ✅ Include alt text for images
- ✅ Use ARIA attributes when needed
- ✅ Ensure keyboard navigation works
- ✅ Test with screen readers

Example with proper a11y:

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EmailInput() {
  return (
    <div>
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        aria-describedby="email-hint"
      />
      <p id="email-hint" className="text-xs text-gray-500">
        We'll never share your email
      </p>
    </div>
  );
}
```

## Component Selection Guide

| Use Case | Component | Notes |
|----------|-----------|-------|
| Form input | `Input` | For text, email, password, etc. |
| Button action | `Button` | With variant prop for styling |
| Display large content | `Card` | Use CardHeader, CardContent, CardFooter |
| Modal dialog | `Dialog` | For critical actions or confirmations |
| Confirmation | `AlertDialog` | Built on Dialog for destructive actions |
| Dropdown menu | `DropdownMenu` | For action menus |
| Sidebar/drawer | `Sheet` | Mobile-friendly alternative to sidebar |
| Form with validation | `Form` + `FormField` | Integrates with React Hook Form |
| Data table | `DataTable` | Use Shadcn's table component |
| Switch/checkbox | `Checkbox`, `Switch` | For boolean inputs |
| Select dropdown | `Select` | Accessible select component |
| Tabs | `Tabs` | For grouped content |
| Tooltip | `Tooltip` | For contextual help |
| Toast notification | `Sonner` | Lightweight toast notifications |

## Do NOT

- ❌ Create custom components when a shadcn component exists
- ❌ Modify shadcn component code in `components/ui/`
- ❌ Use unstyled HTML elements when shadcn components are available
- ❌ Copy component code into multiple locations
- ❌ Import from component libraries other than shadcn/ui
- ❌ Hardcode Tailwind classes when composition is possible

## Common Patterns

### Loading State
```typescript
import { Button } from '@/components/ui/button';

<Button disabled>{isLoading && <Spinner />} Loading...</Button>
```

### Empty State
```typescript
import { Card, CardContent } from '@/components/ui/card';

<Card>
  <CardContent className="flex flex-col items-center justify-center py-8">
    <p className="text-gray-500">No items found</p>
  </CardContent>
</Card>
```

### Error Message
```typescript
import { AlertCircle } from 'lucide-react';

<div className="flex gap-2 p-4 border border-red-200 bg-red-50 rounded">
  <AlertCircle className="h-5 w-5 text-red-600" />
  <p className="text-red-600">Error message here</p>
</div>
```

## Adding New Components

When you need a component not yet in the project:

1. Find the component in [shadcn/ui docs](https://ui.shadcn.com)
2. Run: `npx shadcn-ui@latest add {component-name}`
3. Import from `@/components/ui/{component-name}`
4. Use immediately without modification

## Related Documentation

- [Component Patterns](component-patterns.md) - How to build with components
- [React & Next.js Conventions](react-conventions.md) - Component structure and hooks
- [Coding Standards](coding-standards.md) - Code quality and best practices
