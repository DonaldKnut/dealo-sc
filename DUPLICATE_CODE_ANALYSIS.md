# Duplicate Code Analysis & Solutions

## Identified Duplicate Patterns

### 1. Data Fetching Pattern
**Found in:** 15+ components
- `FloatingMessageBubble.tsx`
- `ResumeManager.tsx`
- `ScratchCardHistory.tsx`
- `ScratchCardPurchase.tsx`
- `CommentSection.tsx`
- And more...

**Solution:** Use `useFetch` or `useApi` hooks

### 2. localStorage Synchronization
**Found in:** 5+ components
- `NotificationProvider.tsx`
- `useLocalStorage.tsx` (already exists but not used consistently)

**Solution:** Use `useLocalStorageSync` hook

### 3. Scroll Detection
**Found in:** 3+ components
- `Header.tsx`
- Similar patterns in other components

**Solution:** Use `useScrollThreshold` hook

### 4. Mounted State Check
**Found in:** 2+ components
- `Header.tsx`
- Theme-related components

**Solution:** Use `useMounted` hook

### 5. API Call Patterns
**Found in:** 20+ components
- Direct `fetch()` calls with similar error handling
- Similar loading/error state management

**Solution:** Use `api` client from `@/lib/api/client`

## Naming Inconsistencies

### Component Files
- ✅ `UserProfile.tsx` (correct)
- ❌ `userProfile.tsx` (should be PascalCase)
- ❌ `user-profile.tsx` (should be PascalCase)

### Props Interfaces
- ✅ `UserProfileProps` (correct)
- ❌ `Props` (should include component name)
- ❌ `UserProfileComponentProps` (unnecessary "Component" suffix)

### Hooks
- ✅ `useUserData` (correct)
- ❌ `getUserData` (should have "use" prefix)
- ❌ `UserDataHook` (should be camelCase)

## Mixed Concerns

### Components with Business Logic + UI
1. **FloatingMessageBubble.tsx**
   - API calls mixed with UI
   - Message formatting logic in component
   - **Solution:** Extract to `MessageService` and `useMessages` hook

2. **ResumeManager.tsx**
   - API calls mixed with UI
   - Resume operations in component
   - **Solution:** Extract to `ResumeService` and `useResumes` hook

3. **Header.tsx**
   - Navigation logic
   - Auth logic
   - Scroll handling
   - **Solution:** Extract to hooks and utilities

4. **ScratchCardPurchase.tsx**
   - Payment logic
   - API calls
   - **Solution:** Extract to service layer

## Refactoring Priority

### High Priority (Most Duplicated)
1. ✅ Data fetching pattern → `useFetch`/`useApi`
2. ✅ API client → `lib/api/client.ts`
3. ✅ localStorage sync → `useLocalStorageSync`
4. ✅ Scroll detection → `useScrollThreshold`

### Medium Priority (Naming)
1. ✅ Standardize component file names
2. ✅ Standardize props interfaces
3. ✅ Standardize hook names

### Low Priority (Separation)
1. ✅ Extract business logic to services
2. ✅ Create feature-specific hooks
3. ✅ Separate data fetching from UI

## Implementation Status

### ✅ Completed
- Created `useFetch` hook
- Created `useLocalStorageSync` hook
- Created `useMounted` hook
- Created `useScrollThreshold` hook (already existed)
- Created API client (`lib/api/client.ts`)
- Created `MessageService`
- Created `ResumeService`
- Created `useMessages` hook
- Created `useResumes` hook
- Created naming conventions guide

### 📋 Next Steps
1. Refactor components to use new hooks
2. Update imports to use API client
3. Rename files to match conventions
4. Extract remaining business logic

## Migration Examples

See `REFACTORING_GUIDE.md` for detailed examples.



