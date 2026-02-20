# R2 Upload Unauthorized - Fix Guide

## Quick Fix Steps

### 1. Go to Cloudflare Dashboard
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Manage R2 API Tokens**

### 2. Create/Verify API Token
1. Click **Create API Token**
2. Give it a name (e.g., "Dealo App Upload Token")
3. Set permissions:
   - **Object Read & Write** (required for uploads)
   - Or select **Admin Read & Write** for full access
4. Select your bucket: `dealoapp-bucket`
5. Click **Create API Token**

### 3. Copy Credentials
After creating the token, you'll see:
- **Access Key ID** (starts with something like `60f7b934...`)
- **Secret Access Key** (long string)

### 4. Update .env.local
Update these values in your `.env.local` file:

```env
R2_ACCESS_KEY_ID=your_new_access_key_id_here
R2_SECRET_ACCESS_KEY=your_new_secret_access_key_here
R2_BUCKET_NAME=dealoapp-bucket
R2_ENDPOINT=https://60f7b934e8e4b606139f8a0674a2e725.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-734ce1bac5434727ba9692dacb3d7441.r2.dev
R2_ACCOUNT_ID=60f7b934e8e4b606139f8a0674a2e725
R2_REGION=auto
```

### 5. Restart Dev Server
```bash
# Stop your dev server (Ctrl+C)
# Then restart
npm run dev
```

## Common Issues

### Issue: Token Expired
- **Solution**: Create a new API token in Cloudflare dashboard

### Issue: Wrong Permissions
- **Solution**: Make sure token has "Object Read & Write" or "Admin Read & Write"

### Issue: Wrong Bucket Name
- **Solution**: Verify bucket name matches exactly (case-sensitive)

### Issue: Wrong Account ID
- **Solution**: The account ID is in your R2_ENDPOINT URL (the part before `.r2.cloudflarestorage.com`)

## Verify Your Setup

Run this to check your configuration:
```bash
node scripts/check-r2-config.js
```

## Still Having Issues?

1. **Check token is active**: Go to R2 → Manage R2 API Tokens and verify it's not revoked
2. **Verify bucket exists**: Go to R2 → Buckets and confirm `dealoapp-bucket` exists
3. **Check endpoint format**: Should be `https://<account-id>.r2.cloudflarestorage.com` (no bucket name in endpoint)
4. **Test with Cloudflare CLI**: Try uploading via `wrangler` to verify credentials work


