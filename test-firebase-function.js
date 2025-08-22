const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Test the callable function
async function testEmailFunction() {
  try {
    console.log('🧪 Testing Firebase Function with Admin SDK...');
    
    // Create a test registration
    const testRegistration = {
      email: 'zimarcilla@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      institution: 'Test Institution',
      designation: 'Test Role',
      contactNumber: '+1234567890',
      eventDays: {
        wedSept3: true,
        thursSept4: false,
        friSept5: false,
        satSept6: false,
        sunSept7: false,
        notAttending: false
      },
      registrationDate: new Date(),
      shortId: 'TEST01',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };

    // Call the function using Admin SDK
    const functions = admin.functions();
    const testEmail = functions.httpsCallable('testEmail');
    
    console.log('📧 Calling testEmail function...');
    const result = await testEmail({ testEmail: 'zimarcilla@gmail.com' });
    
    console.log('✅ Function executed successfully!');
    console.log('📧 Result:', result.data);
    
  } catch (error) {
    console.error('❌ Error testing function:', error);
  }
}

testEmailFunction();
