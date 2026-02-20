# Naming Conventions Guide

## Component Naming

### Files
- **PascalCase** for component files: `UserProfile.tsx`, `ProductCard.tsx`
- **Match component name**: File name should match the default export

### Components
- **PascalCase** for component names: `UserProfile`, `ProductCard`
- **Descriptive names**: Use full words, avoid abbreviations
- **No "Component" suffix**: `UserProfile` not `UserProfileComponent`

### Props Interfaces
- **ComponentNameProps**: `UserProfileProps`, `ProductCardProps`
- **Consistent naming**: Always use `Props` suffix

### Examples
```typescript
// ✅ CORRECT
// File: UserProfile.tsx
interface UserProfileProps {
  user: User;
  onEdit?: () => void;
}

export default function UserProfile({ user, onEdit }: UserProfileProps) {
  // ...
}

// ❌ WRONG
// File: userProfile.tsx or user-profile.tsx
interface Props {
  user: User;
}
export default function UserProfileComponent(props: Props) {
  // ...
}
```

## Hook Naming

### Files
- **camelCase** with "use" prefix: `useUserData.ts`, `useApi.ts`

### Hooks
- **camelCase** with "use" prefix: `useUserData`, `useApi`
- **Descriptive**: `useFetch` not `useGet`

### Examples
```typescript
// ✅ CORRECT
// File: useUserData.ts
export function useUserData(userId: string) {
  // ...
}

// ❌ WRONG
// File: UseUserData.ts or userData.ts
export function getUserData(userId: string) {
  // ...
}
```

## Utility Function Naming

### Files
- **camelCase**: `formatDate.ts`, `apiClient.ts`
- **Descriptive**: `formatDate` not `dateUtils`

### Functions
- **camelCase**: `formatDate`, `parseString`, `validateEmail`
- **Verb-based**: Start with action verb
- **Descriptive**: Clear what the function does

### Examples
```typescript
// ✅ CORRECT
export function formatDate(date: Date): string {
  // ...
}

export function parseUserInput(input: string): UserData {
  // ...
}

// ❌ WRONG
export function date(date: Date): string {
  // ...
}

export function parse(input: string): UserData {
  // ...
}
```

## Type/Interface Naming

### Types
- **PascalCase**: `User`, `Product`, `ApiResponse`
- **Descriptive**: `UserData` not `UserType`

### Interfaces
- **PascalCase**: `UserProfile`, `ProductCard`
- **Props interfaces**: `ComponentNameProps`
- **No "I" prefix**: `UserProfile` not `IUserProfile`

### Enums
- **PascalCase**: `UserRole`, `OrderStatus`
- **Values**: UPPER_SNAKE_CASE: `ADMIN`, `PENDING`

### Examples
```typescript
// ✅ CORRECT
interface UserProfile {
  id: string;
  name: string;
}

type UserRole = "ADMIN" | "USER" | "GUEST";

enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

// ❌ WRONG
interface IUserProfile {
  id: string;
}

type userRole = "admin" | "user";
```

## Variable Naming

### Constants
- **UPPER_SNAKE_CASE**: `API_BASE_URL`, `MAX_FILE_SIZE`
- **Descriptive**: `MAX_UPLOAD_SIZE` not `MAX`

### Variables
- **camelCase**: `userName`, `productList`, `isLoading`
- **Boolean prefix**: `is`, `has`, `should` - `isLoading`, `hasError`
- **Descriptive**: `userData` not `data`, `productList` not `list`

### Examples
```typescript
// ✅ CORRECT
const API_BASE_URL = "https://api.example.com";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

let userName = "John";
let isLoading = false;
let hasError = false;

// ❌ WRONG
const apiBaseUrl = "https://api.example.com";
let user_name = "John";
let loading = false;
```

## Function Naming

### Event Handlers
- **handle** prefix: `handleClick`, `handleSubmit`, `handleChange`
- **on** prefix for props: `onClick`, `onSubmit`, `onChange`

### API Functions
- **Verb-based**: `fetchUser`, `createOrder`, `updateProfile`, `deleteItem`
- **Service methods**: `UserService.fetch()`, `OrderService.create()`

### Examples
```typescript
// ✅ CORRECT
const handleClick = () => {
  // ...
};

const fetchUser = async (id: string) => {
  // ...
};

// ❌ WRONG
const click = () => {
  // ...
};

const getUser = async (id: string) => {
  // ...
};
```

## Directory Naming

### Feature Directories
- **kebab-case**: `user-profile/`, `product-card/`
- **singular**: `user/` not `users/`

### Shared Directories
- **lowercase**: `shared/`, `utils/`, `hooks/`

## Summary

| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase | `UserProfile.tsx` |
| Component names | PascalCase | `UserProfile` |
| Props interfaces | ComponentNameProps | `UserProfileProps` |
| Hook files | camelCase (use*) | `useUserData.ts` |
| Hook names | camelCase (use*) | `useUserData` |
| Utility files | camelCase | `formatDate.ts` |
| Utility functions | camelCase | `formatDate` |
| Types/Interfaces | PascalCase | `User`, `UserProfile` |
| Enums | PascalCase | `UserRole` |
| Enum values | UPPER_SNAKE_CASE | `ADMIN`, `PENDING` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Variables | camelCase | `userName`, `isLoading` |
| Event handlers | handle* | `handleClick` |
| API functions | Verb-based | `fetchUser`, `createOrder` |
| Directories | kebab-case | `user-profile/` |



