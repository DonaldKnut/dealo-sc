# Component Structure Standards

## Standard Component Structure

All components should follow this structure:

```typescript
"use client"; // Only if using hooks/interactivity

import React from "react";
// ... other imports

// Types/Interfaces
interface ComponentProps {
  // Props definition
}

// Component
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  // 2. State
  // 3. Effects
  // 4. Handlers
  // 5. Render helpers
  // 6. Return JSX

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// Named exports for sub-components if needed
export { SubComponent };
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useUserData.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONSTANTS.ts`)

## Directory Structure

```
components/
  feature-name/          # Feature-based organization
    index.ts            # Barrel export
    ComponentName.tsx   # Main component
    SubComponent.tsx   # Sub-components
    types.ts           # Feature-specific types
    hooks.ts           # Feature-specific hooks
    utils.ts           # Feature-specific utilities
  shared/              # Shared across features
    index.ts
    Button.tsx
    Input.tsx
  ui/                  # Base UI components
    index.ts
    button.tsx
    input.tsx
```

## Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Default Props**: Use default parameters or defaultProps
4. **Memoization**: Use React.memo for expensive components
5. **Error Boundaries**: Wrap risky components in error boundaries
6. **Accessibility**: Include ARIA labels and semantic HTML
7. **Documentation**: Add JSDoc comments for complex components

## Example

```typescript
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
  onUserClick?: (userId: string) => void;
}

/**
 * UserCard component displays user information
 * @param user - User object with id, name, and optional avatar
 * @param className - Additional CSS classes
 * @param onUserClick - Callback when user card is clicked
 */
export default function UserCard({
  user,
  className,
  onUserClick,
}: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onUserClick?.(user.id);
  };

  return (
    <div
      className={cn("user-card", className)}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`View ${user.name}'s profile`}
    >
      {/* Component content */}
    </div>
  );
}
```



