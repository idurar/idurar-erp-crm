


# 🌐 Google OAuth Setup

This guide explains how to set up **Google OAuth & OneTap Login** for this project.

---

## 🚀 Step 1: Create OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services → Credentials**.
3. Click **Create Credentials → OAuth Client ID**.
4. Select **Web Application**.
5. Add your **Authorized Origins** (e.g., `http://localhost:3000`) and **Redirect URIs**.
6. Copy your **Client ID** and **Client Secret**.

---

## ⚙️ Step 2: Configure Frontend

In your **frontend `.env`** file:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

---

## ⚙️ Step 3: Configure Backend

In your **backend `.env`** file:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## 🔄 Step 4: Redirect After Login

* Default redirect path after successful login is:

  ```
  /fdashboard
  ```
* Change this in your login handler if needed.

---

## ✅ Step 5: Test the Flow

1. Start **backend + frontend servers**.
2. Open the login page.
3. Click **Sign in with Google** (or use OneTap).
4. Complete authentication → confirm redirect to `/fdashboard`.

---

✨ That’s it! Google OAuth is now fully integrated.

---
