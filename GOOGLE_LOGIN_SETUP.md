# Google Login Implementation Setup Guide

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install google-auth-library
```

### 2. Add Environment Variables

Add the following to `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

Get your Google Client ID from: https://console.cloud.google.com/

### 3. Verify Backend Implementation

Files created/modified:
- ✅ `src/utils/googleVerify.js` - Token verification utility
- ✅ `src/controllers/middlewaresControllers/createAuthMiddleware/googleAuth.js` - Google auth handler
- ✅ `src/routes/coreRoutes/coreAuth.js` - Added `/google` route
- ✅ `src/models/coreModels/Admin.js` - Added `isGoogleUser` and `googleId` fields

### 4. Backend Endpoint

POST `/api/google`
```json
{
  "token": "google_id_token"
}
```

---

## Frontend Setup

### 1. Add Environment Variables

Add the following to `.env` (or `.env.local`):

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Verify Frontend Implementation

Files modified:
- ✅ `src/pages/Login.jsx` - Added Google Sign-In button
- ✅ `src/auth/auth.service.js` - Added `googleLogin` service
- ✅ `src/redux/auth/actions.js` - Added `googleLogin` action

### 3. Google Sign-In Flow

1. User clicks "Sign in with Google" button
2. Google popup appears
3. User selects account
4. Frontend receives ID token
5. Token sent to backend
6. Backend creates/finds user
7. JWT returned to frontend
8. User logged in and redirected to dashboard

---

## Google Cloud Console Setup

### Step 1: Create OAuth 2.0 Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000` (local development)
   - `http://localhost:8888` (backend)
   - Your production domain

### Step 2: Copy Client ID

- Copy the Client ID from the credentials page
- Add to both frontend `.env` and backend `.env`

---

## Testing

### 1. Start Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 2. Test Google Login

1. Navigate to http://localhost:3000/login
2. Click "Sign in with Google"
3. Select your Google account
4. You should be logged in
5. User created in database with:
   - `isGoogleUser: true`
   - `googleId: <google_sub>`
   - `photo: <google_picture>`

### 3. Test Cases

**✅ New Google User**
- Creates account automatically
- Sets isGoogleUser = true
- Sets photo from Google profile

**✅ Returning Google User**
- Logs in without duplicate creation
- Gets JWT token
- Redirected to dashboard

**✅ Mixed Auth**
- User can sign up with email/password
- Later sign in with Google using same email
- Works seamlessly

**❌ Invalid Token**
- Returns 400 error
- Frontend shows error message

---

## Security Notes

1. **Client ID** stored in frontend env - this is safe (Google expects this)
2. **Verification** happens on backend using google-auth-library
3. **JWT Secret** protects the tokens created after Google verification
4. **Email Verification** required (Google verifies it)
5. **No Password** stored for Google users

---

## Troubleshooting

### Google Sign-In button not appearing

- Check VITE_GOOGLE_CLIENT_ID is set correctly
- Verify Google script loaded (check browser console)
- Check browser console for Google errors

### Backend rejects token

- Verify GOOGLE_CLIENT_ID in backend .env matches frontend
- Check token is being sent correctly
- Review backend logs

### User not created

- Check MongoDB connection
- Review backend logs for errors
- Verify Admin model schema updated

### CORS errors

- Ensure backend CORS allows frontend domain
- Check app.js has CORS configured

---

## Production Deployment

1. Update GOOGLE_CLIENT_ID to production client ID
2. Add production domain to Google Console authorized URIs
3. Update backend JWT_SECRET for production
4. Ensure HTTPS on production
5. Test Google login flow end-to-end

