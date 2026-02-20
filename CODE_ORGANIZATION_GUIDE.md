# Code Organization Guide

## Overview

This guide outlines the code organization structure and standards for the platform.

## Directory Structure

```
├── app/                    # Next.js app router pages
│   ├── (auth)/           # Auth feature group
│   ├── (dealoapi)/       # API routes feature group
│   ├── dealoforge/       # DealoForge feature
│   ├── marketplace/      # Marketplace feature
│   └── ...
├── components/           # React components
│   ├── shared/          # Shared components
│   ├── ui/              # Base UI components (shadcn)
│   ├── forms/           # Form components
│   ├── dashboard/       # Dashboard components
│   └── [feature]/       # Feature-specific components
├── hooks/                # React hooks
│   └── index.ts         # Barrel export
├── lib/                  # Utility libraries
│   ├── db/              # Database utilities
│   ├── middleware/      # API middleware
│   ├── validation/      # Validation utilities
│   ├── utils/           # Common utilities
│   └── index.ts         # Barrel export
├── models/               # Database models
│   └── index.ts         # Barrel export
├── types/                # TypeScript types
├── constants/            # Constants
└── service/              # Service layer
```

## 1. Common Utilities

### Location: `lib/utils/`

All common utilities are consolidated in `lib/utils.ts` and organized by category:

- **Formatting**: `formatDateTime`, `formatAmount`, `formatPrice`
- **String**: `removeSpecialCharacters`, `truncate`, `capitalize`
- **URL**: `formUrlQuery`, `extractCustomerIdFromUrl`
- **Security**: `encryptId`, `decryptId`
- **Data**: `parseStringify`, `deepMerge`, `groupBy`
- **Async**: `retry`, `sleep`
- **Validation**: `isEmpty`, `safeJsonParse`

### Usage

```typescript
import { cn, formatDateTime, formatAmount } from "@/lib";
// or
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
```

## 2. Shared Hooks

### Location: `hooks/`

All hooks are exported from `hooks/index.ts`:

**Auth Hooks:**
- `useSafeSession` - Safe session access
- `useCurrentUser` - Current user data
- `useCurrentRole` - Current user role

**Storage Hooks:**
- `useLocalStorage` - LocalStorage management

**Feature Hooks:**
- `useConversation` - Conversation management
- `usePayment` - Payment processing
- `useR2Upload` - File uploads
- `useRoutes` - Route management

**UI Hooks:**
- `useColorMode` - Theme management
- `useApi` - Generic API calls
- `useDebounce` - Debounce values
- `useToggle` - Boolean toggle
- `useClickOutside` - Click outside detection
- `useScroll` - Scroll position tracking
- `useScrollThreshold` - Scroll threshold detection

### Usage

```typescript
import { useSafeSession, useR2Upload, useDebounce } from "@/hooks";
```

## 3. Component Structure Standards

### Standard Component Template

```typescript
"use client"; // Only if needed

import React from "react";
import { cn } from "@/lib";

interface ComponentProps {
  // Props
}

export default function ComponentName(props: ComponentProps) {
  // Implementation
}
```

### Component Organization

1. **Feature-based**: Group components by feature
2. **Shared components**: Common UI elements in `components/shared/`
3. **UI components**: Base components in `components/ui/`
4. **Barrel exports**: Each feature folder has `index.ts`

### Example Structure

```
components/
  marketplace/
    index.ts              # Export all marketplace components
    ProductCard.tsx
    ProductList.tsx
    hooks.ts              # Feature-specific hooks
    types.ts              # Feature-specific types
```

## 4. Barrel Exports

### Created Barrel Exports

1. **`hooks/index.ts`** - All hooks
2. **`components/index.ts`** - Shared/common components
3. **`components/shared/index.ts`** - Shared components
4. **`components/forms/index.ts`** - Form components
5. **`components/ui/index.ts`** - UI components
6. **`components/dashboard/index.ts`** - Dashboard components
7. **`lib/index.ts`** - All library utilities
8. **`models/index.ts`** - All models (if exists)

### Usage

```typescript
// Before
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSafeSession } from "@/hooks/use-safe-session";

// After
import { Button, Input } from "@/components/ui";
import { useSafeSession } from "@/hooks";
```

## 5. Feature-Based Organization

### Current Features

1. **Authentication** (`app/(auth)/`)
2. **DealoForge** (`app/dealoforge/`)
3. **Marketplace** (`app/marketplace/`)
4. **Employment** (`app/employment/`)
5. **Dashboard** (`app/dashboard/`, `components/dashboard/`)
6. **Video Chat** (`app/video-chat/`)
7. **Messaging** (`app/messenger/`)

### Feature Structure

Each feature should have:
- Components in `components/[feature]/`
- Pages in `app/[feature]/`
- API routes in `app/api/[feature]/`
- Types in `types/[feature].ts` (if needed)
- Hooks in `hooks/use[Feature].ts`

### Example: Marketplace Feature

```
app/
  marketplace/
    page.tsx
    [id]/
      page.tsx
components/
  marketplace/
    index.ts
    ProductCard.tsx
    ProductList.tsx
    ProductFilters.tsx
app/api/
  marketplace/
    products/
      route.ts
    payment/
      route.ts
hooks/
  useMarketplace.ts
types/
  marketplace.ts
```

## Migration Checklist

### For Components

- [ ] Move to feature-based directory
- [ ] Add to feature's `index.ts` barrel export
- [ ] Update imports to use barrel exports
- [ ] Follow component structure standards
- [ ] Add TypeScript interfaces for props

### For Utilities

- [ ] Consolidate duplicate utilities
- [ ] Move to `lib/utils/` or appropriate category
- [ ] Export from `lib/index.ts`
- [ ] Update all imports

### For Hooks

- [ ] Move to `hooks/` directory
- [ ] Export from `hooks/index.ts`
- [ ] Follow hook naming convention (`use*`)
- [ ] Add TypeScript types

## Benefits

1. **Consistency**: Standardized structure across codebase
2. **Discoverability**: Easy to find components/utilities
3. **Maintainability**: Clear organization reduces complexity
4. **Reusability**: Barrel exports make sharing easier
5. **Scalability**: Feature-based structure scales well

## Next Steps

1. Gradually migrate components to feature-based structure
2. Update imports to use barrel exports
3. Consolidate duplicate utilities
4. Create feature-specific hooks where needed
5. Document feature boundaries

## Resources

- `components/ComponentStandards.md` - Component structure guide
- `hooks/index.ts` - All available hooks
- `lib/index.ts` - All available utilities
- `components/index.ts` - All available components



