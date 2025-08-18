# Event Landing Page with Firebase Integration

A modern, responsive event landing page built with React, TypeScript, and Firebase. Features include a registration form, admin panel for data management, and export functionality for Excel and CSV formats.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design built with Tailwind CSS
- **Registration Form**: Comprehensive form with validation using React Hook Form
- **Firebase Integration**: Real-time data storage and retrieval
- **Admin Panel**: View registrations and manage event data
- **Data Export**: Export registrations to Excel (.xlsx) and CSV formats
- **Toast Notifications**: User-friendly feedback using React Hot Toast
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Data Export**: SheetJS (xlsx)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd event-landing-page
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Firestore security rules (see Firebase Rules section below)
4. Copy your Firebase configuration from Project Settings > General > Your Apps

### 3. Update Firebase Config

Edit `src/firebase/config.ts` and replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

### 4. Firebase Security Rules

Set up the following Firestore security rules in your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{document} {
      allow read, write: if true; // For development - restrict in production
    }
  }
}
```

**⚠️ Security Note**: The above rules allow public read/write access. For production, implement proper authentication and authorization.

### 5. Run the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📱 Usage

### For Attendees
1. Navigate to the registration form
2. Fill out all required fields
3. Select ticket type
4. Submit the form
5. Receive confirmation

### For Administrators
1. Click the settings gear icon in the top-right corner
2. View all registrations in the admin panel
3. Export data to Excel or CSV formats
4. Monitor registration count

## 🗂️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Landing page header
│   ├── AboutSection.tsx # Event information
│   ├── RegistrationForm.tsx # Registration form
│   ├── AdminPanel.tsx  # Admin management panel
│   └── Footer.tsx      # Page footer
├── firebase/           # Firebase configuration
│   └── config.ts       # Firebase setup
├── services/           # Business logic
│   └── firebaseService.ts # Firebase operations
├── types/              # TypeScript definitions
│   └── index.ts        # Interface definitions
├── utils/              # Utility functions
│   └── exportUtils.ts  # Data export functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔐 Environment Variables

For production, consider using environment variables for Firebase configuration:

```bash
# .env.local
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Deploy to Other Platforms

The built files in the `dist/` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📊 Data Export

The application supports exporting registration data in two formats:

- **Excel (.xlsx)**: Full-featured spreadsheet with formatted columns
- **CSV**: Simple comma-separated values format

Exported data includes:
- Personal information (name, email, phone)
- Company details
- Ticket type
- Registration timestamp
- Dietary restrictions and special requests

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for color schemes and design tokens
- Update `src/index.css` for custom component styles
- All components use Tailwind utility classes for easy customization

### Content
- Update event details in `Header.tsx` and `AboutSection.tsx`
- Modify form fields in `RegistrationForm.tsx`
- Customize admin panel in `AdminPanel.tsx`

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**: Verify your Firebase configuration and ensure Firestore is enabled
2. **Build Errors**: Ensure all dependencies are installed with `npm install`
3. **Export Issues**: Check browser console for any JavaScript errors

### Development Tips

- Use browser developer tools to debug Firebase operations
- Check Firebase Console for database activity
- Verify Firestore security rules are properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Firebase documentation
- Review the React and TypeScript documentation

## 🔮 Future Enhancements

- [ ] User authentication and role-based access
- [ ] Email confirmation system
- [ ] Payment integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Event schedule management
- [ ] Speaker profiles and sessions
- [ ] Real-time registration count updates
