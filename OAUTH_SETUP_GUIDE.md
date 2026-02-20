# 🔐 OAuth Setup Guide for Dealo Platform

## 🚨 Current Issue

Your OAuth is not working because you're missing the required environment variables. The error shows:

```
OAuth Configuration Error: validateOAuthConfig is not a function
```

This is because the `lib/auth-utils.ts` file was missing (now fixed), but you also need to set up your OAuth credentials.

## 📋 Required Environment Variables

You need to create a `.env.local` file in your project root with these variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id-here
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-min-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/dealo
```

## 🔧 Step-by-Step Setup

### 1. Create .env.local File

Create a file named `.env.local` in your project root and add the variables above.

### 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 3. Set Up Google OAuth

#### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

#### Step 2: Create or Select Project

1. Click on the project dropdown at the top
2. Click "New Project" or select an existing one
3. Give it a name like "Dealo Platform"

#### Step 3: Enable APIs

1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press "Enable"

#### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name: "Dealo Web App"
5. **Authorized redirect URIs**: Add `http://localhost:3000/api/auth/callback/google`
6. Click "Create"

#### Step 5: Copy Credentials

1. Copy the "Client ID" and "Client Secret"
2. Add them to your `.env.local` file:
   ```env
   GOOGLE_CLIENT_ID=your-copied-client-id
   GOOGLE_CLIENT_SECRET=your-copied-client-secret
   ```

### 4. Set Up LinkedIn OAuth

#### Step 1: Go to LinkedIn Developers

1. Visit: https://www.linkedin.com/developers/
2. Sign in with your LinkedIn account

#### Step 2: Create App

1. Click "Create App"
2. Fill in the form:
   - App name: "Dealo Platform"
   - LinkedIn Page: Your company page (or personal)
   - App Logo: Upload a logo
3. Click "Create app"

#### Step 3: Configure OAuth Settings

1. Go to "Auth" tab
2. Add redirect URLs: `http://localhost:3000/api/auth/callback/linkedin`
3. Save changes

#### Step 4: Get Credentials

1. Go to "Auth" tab
2. Copy the "Client ID" and "Client Secret"
3. Add them to your `.env.local` file:
   ```env
   LINKEDIN_CLIENT_ID=your-copied-client-id
   LINKEDIN_CLIENT_SECRET=your-copied-client-secret
   ```

## ✅ Verification Steps

### 1. Check Configuration

Run the OAuth checker:

```bash
node scripts/check-oauth-config.js
```

You should see:

```
✅ All OAuth environment variables are configured!
🚀 You should be able to use OAuth sign-in now.
```

### 2. Restart Development Server

```bash
npm run dev
```

### 3. Test OAuth

1. Go to http://localhost:3000
2. Click "Continue with Google" or "Continue with LinkedIn"
3. You should be redirected to the OAuth provider
4. After authorization, you should be redirected back to your app

## 🐛 Troubleshooting

### Common Issues:

#### 1. "AccessDenied" Error

- Check that your redirect URIs are exactly correct
- Make sure you're using `http://localhost:3000` (not `https`)
- Verify the callback path is `/api/auth/callback/google` or `/api/auth/callback/linkedin`

#### 2. "Invalid Client" Error

- Double-check your Client ID and Client Secret
- Make sure you copied them correctly from the console
- Verify the credentials are for the right environment (development vs production)

#### 3. "Redirect URI Mismatch" Error

- Go back to your OAuth console
- Add the exact redirect URI: `http://localhost:3000/api/auth/callback/google`
- Make sure there are no extra spaces or characters

#### 4. Environment Variables Not Loading

- Make sure your `.env.local` file is in the project root
- Restart your development server after adding the file
- Check that the file name is exactly `.env.local` (not `.env.local.txt`)

### Debug Mode

To see more detailed OAuth logs, add this to your `.env.local`:

```env
NODE_ENV=development
```

## 🔒 Security Notes

1. **Never commit `.env.local` to git** - it's already in `.gitignore`
2. **Use different credentials for development and production**
3. **Rotate secrets regularly**
4. **Use strong, unique secrets**

## 📞 Support

If you're still having issues:

1. Check the browser console for errors
2. Check the server logs for OAuth errors
3. Verify all environment variables are set correctly
4. Make sure your OAuth apps are properly configured

## 🎯 Next Steps

Once OAuth is working:

1. Test both Google and LinkedIn sign-in
2. Verify users are being created in your database
3. Test the onboarding flow
4. Check that user sessions work correctly

---

**Remember**: The OAuth setup is required for the social login buttons to work. Without these credentials, users will see errors when trying to sign in with Google or LinkedIn.
