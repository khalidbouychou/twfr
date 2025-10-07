# Google Avatar Debugging Guide

## Issue
Google profile avatar not displaying after login

## Changes Made

### 1. Enhanced Avatar Loading (`UserDashboard.jsx`)
- ✅ Added console logging to track avatar sources
- ✅ Checks multiple sources in order:
  1. `userProfileData.avatar` (primary)
  2. `userProfileData.picture` (Google fallback)
  3. `googleProfile.picture` (localStorage)
  4. Context data
  5. Fallback avatar

### 2. Improved Image Loading (`Header.jsx`)
- ✅ Added `crossOrigin="anonymous"` for CORS
- ✅ Added `referrerPolicy="no-referrer"` for privacy
- ✅ Enhanced error logging
- ✅ Updated both desktop and mobile avatar displays

### 3. Enhanced Login Logging (`LoginForm.jsx` & `SignupForm.jsx`)
- ✅ Console logs show:
  - Full payload from Google
  - Profile object created
  - Picture URL extracted
  - Unified profile data

## How to Debug

### Step 1: Open Browser Console
1. Login with Google account
2. Open DevTools (F12)
3. Go to Console tab

### Step 2: Check Console Logs
You should see:
```
Google Login - Payload: {name: "...", email: "...", picture: "https://..."}
Google Login - Profile created: {...}
Google Login - Picture URL: https://lh3.googleusercontent.com/...
Google Login - Unified profile: {fullName: "...", email: "...", avatar: "https://..."}
```

### Step 3: Check LocalStorage
In DevTools Console, run:
```javascript
JSON.parse(localStorage.getItem('userProfileData'))
JSON.parse(localStorage.getItem('googleProfile'))
```

Should show:
```javascript
// userProfileData
{
  fullName: "Your Name",
  email: "your@email.com",
  avatar: "https://lh3.googleusercontent.com/..."
}

// googleProfile
{
  name: "Your Name",
  email: "your@email.com", 
  picture: "https://lh3.googleusercontent.com/...",
  sub: "...",
  given_name: "...",
  family_name: "..."
}
```

### Step 4: Check Avatar Loading
After dashboard loads, console should show:
```
Avatar from userProfileData: https://lh3.googleusercontent.com/...
```

OR if image fails:
```
Avatar failed to load: https://lh3.googleusercontent.com/...
```

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom:** Console shows CORS error
**Solution:** 
- Added `crossOrigin="anonymous"` and `referrerPolicy="no-referrer"` to img tags
- Google images should load with these attributes

### Issue 2: Picture URL is undefined
**Symptom:** Console shows `picture: undefined`
**Solution:**
- Google JWT token might not include picture
- Check Google Cloud Console → OAuth consent screen
- Ensure profile scope includes "profile" and "email"

### Issue 3: Image loads but displays broken
**Symptom:** Network tab shows 403/404 error
**Solution:**
- Google profile pictures require proper referrer policy
- Already added `referrerPolicy="no-referrer"`

### Issue 4: LocalStorage is empty
**Symptom:** `userProfileData` is `null` or `{}`
**Solution:**
- Check if `updateUserProfile()` function works
- Verify Context provider wraps the app
- Try logout and login again

## Test Steps

1. **Clear all data:**
   ```javascript
   localStorage.clear();
   ```

2. **Logout completely:**
   - Click user menu → Logout
   - Clear browser cache

3. **Login with Google:**
   - Go to login page
   - Click "Sign in with Google"
   - Check console for logs

4. **Verify avatar:**
   - Should see your Google profile picture
   - If broken, check console errors

## Expected Behavior

✅ Google profile picture loads immediately after login  
✅ Avatar displays in header (desktop & mobile)  
✅ Avatar persists on page refresh  
✅ Fallback avatar shows if Google image fails  

## Files Modified

1. `src/components/Dashboard/UserDashboard.jsx`
   - Enhanced `getAvatarSrc` with logging
   
2. `src/components/Dashboard/components/Header.jsx`
   - Added CORS attributes to avatar images
   - Enhanced error handling (2 locations: desktop + mobile)
   
3. `src/components/Navbar.jsx`
   - Enhanced `getAvatarSrc` with logging
   - Added CORS attributes to avatar images  
   - Enhanced error handling (2 locations: desktop dropdown + mobile menu)
   
4. `src/components/Login/LoginForm.jsx`
   - Added detailed console logging
   
5. `src/components/Login/SignupForm.jsx`
   - Added detailed console logging

## Next Steps If Still Not Working

1. Share console logs from browser
2. Share localStorage data
3. Check Network tab for image request status
4. Verify Google OAuth configuration
