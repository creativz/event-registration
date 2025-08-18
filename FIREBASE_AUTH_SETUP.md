# Firebase Authentication Setup Guide

## Overview

This guide will help you set up Firebase Authentication for the event registration system to secure the admin dashboard and QR verification pages.

## Prerequisites

1. Firebase project already configured
2. Firebase Authentication enabled in your project

## Step 1: Enable Firebase Authentication

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Navigate to **Authentication** in the left sidebar
4. Click **Get started**
5. Go to the **Sign-in method** tab
6. Enable **Email/Password** authentication:
   - Click on **Email/Password**
   - Toggle the **Enable** switch
   - Click **Save**

## Step 2: Create Admin User

### Option A: Using Firebase Console (Recommended)

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user**
3. Enter admin credentials:
   - Email: `admin@event.com` (or your preferred email)
   - Password: `admin123` (or your preferred password)
4. Click **Add user**

### Option B: Using Code (Development)

You can also create the admin user programmatically:

```typescript
import { createAdminUser } from './src/utils/createAdminUser';

// Run this once to create the admin user
createAdminUser('admin@event.com', 'admin123')
  .then(() => console.log('Admin user created'))
  .catch(error => console.error('Failed to create admin user:', error));
```

## Step 3: Configure Security Rules (Optional)

For additional security, you can set up Firestore security rules to restrict access based on authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users only
    match /registrations/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 4: Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/admin/login`
3. Use the admin credentials you created
4. You should be redirected to the admin dashboard
5. Try accessing `/verify` - it should also require authentication

## Security Features Implemented

### 1. Protected Routes
- `/admin/dashboard` - Requires authentication
- `/verify` - Requires authentication
- `/admin/login` - Redirects to dashboard if already authenticated

### 2. Authentication Context
- Global authentication state management
- Automatic session persistence
- Loading states during authentication checks

### 3. User Interface
- Shows logged-in user email in protected pages
- Logout functionality
- Proper error handling for authentication failures

## User Management

### Creating Additional Users

You can create additional admin users through the Firebase Console:

1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email and password
4. The user can then log in through `/admin/login`

### Password Reset

Users can reset their passwords through Firebase Console:

1. Go to **Authentication** > **Users**
2. Find the user
3. Click the three dots menu
4. Select **Reset password**

## Troubleshooting

### Common Issues

1. **"User not found" error**
   - Ensure the user exists in Firebase Authentication
   - Check if the email is correct

2. **"Invalid password" error**
   - Verify the password is correct
   - Check if the user account is enabled

3. **Authentication not working**
   - Ensure Firebase Authentication is enabled
   - Check if Email/Password sign-in method is enabled
   - Verify Firebase configuration in `src/firebase/config.ts`

### Debug Mode

To debug authentication issues, check the browser console for error messages. The authentication service logs detailed error information.

## Production Considerations

1. **Strong Passwords**: Use strong, unique passwords for admin accounts
2. **Email Verification**: Consider enabling email verification for additional security
3. **Rate Limiting**: Implement rate limiting for login attempts
4. **Audit Logs**: Monitor authentication events in Firebase Console
5. **Backup Users**: Create multiple admin accounts for redundancy

## Environment Variables

For production, consider using environment variables for sensitive configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

Update `src/firebase/config.ts` to use these environment variables.

## Support

If you encounter issues with Firebase Authentication setup, refer to:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console Help](https://firebase.google.com/support)
