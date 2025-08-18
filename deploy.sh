#!/bin/bash

# Event Landing Page Deployment Script
echo "🚀 Starting deployment process..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Exiting."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if Firebase project is initialized
if [ ! -f ".firebaserc" ]; then
    echo "🔧 Initializing Firebase project..."
    firebase init hosting --project=your-project-id --public=dist --single-page-application=true --yes
else
    echo "✅ Firebase project already initialized"
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Your site is now live!"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
