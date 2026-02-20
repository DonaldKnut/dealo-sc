# Universal Loader Component

A modular, reusable loader spinner component that can be used throughout the app.

## Features

- ✅ Multiple sizes (xs, sm, md, lg, xl)
- ✅ Multiple color variants (white, green, gray, cyan, blue)
- ✅ Inline loader for buttons
- ✅ Full-screen page loader
- ✅ Centered loader with optional text
- ✅ Fully accessible (ARIA labels)
- ✅ TypeScript support

## Usage

### Basic Loader

```tsx
import Loader from "@/components/ui/Loader";

<Loader />
```

### Button Loader (for buttons)

```tsx
import { ButtonLoader } from "@/components/ui/Loader";

<button disabled={isLoading}>
  {isLoading ? (
    <ButtonLoader text="Loading..." />
  ) : (
    "Submit"
  )}
</button>
```

### Page Loader (full screen)

```tsx
import { PageLoader } from "@/components/ui/Loader";

if (loading) {
  return <PageLoader text="Loading jobs..." />;
}
```

### Custom Size and Color

```tsx
<Loader size="lg" color="green" text="Processing..." />
```

### Inline Loader

```tsx
<Loader inline size="sm" color="white" text="Saving..." />
```

### Full Screen Overlay

```tsx
<Loader fullScreen size="xl" color="green" text="Please wait..." />
```

## Props

### Loader Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of the spinner |
| `color` | `"white" \| "green" \| "gray" \| "cyan" \| "blue"` | `"white"` | Color variant |
| `className` | `string` | - | Additional CSS classes |
| `text` | `string` | - | Optional text below spinner |
| `fullScreen` | `boolean` | `false` | Full screen overlay |
| `inline` | `boolean` | `false` | Inline display (for buttons) |

### ButtonLoader Component

Optimized for use inside buttons. Accepts `size`, `color`, and `text` props.

### PageLoader Component

Full page loader with background. Accepts `text`, `size`, and `color` props.

## Examples

### In Form Submit Button

```tsx
import { ButtonLoader } from "@/components/ui/Loader";

<button type="submit" disabled={isLoading}>
  {isLoading ? (
    <ButtonLoader text="Submitting..." />
  ) : (
    "Submit"
  )}
</button>
```

### In Loading State

```tsx
import { PageLoader } from "@/components/ui/Loader";

if (loading) {
  return <PageLoader text="Loading data..." />;
}
```

### Custom Styled Loader

```tsx
<Loader 
  size="lg" 
  color="green" 
  className="my-8"
  text="Processing your request..."
/>
```

## Migration Guide

### Replacing ClipLoader

**Before:**
```tsx
import { ClipLoader } from "react-spinners";

<ClipLoader size={50} color="#38a169" />
```

**After:**
```tsx
import { PageLoader } from "@/components/ui/Loader";

<PageLoader text="Loading..." />
```

### Replacing Inline Spinners

**Before:**
```tsx
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
```

**After:**
```tsx
import { ButtonLoader } from "@/components/ui/Loader";

<ButtonLoader />
```

## Where It's Used

- ✅ Jobs listing page (`/app/employment/dealojobs/page.tsx`)
- ✅ Job posting form (`/app/employment/_components/new-listing/FormActions.tsx`)
- ✅ Quick onboarding form (`/app/complete-profile/_components/QuickOnboardingForm.tsx`)

## Accessibility

- Includes `role="status"` and `aria-label="Loading"`
- Screen reader text with `sr-only` class
- Semantic HTML structure


