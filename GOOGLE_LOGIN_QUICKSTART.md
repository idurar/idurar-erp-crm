# Google Login - Quick Start (5 Minutes)

## Step 1: Install Backend Dependency (1 min)

```bash
cd backend
npm install google-auth-library
```

## Step 2: Get Google Client ID (2 min)

1. Go to https://console.cloud.google.com/
2. Create new project or use existing
3. Enable "Google+ API"
4. Create "OAuth 2.0 Client ID" for "Web application"
5. Add authorized origins:
   - http://localhost:3000
   - http://localhost:8888
6. Copy the Client ID

## Step 3: Set Environment Variables (1 min)

**Backend** `.env`:
```
GOOGLE_CLIENT_ID=paste_your_client_id_here
```

**Frontend** `.env` or `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here
```

## Step 4: Start Servers (1 min)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Step 5: Test It!

1. Go to http://localhost:3000/login
2. Click "Sign in with Google"
3. Select your account
4. You're logged in! ✅

---

## That's It! 🎉

The complete Google Login flow is now working:

✅ Frontend loads Google Identity Services  
✅ User clicks Google sign-in button  
✅ Backend verifies token  
✅ User created/found in database  
✅ JWT token issued  
✅ User logged in and redirected  

All with **full password strength validation** from the previous implementation!

---

## What Changed

**Backend:**
- ✅ `/api/google` endpoint added
- ✅ Token verification utility created
- ✅ User model updated (isGoogleUser, googleId fields)

**Frontend:**
- ✅ Login page shows Google sign-in button
- ✅ Redux action for Google login
- ✅ Auth service method for token submission

**No breaking changes** - existing email/password login still works perfectly!

