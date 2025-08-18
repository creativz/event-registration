# 🚀 Quick Start Guide

Get your event landing page up and running in minutes!

## ⚡ Immediate Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## 🔥 Firebase Setup (Required for Full Functionality)

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project"
- Give it a name (e.g., "event-landing-page")
- Enable Google Analytics (optional)

### 2. Enable Firestore
- In your Firebase project, go to "Firestore Database"
- Click "Create database"
- Choose "Start in test mode" (for development)
- Select a location close to your users

### 3. Get Configuration
- Go to Project Settings (gear icon)
- Scroll down to "Your apps"
- Click "Add app" → Web app
- Copy the config object

### 4. Update Firebase Config
Edit `src/firebase/config.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

### 5. Set Firestore Rules
In Firebase Console → Firestore Database → Rules, paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{document} {
      allow read, write: if true;
    }
  }
}
```

## 🧪 Test the Application

### Registration Form
1. Fill out the form with test data
2. Submit the form
3. Check Firebase Console → Firestore to see the data

### Admin Panel
1. Click the settings gear icon (top-right)
2. View registrations
3. Export data to Excel/CSV

## 🚀 Deploy to Production

### Option 1: Firebase Hosting (Recommended)
```bash
./deploy.sh
```

### Option 2: Manual Build
```bash
npm run build
# Upload dist/ folder to your hosting service
```

## 🔧 Customization

### Update Event Details
- Edit `src/components/Header.tsx` for main event info
- Edit `src/components/AboutSection.tsx` for event description
- Edit `src/components/RegistrationForm.tsx` for form fields

### Change Styling
- Modify `tailwind.config.js` for colors and themes
- Update `src/index.css` for custom styles

## 🐛 Common Issues

### "Firebase not initialized"
- Check your Firebase config in `src/firebase/config.ts`
- Ensure Firestore is enabled in Firebase Console

### "Permission denied"
- Check Firestore security rules
- Ensure rules allow read/write access

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors in the console

## 📱 Features Available

✅ **Registration Form** - Collect attendee information  
✅ **Firebase Integration** - Store data in the cloud  
✅ **Admin Panel** - View and manage registrations  
✅ **Data Export** - Excel and CSV formats  
✅ **Responsive Design** - Works on all devices  
✅ **Form Validation** - Ensures data quality  
✅ **Toast Notifications** - User feedback  

## 🎯 Next Steps

1. **Customize Content** - Update event details and branding
2. **Add Authentication** - Secure admin access
3. **Email Integration** - Send confirmations
4. **Payment Processing** - Accept online payments
5. **Analytics** - Track registration metrics

---

**Need Help?** Check the main [README.md](README.md) for detailed documentation!

