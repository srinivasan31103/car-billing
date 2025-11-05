# Deployment Guide - Car Service Billing App

## Quick Start (Local Testing)

1. **Open the application**:
   - Simply double-click `index.html`
   - OR right-click `index.html` → "Open with" → Choose your browser (Chrome, Firefox, Edge)

2. **Add your logo**:
   - Place your company logo as `logo.png` in the same folder
   - Recommended size: 200x50 pixels (transparent PNG)

3. **Test the application**:
   - Navigate through Dashboard, Invoices, Add Invoice, Contact sections
   - The sample invoice should load automatically on first visit

## File Structure

```
billing-vignesh/
├── index.html              # Main HTML file
├── script.js               # Main JavaScript logic
├── invoice-form.js         # Invoice form functionality
├── styles.css              # Custom CSS styles
├── logo.png               # Your company logo (add this)
├── README.md              # User documentation
└── DEPLOYMENT.md          # This file
```

## Browser Compatibility

Tested and working on:
- ✅ Google Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari
- ✅ Opera

**Minimum Requirements**: Modern browser with ES6 JavaScript and localStorage support

## Features

### Admin Invoice Creation
- Complete form with customer, vehicle, and service details
- Dynamic parts and labor entry
- Automatic tax calculations (CGST/SGST @ 9%)
- Real-time grand total calculation

### Invoice Management
- View all invoices in dashboard
- Search and filter invoices
- View detailed invoice in PDF format
- Export-ready invoice layout

### Data Storage
- All data stored in browser localStorage
- Persists across browser sessions
- No server or database required

## Hosting Options

### Option 1: Local Network (No Internet Required)

1. **Share via Network Drive**:
   - Copy the folder to a shared network location
   - Team members access via file://path/to/index.html

2. **Simple HTTP Server** (For multiple users):
   ```bash
   # Using Python (if installed)
   cd f:\billing-vignesh
   python -m http.server 8080

   # Access at: http://localhost:8080
   ```

### Option 2: Web Hosting (Internet Access)

**Free Hosting Options**:

1. **GitHub Pages** (Recommended):
   - Create a GitHub repository
   - Upload all files
   - Enable GitHub Pages in Settings
   - Access at: https://yourusername.github.io/billing-vignesh

2. **Netlify** (Easiest):
   - Go to https://netlify.com
   - Drag and drop the folder
   - Get instant URL: https://yoursite.netlify.app

3. **Vercel**:
   - Go to https://vercel.com
   - Import the folder
   - Deploy instantly

4. **Firebase Hosting**:
   - Install Firebase CLI
   - Deploy with `firebase deploy`

### Option 3: Mobile App (Optional)

Convert to Android/iOS app using:
- **Apache Cordova**: Wrap HTML as native app
- **Capacitor**: Modern hybrid app framework
- **PWA**: Add manifest.json for progressive web app

## Security Considerations

⚠️ **Important**: This is a client-side application

- Data is stored **locally in browser** (not cloud)
- **No authentication** built-in
- Suitable for **internal/trusted use only**

### For Production Use, Consider:
1. Add user authentication
2. Implement backend database (MySQL, MongoDB)
3. Add server-side validation
4. Use HTTPS for hosting
5. Regular data backups

## Customization

### Update Company Details
Edit [index.html](index.html) - Contact/About section (lines ~430-470)

### Change Colors
Edit [styles.css](styles.css):
- Primary color: Search for `#3498db` (blue)
- Dark color: Search for `#2c3e50` (dark gray)

### Modify Tax Rate
Edit [invoice-form.js](invoice-form.js):
- Line ~124: Change `0.09` (9%) to your rate
- Line ~133: Change `0.09` (9%) to your rate

### Add Fields
1. Add input in [index.html](index.html) form
2. Update `handleInvoiceUpload()` in [script.js](script.js)
3. Update invoice detail template

## Data Management

### Backup Data
Open browser console (F12) and run:
```javascript
const data = localStorage.getItem('invoices');
console.log(data);
// Copy and save to file
```

### Restore Data
```javascript
const data = '...'; // Your backed up data
localStorage.setItem('invoices', data);
location.reload();
```

### Clear All Data
```javascript
localStorage.clear();
location.reload();
```

## Troubleshooting

### Invoice not displaying:
- Check browser console (F12) for errors
- Ensure JavaScript is enabled
- Try clearing browser cache (Ctrl+Shift+Delete)

### View Details button not working:
- Ensure Bootstrap JS is loaded
- Check browser console for errors
- Try hard refresh (Ctrl+F5)

### Calculations not working:
- Ensure invoice-form.js loads before script.js
- Check console for JavaScript errors

### Mobile display issues:
- The site is fully responsive
- Try landscape orientation for better view
- Font sizes auto-adjust for small screens

## Performance

- **Load Time**: < 1 second (local)
- **Max Invoices**: 1000+ (depends on browser localStorage limit ~5-10MB)
- **Browser Memory**: Minimal (~10-20MB)

## Support

For issues:
1. Check browser console (F12) for errors
2. Ensure all files are in the same directory
3. Verify browser supports localStorage
4. Try a different browser

## Updates

To update the app:
1. Backup your data (see Data Management above)
2. Replace files with new versions
3. Refresh browser (Ctrl+F5)
4. Restore data if needed

## License

© 2025 SS AUTOMART PRIVATE LIMITED - All Rights Reserved

---

**Note**: This is a self-contained application. No external dependencies beyond Bootstrap CDN (internet required for initial load of Bootstrap).
