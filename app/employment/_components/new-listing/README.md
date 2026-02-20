# New Listing Form Components

This directory contains modular components for the job posting form, making it super easy to customize styling.

## 🎨 Changing the Form Background

To change the form background, simply edit `formTheme.ts`:

### Quick Change (Single Property)

```typescript
// In formTheme.ts, modify the background property:
formContainer: {
  background: "bg-blue-500", // Change this to any Tailwind class
  // ... other properties
}
```

### Using Preset Themes

In `page.tsx`, you can switch between preset themes:

```typescript
// Instead of:
import { formTheme } from "@/app/employment/_components/new-listing/formTheme";

// Use:
import { formThemes } from "@/app/employment/_components/new-listing/formTheme";
const theme = formThemes.dark; // or formThemes.light, formThemes.glass
```

Available presets:
- `formThemes.default` - Default white/glassmorphism theme
- `formThemes.light` - Pure white background
- `formThemes.dark` - Dark theme
- `formThemes.glass` - Glass morphism effect

### Custom Theme

Create your own theme in `formTheme.ts`:

```typescript
export const customTheme = {
  ...formTheme,
  formContainer: {
    ...formTheme.formContainer,
    background: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  glowEffect: {
    ...formTheme.glowEffect,
    gradient: "bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30",
  },
};
```

Then use it in `page.tsx`:
```typescript
import { customTheme } from "@/app/employment/_components/new-listing/formTheme";
// ... use customTheme instead of formTheme
```

## 📁 Component Structure

- **`formTheme.ts`** - Central theme configuration (edit this to change styling)
- **`FormWrapper.tsx`** - Wraps the form with background and glow effects
- **`FormHeader.tsx`** - Form title and description
- **`JobFormFields.tsx`** - All form input fields
- **`FormActions.tsx`** - Submit and cancel buttons
- **`EmailSentSuccess.tsx`** - Success message after email verification
- **`HeroSection.tsx`** - Hero section above the form

## 🎯 Customization Examples

### Change Form Background Color
```typescript
// formTheme.ts
formContainer: {
  background: "bg-blue-100", // Light blue
}
```

### Change Glow Effect
```typescript
// formTheme.ts
glowEffect: {
  gradient: "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20",
}
```

### Disable Glow Effect
```typescript
// formTheme.ts
glowEffect: {
  enabled: false,
}
```

### Change Section Card Colors
```typescript
// formTheme.ts
sectionVariants: {
  green: "to-green-100", // Lighter green
  blue: "to-blue-100",
  // ... etc
}
```

## 🔧 Component Props

All components accept an optional `theme` prop, so you can override the theme per component if needed:

```typescript
<FormWrapper methods={methods} theme={customTheme} />
```

## ✨ Benefits

1. **Easy Styling** - Change form background in one place (`formTheme.ts`)
2. **Modular** - Each component is self-contained and reusable
3. **Type-Safe** - TypeScript ensures theme consistency
4. **Maintainable** - Clear separation of concerns
5. **Flexible** - Override theme per component if needed


