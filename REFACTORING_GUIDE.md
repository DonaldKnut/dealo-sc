# Refactoring Guide: Eliminating Duplicate Code & Mixed Concerns

## Overview

This guide shows how to refactor components to eliminate duplicate code, standardize naming, and separate concerns.

## 1. Eliminating Duplicate Code Patterns

### Pattern: Fetching Data with Loading/Error States

**Before (Duplicate Pattern):**
```typescript
const Component = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data");
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
};
```

**After (Using useFetch Hook):**
```typescript
import { useFetch } from "@/hooks";

const Component = () => {
  const { data, loading, error, refetch } = useFetch("/api/data");
  
  // data is automatically fetched and managed
};
```

**After (Using useApi Hook):**
```typescript
import { useApi } from "@/hooks";
import { api } from "@/lib";

const Component = () => {
  const { data, loading, error, execute } = useApi(
    () => api.get("/api/data"),
    {
      onSuccess: (data) => console.log("Success:", data),
      onError: (error) => console.error("Error:", error),
    }
  );

  useEffect(() => {
    execute();
  }, [execute]);
};
```

### Pattern: localStorage Synchronization

**Before (Duplicate Pattern):**
```typescript
const Component = () => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem("key");
      return item ? JSON.parse(item) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem("key", JSON.stringify(value));
  }, [value]);
};
```

**After (Using useLocalStorageSync Hook):**
```typescript
import { useLocalStorageSync } from "@/hooks";

const Component = () => {
  const [value, setValue] = useLocalStorageSync("key", initialValue);
  
  // Automatically syncs with localStorage
};
```

### Pattern: Scroll Detection

**Before (Duplicate Pattern):**
```typescript
const Component = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};
```

**After (Using useScrollThreshold Hook):**
```typescript
import { useScrollThreshold } from "@/hooks";

const Component = () => {
  const isScrolled = useScrollThreshold(20);
  
  // Automatically detects scroll
};
```

### Pattern: Mounted State

**Before (Duplicate Pattern):**
```typescript
const Component = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
};
```

**After (Using useMounted Hook):**
```typescript
import { useMounted } from "@/hooks";

const Component = () => {
  const mounted = useMounted();
  
  if (!mounted) return null;
};
```

## 2. Separating Business Logic from UI

### Example: FloatingMessageBubble Component

**Before (Mixed Concerns):**
```typescript
const FloatingMessageBubble = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    // ... handle response
  };

  // ... UI rendering
};
```

**After (Separated Concerns):**

**Service Layer (`service/messageService.ts`):**
```typescript
import { api } from "@/lib/api/client";

export class MessageService {
  static async fetchMessages(): Promise<Message[]> {
    const response = await api.get<{ messages: Message[] }>("/api/messages");
    return response.messages || [];
  }

  static async sendMessage(content: string, recipientId: string): Promise<Message> {
    return api.post<Message>("/api/messages", { content, recipientId });
  }
}
```

**Hook (`hooks/useMessages.ts`):**
```typescript
import { MessageService } from "@/service/messageService";
import { useApi } from "./useApi";

export function useMessages() {
  const { data: messages, loading, error, execute } = useApi(
    () => MessageService.fetchMessages()
  );

  const sendMessage = async (content: string, recipientId: string) => {
    const newMessage = await MessageService.sendMessage(content, recipientId);
    // Update local state
  };

  return { messages, loading, error, sendMessage, refetch: execute };
}
```

**Component (UI Only):**
```typescript
import { useMessages } from "@/hooks";

const FloatingMessageBubble = () => {
  const { messages, loading, sendMessage } = useMessages();
  
  // Pure UI rendering, no business logic
  return (
    // ... JSX
  );
};
```

## 3. Standardizing Naming Conventions

### Component Naming

**Before (Inconsistent):**
```typescript
// File: userProfile.tsx
interface Props {
  user: User;
}
export default function UserProfileComponent(props: Props) {
  // ...
}

// File: ProductCard.tsx
interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  // ...
}
```

**After (Standardized):**
```typescript
// File: UserProfile.tsx
interface UserProfileProps {
  user: User;
}
export default function UserProfile({ user }: UserProfileProps) {
  // ...
}

// File: ProductCard.tsx
interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  // ...
}
```

### Hook Naming

**Before (Inconsistent):**
```typescript
// File: getUserData.ts
export function getUserData() {
  // ...
}

// File: useApi.ts
export function useApi() {
  // ...
}
```

**After (Standardized):**
```typescript
// File: useUserData.ts
export function useUserData() {
  // ...
}

// File: useApi.ts
export function useApi() {
  // ...
}
```

### API Function Naming

**Before (Inconsistent):**
```typescript
const getData = async () => {
  const response = await fetch("/api/data");
  // ...
};

const fetchUser = async () => {
  const response = await fetch("/api/user");
  // ...
};
```

**After (Using API Client):**
```typescript
import { api } from "@/lib/api/client";

const getData = async () => {
  const data = await api.get("/api/data");
  // ...
};

const fetchUser = async () => {
  const user = await api.get("/api/user");
  // ...
};
```

## 4. Migration Checklist

### For Components with Duplicate Patterns

- [ ] Replace fetch patterns with `useFetch` or `useApi`
- [ ] Replace localStorage patterns with `useLocalStorageSync`
- [ ] Replace scroll detection with `useScrollThreshold`
- [ ] Replace mounted state with `useMounted`
- [ ] Extract API calls to service layer
- [ ] Create custom hooks for component-specific logic

### For Naming Inconsistencies

- [ ] Rename component files to PascalCase
- [ ] Standardize props interfaces to `ComponentNameProps`
- [ ] Rename hooks to use `use` prefix
- [ ] Standardize function names (verb-based)
- [ ] Update all imports

### For Mixed Concerns

- [ ] Extract API calls to service layer
- [ ] Move business logic to hooks
- [ ] Keep components focused on UI rendering
- [ ] Use service classes for complex operations
- [ ] Separate data fetching from data transformation

## 5. Example Refactored Components

See:
- `components/FloatingMessageBubble.refactored.example.tsx` (if created)
- `components/resume/ResumeManager.refactored.example.tsx` (if created)

## 6. Benefits

1. **Reduced Duplication**: Common patterns extracted to reusable hooks
2. **Better Separation**: Business logic separated from UI
3. **Consistency**: Standardized naming across codebase
4. **Maintainability**: Easier to update and test
5. **Reusability**: Hooks and services can be reused across components

## 7. Resources

- `lib/naming-conventions.md` - Complete naming conventions guide
- `hooks/index.ts` - All available hooks
- `service/index.ts` - All available services
- `lib/api/client.ts` - API client utilities



