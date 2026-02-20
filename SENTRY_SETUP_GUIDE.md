# Sentry Setup Guide - Step by Step

## Step 1: Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Click **"Sign Up"** (or **"Get Started"**)
3. Sign up using:
   - Email and password, OR
   - GitHub account (recommended for easier integration)

## Step 2: Create a New Project

1. After signing up, you'll be prompted to create a project
2. Select **"Next.js"** as your platform
3. Enter a project name (e.g., "Dealo Platform" or "Dealo Network")
4. Click **"Create Project"**

## Step 3: Get Your DSN (Data Source Name)

After creating the project, Sentry will show you a setup page with your DSN. It looks like this:

```
https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
```

**Where to find it:**
1. On the project setup page (shown immediately after creating project)
2. Or go to: **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
3. Click on the DSN to copy it

## Step 4: Add DSN to Environment Variables

### Option A: Using `.env.local` (Recommended for Development)

1. Create or open `.env.local` in your project root
2. Add your DSN:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o1234567.ingest.sentry.io/1234567
```

**Note:** 
- `NEXT_PUBLIC_SENTRY_DSN` is for client-side (browser)
- `SENTRY_DSN` is for server-side (Node.js)
- You can use the same DSN for both, or create separate projects

### Option B: Using Your Hosting Platform

**Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SENTRY_DSN` = `your-dsn-here`
   - `SENTRY_DSN` = `your-dsn-here`

**Netlify:**
1. Go to **Site settings** → **Environment variables**
2. Add the same variables

**Other Platforms:**
- Add the environment variables in your platform's dashboard

## Step 5: Verify Installation

After adding the DSN, restart your development server:

```bash
npm run dev
```

## Step 6: Test Error Tracking

### Test Client-Side Error Tracking

1. Create a test error in your code:

```typescript
// In any component
import { captureException } from "@/lib/monitoring/sentry";

const testError = () => {
  try {
    throw new Error("Test error from Sentry");
  } catch (error) {
    captureException(error as Error, {
      context: "test",
      component: "TestComponent",
    });
  }
};
```

2. Trigger the error
3. Go to your Sentry dashboard
4. You should see the error appear in **Issues**

### Test Server-Side Error Tracking

```typescript
// In any API route
import { captureException } from "@/lib/monitoring/sentry";

export async function GET() {
  try {
    // Your code
    throw new Error("Test server error");
  } catch (error) {
    captureException(error as Error, {
      context: "api",
      route: "/api/test",
    });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

## Step 7: Configure Sentry (Optional)

### Update Sample Rate

In `sentry.client.config.ts` and `sentry.server.config.ts`, you can adjust:

```typescript
tracesSampleRate: 0.1, // 10% of transactions (reduce in production)
```

### Filter Errors

Already configured to filter out:
- Network errors
- Non-critical errors
- Development-only errors

## Step 8: Set Up Alerts (Recommended)

1. Go to **Alerts** in your Sentry dashboard
2. Click **"Create Alert Rule"**
3. Configure:
   - **Trigger**: When error rate exceeds threshold
   - **Conditions**: 
     - Error count > 10 in 1 minute
     - Or error rate > 5%
   - **Actions**: 
     - Email notification
     - Slack integration (optional)
     - PagerDuty (optional)

## Step 9: View Your Errors

1. Go to **Issues** in Sentry dashboard
2. You'll see:
   - Error messages
   - Stack traces
   - User context
   - Browser/device info
   - Performance data

## Troubleshooting

### DSN Not Working

1. **Check environment variables:**
   ```bash
   # In your terminal
   echo $NEXT_PUBLIC_SENTRY_DSN
   ```

2. **Verify DSN format:**
   - Should start with `https://`
   - Should contain `@o` (organization ID)
   - Should end with project ID

3. **Check Sentry dashboard:**
   - Go to **Settings** → **Projects** → **[Your Project]**
   - Verify the DSN matches

### Errors Not Appearing

1. **Check if in production mode:**
   - Sentry only works in production by default
   - Or set `NODE_ENV=production` for testing

2. **Check browser console:**
   - Look for Sentry initialization messages
   - Check for any errors loading Sentry

3. **Verify Sentry is initialized:**
   - Check `sentry.client.config.ts` and `sentry.server.config.ts`
   - Ensure DSN is set

### Performance Issues

- Reduce `tracesSampleRate` if too many transactions
- Adjust `replaysSessionSampleRate` for session replays
- Filter out non-critical errors in `beforeSend`

## Quick Reference

### DSN Format
```
https://[PUBLIC_KEY]@[ORGANIZATION_ID].ingest.sentry.io/[PROJECT_ID]
```

### Environment Variables Needed
```env
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
SENTRY_DSN=your-dsn-here
```

### Files Already Configured
- ✅ `sentry.client.config.ts` - Client-side config
- ✅ `sentry.server.config.ts` - Server-side config
- ✅ `lib/monitoring/sentry.ts` - Utility functions
- ✅ `components/ErrorBoundary.tsx` - Can be updated to use Sentry
- ✅ `components/GlobalErrorHandler.tsx` - Can be updated to use Sentry

## Next Steps

1. ✅ Install Sentry: `npm install @sentry/nextjs`
2. ✅ Get DSN from Sentry dashboard
3. ✅ Add DSN to `.env.local`
4. ✅ Test error tracking
5. ✅ Set up alerts
6. ✅ Monitor errors in Sentry dashboard

## Support

- Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Sentry Support: https://sentry.io/support/



