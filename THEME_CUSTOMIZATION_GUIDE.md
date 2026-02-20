# Theme Customization Guide

## Overview

All colors and themes are now centralized in `lib/theme/colors.ts`. Change colors in one place to update the entire application.

## Quick Start

### Change Skeleton Colors

Edit `lib/theme/colors.ts`:

```typescript
skeleton: {
  DEFAULT: "bg-gradient-to-r from-[#70f69ae1] to-[#5dd885]", // Green gradient - matches dashboard
  light: "bg-gradient-to-r from-[#70f69ae1]/80 to-[#5dd885]/80",
  dark: "bg-gradient-to-r from-[#10b981] to-[#059669]",
  shimmer: "bg-gradient-to-r from-[#70f69ae1]/60 to-[#5dd885]/60",
},
```

**Note:** Skeletons use gradient classes, not solid colors. To change the gradient, update the color values in the gradient classes.

### Change Primary Colors

```typescript
primary: {
  DEFAULT: "#3b82f6", // Main brand color
  light: "#60a5fa",
  dark: "#2563eb",
  // ...
},
```

### Change Background Colors

```typescript
background: {
  light: "#ffffff",
  DEFAULT: "#f8fafc",
  dark: "#0f172a",
  card: "#ffffff",
  muted: "#f1f5f9",
},
```

## Using Theme Colors

### In Components

```typescript
import { themeColors } from "@/lib/theme";

// Use in className
<div className={`bg-[${themeColors.primary.DEFAULT}]`}>
  {/* ... */}
</div>

// Or use Tailwind classes that match
<div className="bg-blue-500"> {/* Uses primary color */}
```

### In Skeleton Components

```typescript
import Skeleton from "@/components/ui/skeleton";

// Default skeleton (uses theme colors)
<Skeleton height="h-4" width="w-full" />

// Light variant
<Skeleton height="h-4" width="w-full" variant="light" />

// Dark variant
<Skeleton height="h-4" width="w-full" variant="dark" />
```

## Color System

### Current Theme (Blue/White)

- **Primary**: Blue (#3b82f6)
- **Background**: White/Slate-50
- **Skeleton**: Slate-200 (light gray, not dark gray)
- **Text**: Slate-900 (dark)

### To Change Entire Theme

1. **Update `lib/theme/colors.ts`**:
   ```typescript
   primary: {
     DEFAULT: "#your-color", // Change here
     // ...
   },
   ```

2. **Update Tailwind Config** (`tailwind.config.ts`):
   ```typescript
   colors: {
     primary: {
       DEFAULT: "#your-color",
       // ...
     },
   },
   ```

3. **All components will automatically use new colors**

## Files Using Theme

### Skeleton Components
- ✅ `components/ui/skeleton.tsx` - Uses theme colors
- ✅ `app/courses/loading.tsx` - Updated
- ✅ `app/marketplace/loading.tsx` - Updated
- ✅ `app/certifications/loading.tsx` - Updated
- ✅ `components/HomePageSkeleton.tsx` - Updated
- ✅ `app/jobs/page.tsx` - Updated

### Background Colors
All loading components now use:
- `bg-gradient-to-br from-blue-50 to-white` (light mode)
- `bg-white` for cards
- `border-slate-200` for borders

## Example: Change to Green Theme

1. Edit `lib/theme/colors.ts`:
   ```typescript
   primary: {
     DEFAULT: "#10b981", // Green-500
     light: "#34d399",
     dark: "#059669",
   },
   ```

2. Update skeleton:
   ```typescript
   skeleton: {
     DEFAULT: "#d1fae5", // Green-100
     // ...
   },
   ```

3. Update backgrounds:
   ```typescript
   background: {
     DEFAULT: "#f0fdf4", // Green-50
     // ...
   },
   ```

4. All components automatically update!

## Best Practices

1. **Always use theme colors** - Don't hardcode colors
2. **Use Tailwind classes** that match theme (e.g., `bg-blue-500` for primary)
3. **Test in both light and dark modes**
4. **Keep contrast ratios** for accessibility

## Files Modified

- ✅ `lib/theme/colors.ts` - Centralized theme
- ✅ `lib/theme/index.ts` - Theme exports
- ✅ `components/ui/skeleton.tsx` - Uses theme
- ✅ `app/courses/loading.tsx` - Updated colors
- ✅ `app/marketplace/loading.tsx` - Updated colors
- ✅ `app/certifications/loading.tsx` - Updated colors
- ✅ `components/HomePageSkeleton.tsx` - Updated colors
- ✅ `app/jobs/page.tsx` - Updated skeleton colors

## Next Steps

1. Test all loading states
2. Verify colors match your brand
3. Adjust theme colors as needed
4. Document any custom color usage

