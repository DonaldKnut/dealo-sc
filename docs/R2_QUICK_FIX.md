# R2 Unauthorized Error - Quick Fix

## ⚠️ Issue Found

Your `R2_ACCESS_KEY_ID` is set to your account ID (`60f7b934e8e4b606139f8a0674a2e725`), which is **incorrect**. 

The Access Key ID should be a **different value** from your account ID. This is why you're getting "Unauthorized".

## ✅ Fix Steps

### Step 1: Create New R2 API Token in Cloudflare

1. Go to: https://dash.cloudflare.com
2. Navigate to: **R2** → **Manage R2 API Tokens**
3. Click: **Create API Token**
4. Configure:
   - **Token Name**: `Dealo App Production` (or any name)
   - **Permissions**: Select **Object Read & Write** or **Admin Read & Write**
   - **Bucket**: Select `dealoapp-bucket`
5. Click: **Create API Token**

### Step 2: Copy the New Credentials

After creating, you'll see:
- **Access Key ID** (will be different from your account ID)
- **Secret Access Key** (long string)

### Step 3: Update .env.local

Replace these lines in your `.env.local` file:

```env
R2_ACCESS_KEY_ID=<NEW_ACCESS_KEY_ID_FROM_CLOUDFLARE>
R2_SECRET_ACCESS_KEY=<NEW_SECRET_ACCESS_KEY_FROM_CLOUDFLARE>
```

**Important**: The Access Key ID should NOT be the same as your Account ID!

### Step 4: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 🔍 Verify Your Setup

After updating, your `.env.local` should have:

```env
R2_ACCOUNT_ID=60f7b934e8e4b606139f8a0674a2e725
R2_BUCKET_NAME=dealoapp-bucket
R2_ENDPOINT=https://60f7b934e8e4b606139f8a0674a2e725.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-734ce1bac5434727ba9692dacb3d7441.r2.dev
R2_ACCESS_KEY_ID=<DIFFERENT_FROM_ACCOUNT_ID>
R2_SECRET_ACCESS_KEY=<LONG_SECRET_STRING>
R2_REGION=auto
```

## ❓ Still Not Working?

1. **Check token is active**: Dashboard → R2 → Manage R2 API Tokens → Verify it's not revoked
2. **Verify permissions**: Token must have "Object Read & Write" or "Admin Read & Write"
3. **Check bucket name**: Must match exactly (case-sensitive): `dealoapp-bucket`
4. **Clear Next.js cache**: `rm -rf .next` then restart

## 📝 Note

I've already copied your R2 config from `.env` to `.env.local`. You just need to update the Access Key ID and Secret Access Key with the new values from Cloudflare.


