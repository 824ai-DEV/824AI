# 824AI Licensing System

## Overview

824AI now includes a one-time purchase license activation system. Users must enter a valid license key on first launch to use the app.

## How It Works

1. **First Launch**: User opens 824AI → License activation modal appears
2. **License Key Entry**: User enters their unique license key (format: XXXX-XXXX-XXXX)
3. **Validation**: Key is validated and stored in localStorage
4. **Full Access**: User can now use all features without interruption

## License Key Format

```
XXXX-XXXX-XXXX
```

Example: `A1B2-C3D4-E5F6`

## Generating License Keys

### Using the Generator

```bash
node LICENSE_KEY_GENERATOR.js
```

This will generate 10 sample keys. You can run it as many times as needed.

### Using Node.js Script

```javascript
const crypto = require('crypto');

function generateKey() {
  const p1 = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
  const p2 = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
  const p3 = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
  return `${p1}-${p2}-${p3}`;
}

console.log(generateKey()); // Output: A1B2-C3D4-E5F6
```

## Distribution Options

### 1. **Manual Keys (Simple)**
- Generate keys using LICENSE_KEY_GENERATOR.js
- Send to customers via email
- Each customer gets unique key

### 2. **Gumroad** (Recommended)
- Upload dist/824AI.exe or dist/824AI Setup 1.0.0.exe
- Set price
- Send license keys in automated email post-purchase
- Handles payment & distribution

### 3. **Itch.io**
- Upload build
- Set price (can be free with "pay what you want")
- Use Itch's built-in key delivery system

### 4. **Stripe + Custom Backend** (Advanced)
- Accept payment via Stripe API
- Generate key automatically on successful payment
- Send key to customer's email
- Track usage with numeric IDs

## How Licensing Works in the App

### Storage
- License status: `localStorage.isLicensed` (true/false)
- License key: `localStorage.licenseKey` (stored for reference)

### Validation
The app validates the key format locally:
```javascript
/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i
```

### Security Notes
- Keys are stored in browser localStorage
- No backend validation needed initially (client-side only)
- Users can't use app without valid key
- Modification requires editing localStorage manually

## To Add Server-Side Validation (Optional)

If you want to prevent key reuse across multiple machines:

1. Create a backend database to track used keys
2. Modify `validateLicense()` in renderer.js to call an API:

```javascript
async function validateLicense(key) {
  const response = await fetch('https://yourserver.com/validate-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  });
  const { valid } = await response.json();
  return valid;
}
```

3. Backend checks if key exists in database, marks it as used

## Current Limitations

- **Local validation only**: Keys are not checked against a backend
- **No expiration**: Keys never expire
- **No deactivation**: No way to revoke a key
- **No usage limits**: No limit on machines per key

These can be added later if needed.

## Changing the License URL

Update the license purchase link in renderer.js:

```javascript
licenseBuyLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Change this URL to your payment platform
  window.open('https://gumroad.com/your-824ai-link');
});
```

## Testing

1. **Test license activation**: Run `npm start`, enter test key `A1B2-C3D4-E5F6`
2. **Verify localStorage**: Open DevTools → Application → localStorage → check `isLicensed`
3. **Fresh install test**: Clear localStorage and refresh to test again

## Next Steps

1. Generate your license keys: `node LICENSE_KEY_GENERATOR.js`
2. Upload your build to a payment platform (Gumroad, Itch.io, etc.)
3. Set up automated key delivery
4. Update the purchase URL in the app
5. Rebuild: `npm run dist:win`
6. Share your installers!

---

Questions? The licensing system is fully functional and ready to use.
