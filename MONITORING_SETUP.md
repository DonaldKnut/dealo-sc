# Monitoring & Error Tracking Setup Guide

## Overview

This guide covers the monitoring and error tracking setup for the platform, including Sentry, structured logging, performance monitoring, and health checks.

## 1. Sentry Setup

### Installation

```bash
npm install @sentry/nextjs
```

### Configuration

1. **Get Sentry DSN:**
   - Sign up at [sentry.io](https://sentry.io)
   - Create a new project
   - Copy your DSN

2. **Add Environment Variables:**
   ```env
   # .env.local
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
   SENTRY_DSN=your-sentry-dsn-here
   ```

3. **Initialize Sentry:**
   - Client config: `sentry.client.config.ts` ✅ (already created)
   - Server config: `sentry.server.config.ts` ✅ (already created)

### Usage

```typescript
import { captureException, captureMessage } from "@/lib/monitoring/sentry";

try {
  // Your code
} catch (error) {
  captureException(error as Error, {
    context: "user-action",
    userId: user.id,
  });
}
```

## 2. Structured Logging

### Usage

```typescript
import { logger } from "@/lib/monitoring/logger";

// Basic logging
logger.info("User logged in", { userId: user.id });
logger.warn("Rate limit approaching", { remaining: 5 });
logger.error("Database connection failed", error, { db: "primary" });

// API request logging
logger.logRequest("GET", "/api/users", 200, 150);

// Performance logging
logger.logPerformance("Database Query", 250, "ms");
```

### Log Levels

- `debug`: Development-only detailed information
- `info`: General information
- `warn`: Warning messages
- `error`: Error messages (automatically sent to Sentry in production)

## 3. Performance Monitoring

### Usage

```typescript
import { performanceMonitor } from "@/lib/monitoring/performance";

// Measure function execution
const result = await performanceMonitor.measure("fetchUsers", async () => {
  return await fetchUsers();
});

// Record custom metric
performanceMonitor.recordMetric("cache-hit", 1, "count");

// Get metrics summary
const metrics = performanceMonitor.getMetrics();
```

### Decorator Usage

```typescript
import { measurePerformance } from "@/lib/monitoring/performance";

class UserService {
  @measurePerformance("fetchUser")
  async fetchUser(id: string) {
    // Your code
  }
}
```

## 4. Health Check Endpoints

### Endpoints

1. **`/api/health`** - Full health check
   - Checks database connection
   - Returns system status
   - Response time metrics

2. **`/api/health/ready`** - Readiness check
   - Used by Kubernetes/Docker
   - Checks if app is ready for traffic

3. **`/api/health/live`** - Liveness check
   - Used by Kubernetes/Docker
   - Checks if app is alive

### Usage

```bash
# Health check
curl http://localhost:3000/api/health

# Readiness check
curl http://localhost:3000/api/health/ready

# Liveness check
curl http://localhost:3000/api/health/live
```

## 5. API Request Logging

### Middleware Usage

```typescript
import { withApiLogging } from "@/lib/middleware/api-logging";

export async function GET(request: NextRequest) {
  return withApiLogging(async (req) => {
    // Your handler code
    return NextResponse.json({ data: "..." });
  })(request);
}
```

## 6. Client-Side Performance Monitoring

### Add to Layout

```typescript
import PerformanceMonitor from "@/components/monitoring/PerformanceMonitor";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
```

This automatically tracks:
- Core Web Vitals (CLS, FID, FCP, LCP, TTFB, INP)
- Page load time
- Navigation timing

## 7. Error Boundary Integration

Update your error boundaries to use Sentry:

```typescript
import { captureException } from "@/lib/monitoring/sentry";

class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }
}
```

## 8. Alerts Configuration

### Sentry Alerts

1. Go to Sentry Dashboard
2. Navigate to Alerts
3. Create alert rules:
   - Error rate > 10 errors/minute
   - Performance degradation > 2s
   - Database connection failures

### Custom Alerts

You can set up custom alerts using the health check endpoint:

```typescript
// Example: Monitor health endpoint
setInterval(async () => {
  const response = await fetch("/api/health");
  const health = await response.json();
  
  if (health.status === "unhealthy") {
    // Send alert (email, Slack, etc.)
    sendAlert("System unhealthy", health);
  }
}, 60000); // Check every minute
```

## 9. Best Practices

1. **Error Context**: Always provide context when logging errors
2. **Performance**: Monitor slow operations (>1s)
3. **Health Checks**: Use for load balancer health checks
4. **Logging**: Use structured logging for better searchability
5. **Sentry**: Filter out non-critical errors

## 10. Environment Variables

```env
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-client-dsn
SENTRY_DSN=your-server-dsn

# Logging
LOG_LEVEL=info # debug, info, warn, error
NODE_ENV=production
```

## 11. Monitoring Dashboard

Consider setting up:
- **Sentry Dashboard**: Error tracking and performance
- **Grafana**: Custom metrics visualization
- **Datadog/New Relic**: Full APM solution

## Files Created

- ✅ `lib/monitoring/logger.ts` - Structured logging
- ✅ `lib/monitoring/performance.ts` - Performance monitoring
- ✅ `lib/monitoring/sentry.ts` - Sentry integration
- ✅ `lib/middleware/api-logging.ts` - API request logging
- ✅ `app/api/health/route.ts` - Health check endpoint
- ✅ `app/api/health/ready/route.ts` - Readiness check
- ✅ `app/api/health/live/route.ts` - Liveness check
- ✅ `sentry.client.config.ts` - Sentry client config
- ✅ `sentry.server.config.ts` - Sentry server config
- ✅ `components/monitoring/PerformanceMonitor.tsx` - Client-side monitoring

## Next Steps

1. Install Sentry package: `npm install @sentry/nextjs`
2. Add Sentry DSN to environment variables
3. Add `PerformanceMonitor` to root layout
4. Update error boundaries to use Sentry
5. Set up Sentry alerts
6. Configure monitoring dashboards



