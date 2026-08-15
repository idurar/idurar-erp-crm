# Password Strength Validation - Testing Guide

## 🚀 Setup Complete

Both servers are now running:
- **Frontend**: http://localhost:3000/
- **Backend API**: http://localhost:8888/api/

## 📋 Testing Instructions

### **Frontend Registration Form Testing**

1. Click on **"Register"** button on the login page
2. Fill in the form with your test credentials

### ✅ **Test Case 1: Strong Password (Should PASS)**
- **Name**: Test User
- **Email**: testuser@example.com
- **Password**: `Abcdef1@`
- **Confirm Password**: `Abcdef1@`
- **Country**: Select any country
- **Expected Result**: ✅ Form submits, account created

### ❌ **Test Case 2: Too Short (Should FAIL)**
- **Password**: `Pass1@` (only 6 chars)
- **Expected Error**: "Password must be at least 8 characters..."

### ❌ **Test Case 3: No Uppercase (Should FAIL)**
- **Password**: `abcdef1@` (no uppercase letter)
- **Expected Error**: "Password must be at least 8 characters..."

### ❌ **Test Case 4: No Lowercase (Should FAIL)**
- **Password**: `ABCDEF1@` (no lowercase letter)
- **Expected Error**: "Password must be at least 8 characters..."

### ❌ **Test Case 5: No Number (Should FAIL)**
- **Password**: `Abcdefgh@` (no number)
- **Expected Error**: "Password must be at least 8 characters..."

### ❌ **Test Case 6: No Special Character (Should FAIL)**
- **Password**: `Abcdef12` (no special char)
- **Expected Error**: "Password must be at least 8 characters..."

### ❌ **Test Case 7: Passwords Don't Match (Should FAIL)**
- **Password**: `Abcdef1@`
- **Confirm Password**: `Abcdef2@`
- **Expected Error**: "Passwords do not match"

---

## 🔧 Backend API Testing (Postman / cURL)

### **Test Strong Password (Should SUCCEED)**
```bash
curl -X POST http://localhost:8888/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "country": "US"
  }'
```

**Expected Response (200)**:
```json
{
  "success": true,
  "result": {
    "_id": "...",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "message": "Successfully registered..."
}
```

---

### **Test Weak Password (Should FAIL)**
```bash
curl -X POST http://localhost:8888/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "weak123",
    "country": "US"
  }'
```

**Expected Response (400)**:
```json
{
  "success": false,
  "result": null,
  "message": "Password is too weak. Password must be at least 8 characters and include uppercase, lowercase, number and special character."
}
```

---

## 🔐 Password Requirements

✅ **Minimum 8 characters**
✅ **At least one UPPERCASE letter (A–Z)**
✅ **At least one lowercase letter (a–z)**
✅ **At least one number (0–9)**
✅ **At least one special character (@$!%*#?&)**

---

## 📝 Examples of Valid Passwords
- `Abcdef1@`
- `SecurePass123!`
- `MyPassword#2024`
- `Test$1234abc`
- `Strong@Pass99`

## ❌ Examples of Invalid Passwords
- `123456` (no letters, no special char)
- `abcdef` (no uppercase, no number, no special char)
- `Password` (no number, no special char)
- `Admin123` (no special char)
- `Pass1@` (too short, only 6 chars)

---

## 📊 Validation Layers

### **Frontend** (RegisterForm.jsx)
- ✅ Real-time validation as user types
- ✅ Form won't submit until password meets all requirements
- ✅ Confirm password must match
- ✅ Visual feedback with AntD `hasFeedback`

### **Backend** (register.js)
- ✅ Re-validates password (defense in depth)
- ✅ Returns HTTP 400 for weak passwords
- ✅ Prevents weak passwords even if frontend validation is bypassed
- ✅ Checks for duplicate emails

---

## 🛠️ Troubleshooting

If frontend won't load:
1. Make sure both servers are running
2. Check that port 3000 is not in use
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for errors (F12)

If registration fails:
1. Check that MongoDB is running locally on port 27017
2. Check backend logs for database errors
3. Ensure all required fields are filled
4. Check network tab in browser DevTools (F12)

---

Happy testing! 🎉
