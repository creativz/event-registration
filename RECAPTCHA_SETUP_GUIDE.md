# reCAPTCHA Setup Guide for Malikhaing Pinoy Expo 2025

## 🛡️ Why reCAPTCHA?

reCAPTCHA helps protect your registration form from:
- **Spam bots** and automated submissions
- **Fake registrations** and duplicate entries
- **Malicious attacks** and form abuse
- **Resource abuse** and server overload

---

## 🚀 Setting Up Google reCAPTCHA

### Step 1: Create Google reCAPTCHA Account
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click "Create" to add a new site

### Step 2: Configure reCAPTCHA
1. **Label**: Enter "Malikhaing Pinoy Expo 2025"
2. **reCAPTCHA type**: Select "reCAPTCHA v2"
3. **Subtype**: Choose "I'm not a robot" Checkbox
4. **Domains**: Add your domains:
   - `localhost` (for development)
   - `microsite-baac6.web.app` (your Firebase hosting)
   - Any other domains you'll use

### Step 3: Get Your Keys
After creating, you'll get:
- **Site Key**: Public key for your frontend
- **Secret Key**: Private key for backend verification (not needed for frontend-only)

### Step 4: Update Configuration
Replace the placeholder in `src/components/RegistrationForm.tsx`:

```typescript
<ReCAPTCHA
  sitekey="YOUR_ACTUAL_SITE_KEY_HERE" // Replace this
  onChange={handleCaptchaChange}
  onExpired={handleCaptchaExpired}
  theme="light"
/>
```

---

## 🧪 Testing reCAPTCHA

### Development Testing
1. **Start your development server**: `npm run dev`
2. **Go to registration form**
3. **Complete the form** with test data
4. **Check reCAPTCHA** - should show "I'm not a robot"
5. **Submit form** - should work only after CAPTCHA completion

### Production Testing
1. **Deploy to Firebase**: `firebase deploy`
2. **Visit live site**: `https://microsite-baac6.web.app`
3. **Test registration** with real CAPTCHA
4. **Verify protection** against bots

---

## 🔧 Configuration Options

### reCAPTCHA Themes
```typescript
// Light theme (default)
theme="light"

// Dark theme
theme="dark"
```

### reCAPTCHA Sizes
```typescript
// Normal size (default)
size="normal"

// Compact size
size="compact"

// Invisible (requires different setup)
size="invisible"
```

### Language Support
```typescript
// English (default)
hl="en"

// Filipino
hl="fil"

// Auto-detect
hl="auto"
```

---

## 🛠️ Advanced Configuration

### Environment Variables
For better security, use environment variables:

1. **Create `.env` file**:
```env
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

2. **Update component**:
```typescript
<ReCAPTCHA
  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
  onChange={handleCaptchaChange}
  onExpired={handleCaptchaExpired}
  theme="light"
/>
```

### Custom Styling
You can customize the reCAPTCHA appearance:

```css
/* Custom reCAPTCHA container */
.recaptcha-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
}
```

---

## 🔍 Troubleshooting

### Common Issues

#### reCAPTCHA Not Loading
- **Check site key**: Verify it's correct
- **Check domains**: Ensure your domain is in the allowed list
- **Check console**: Look for JavaScript errors

#### reCAPTCHA Always Failing
- **Check domain**: Make sure you're on an allowed domain
- **Check network**: Ensure Google services are accessible
- **Check browser**: Try different browser or incognito mode

#### Form Submission Issues
- **Check CAPTCHA state**: Verify `captchaToken` is set
- **Check validation**: Ensure all form fields are valid
- **Check console**: Look for error messages

### Debug Mode
Enable debug logging:

```typescript
const handleCaptchaChange = (token: string | null) => {
  console.log('CAPTCHA token:', token ? 'Valid' : 'Invalid');
  setCaptchaToken(token);
  setCaptchaError(null);
};
```

---

## 📊 Analytics and Monitoring

### reCAPTCHA Analytics
Monitor your reCAPTCHA performance:
1. **Go to reCAPTCHA Admin Console**
2. **View analytics** for your site
3. **Monitor success rates** and bot detection
4. **Adjust settings** based on data

### Key Metrics to Watch
- **Success rate**: Should be >95% for legitimate users
- **Bot detection**: Number of blocked attempts
- **User experience**: Completion time and abandonment

---

## 🔒 Security Best Practices

### Frontend Security
1. **Never expose secret key** in frontend code
2. **Use environment variables** for site keys
3. **Validate on both client and server** (when possible)
4. **Monitor for abuse** and adjust settings

### Additional Protection
Consider implementing:
- **Rate limiting** per IP address
- **Email verification** for registrations
- **Phone verification** for high-value events
- **Manual review** for suspicious registrations

---

## 🎯 Quick Setup Checklist

- [ ] Google reCAPTCHA account created
- [ ] Site configured with correct domains
- [ ] Site key copied and ready
- [ ] Code updated with real site key
- [ ] Development testing completed
- [ ] Production deployment tested
- [ ] Analytics monitoring enabled
- [ ] Security settings reviewed

---

## 📞 Support

### Google reCAPTCHA Support
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Google Cloud Support](https://cloud.google.com/support)

### Application Support
If you encounter issues:
1. Check browser console for errors
2. Verify reCAPTCHA configuration
3. Test on different browsers/devices
4. Check network connectivity
5. Review domain settings

---

## 🚀 Next Steps

After setting up reCAPTCHA:
1. **Monitor performance** for the first few days
2. **Adjust settings** based on user feedback
3. **Consider additional security** measures
4. **Plan for scaling** as event approaches

The reCAPTCHA integration will significantly reduce spam and ensure only legitimate registrations are processed for your event!
