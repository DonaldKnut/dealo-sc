# Content Customization Guide

All form text content can be easily customized in `formTheme.ts` under the `formContent` object.

## 📝 How to Change Content

### Header Content
```typescript
export const formContent = {
  header: {
    title: "Post a Job Listing", // Change form title
    description: {
      authenticated: "Fill in the details...", // For logged-in users
      unauthenticated: "Post your job for free...", // For guests
    },
  },
  // ... more content
};
```

### Section Titles
```typescript
sections: {
  location: {
    title: "Location", // Change section title
  },
  media: {
    title: "Job Media",
    subtitle: "(Optional)",
  },
  // ... more sections
}
```

### Button Text
```typescript
buttons: {
  cancel: "Cancel",
  submit: "Publish Job",
  submitting: "Publishing Job...",
}
```

### Success Message
```typescript
success: {
  title: "Check Your Email!",
  message: "We've sent a verification email...",
  backButton: "Back to Jobs",
}
```

## 🎨 How to Change Form Background

Edit `formTheme.ts`:

```typescript
formContainer: {
  background: "bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-800/95",
  // Change to any Tailwind class:
  // "bg-blue-500" - Solid blue
  // "bg-gradient-to-r from-purple-500 to-pink-500" - Gradient
  // "bg-white/10" - Glass effect
}
```

## ✨ Current Sleek Design Features

- **Dark glassmorphism** background with gradient overlay
- **Cyan/Blue/Purple** glow effects
- **White text** for maximum visibility
- **Subtle section cards** with accent colors
- **Modern gradient buttons** with hover effects

All text is now easily editable in one place!


