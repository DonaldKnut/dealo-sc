# 🚨 OAuth Authentication Fix - Quick Setup Guide

## ❌ **Current Problem**
Your OAuth buttons (Google & LinkedIn) are not working because the required environment variables are missing.

## ✅ **Quick Fix**

### Step 1: Create Environment File
Create a file named `.env.local` in your project root (same folder as `package.json`):

```bash
touch .env.local
```

### Step 2: Add Required Variables
Add these variables to your `.env.local` file:

```env
# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-characters
NEXTAUTH_URL=http://localhost:3000

# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/dealo

# JWT Secret (REQUIRED)
JWT_SECRET=your-jwt-secret-here

# Google OAuth (OPTIONAL - for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth (OPTIONAL - for LinkedIn Sign-In)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Email Configuration (REQUIRED for email verification)
EMAIL_USER=your-email@dealonetwork.com
EMAIL_PASS=your-email-password

# AI Services (OPTIONAL)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# Development
NEXTAUTH_DEBUG=true
```

### Step 3: Generate Secrets
Run these commands to generate secure secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### Step 4: Restart Your Development Server
```bash
npm run dev
```

## 🔧 **OAuth Setup (Optional)**

If you want Google/LinkedIn sign-in to work:

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API" or "Google Identity"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### LinkedIn OAuth Setup
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/linkedin`
4. Copy Client ID and Client Secret to `.env.local`

## 🎯 **What This Fixes**

✅ **Email/Password Login** - Will work immediately  
✅ **Email Verification** - Will work with email config  
✅ **Session Management** - Will work with NextAuth config  
✅ **Google Sign-In** - Will work if Google OAuth is configured  
✅ **LinkedIn Sign-In** - Will work if LinkedIn OAuth is configured  

## 🚨 **Important Notes**

- **Never commit `.env.local` to git** (it's already in `.gitignore`)
- **Restart your dev server** after adding environment variables
- **Check the console** for OAuth configuration status
- **Email/password login will work** even without OAuth setup

## 🔍 **Troubleshooting**

If you still have issues:

1. **Check console logs** - Look for OAuth configuration status
2. **Verify file name** - Must be exactly `.env.local` (not `.env.local.txt`)
3. **Restart server** - Environment variables require server restart
4. **Check MongoDB** - Ensure your database is running

## 📞 **Need Help?**

If you're still having issues:
1. Check the detailed `OAUTH_SETUP_GUIDE.md` file
2. Look at the console logs for specific error messages
3. Ensure all required variables are set

---

**After following these steps, your authentication should work properly!** 🎉
