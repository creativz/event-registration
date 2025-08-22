// Test script to run in browser console
// Copy and paste this into your browser console on the registration page

console.log('🧪 Testing Firebase Function from browser...');

// Import Firebase Functions
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js';

// Initialize Firebase Functions
const functions = getFunctions();
const testEmailFunction = httpsCallable(functions, 'testEmail');

// Test the function
async function testFunction() {
  try {
    console.log('📧 Calling testEmail function...');
    const result = await testEmailFunction({ testEmail: 'zimarcilla@gmail.com' });
    console.log('✅ Function executed successfully!');
    console.log('📧 Result:', result.data);
  } catch (error) {
    console.error('❌ Error testing function:', error);
  }
}

// Run the test
testFunction();
