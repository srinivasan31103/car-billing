# Troubleshooting - View Button Not Working

## Quick Fix Steps

### Step 1: Check Browser Console
1. Open the website ([index.html](index.html))
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Click the "View" or "View Details" button
5. Look for error messages

### Expected Console Output:
```
viewInvoiceDetail called with ID: INV1730000000001
Invoice found: {id: "INV...", invoiceNumber: "B202501926", ...}
Modal displayed successfully
```

### Common Errors and Solutions:

#### Error 1: "bootstrap is not defined"
**Cause**: Bootstrap JavaScript not loading

**Fix**: Check internet connection (Bootstrap loads from CDN)

**Offline Fix**: Download Bootstrap locally
```html
<!-- Replace in index.html line 525 -->
<script src="bootstrap.bundle.min.js"></script>
```

#### Error 2: "invoiceDetailModal element not found"
**Cause**: Modal HTML missing

**Fix**: Verify modal exists in index.html around line 494-510

#### Error 3: "Invoice not found"
**Cause**: Invoice ID mismatch

**Fix**: Clear localStorage and reload
```javascript
// Run in console:
localStorage.clear();
location.reload();
```

#### Error 4: Button click does nothing
**Cause**: JavaScript not loading

**Fix**:
1. Check if script.js and invoice-form.js are in same folder
2. Open browser console - any errors?
3. Try hard refresh: **Ctrl + F5**

---

## Manual Test

### Test 1: Check if JavaScript is Working

1. Open browser console (F12)
2. Type and press Enter:
```javascript
viewInvoiceDetail('INV1730000000001')
```
3. Modal should open with sample invoice

### Test 2: Check Bootstrap

Type in console:
```javascript
typeof bootstrap
```
Should return: `"object"`

If it returns `"undefined"`, Bootstrap isn't loaded.

### Test 3: Check Modal HTML

Type in console:
```javascript
document.getElementById('invoiceDetailModal')
```
Should return: `<div class="modal fade" id="invoiceDetailModal"...>`

If it returns `null`, modal HTML is missing.

### Test 4: Check Invoices Array

Type in console:
```javascript
invoices
```
Should return: `Array [ {id: "INV...", ...} ]`

If it returns `[]`, no invoices exist.

---

## Alternative: Force Reload Everything

If nothing works, try these steps:

1. **Clear Browser Cache**:
   - Press **Ctrl + Shift + Delete**
   - Clear "Cached images and files"
   - Clear "Cookies and site data"

2. **Clear LocalStorage**:
   - Open Console (F12)
   - Type: `localStorage.clear()`
   - Press Enter

3. **Hard Refresh**:
   - Press **Ctrl + F5** (Windows)
   - Or **Cmd + Shift + R** (Mac)

4. **Try Different Browser**:
   - Chrome
   - Firefox
   - Edge

---

## Still Not Working?

### Create a Simple Test File

Save this as `test-modal.html` in the same folder:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Modal Test</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>Modal Test</h1>
        <button class="btn btn-primary" onclick="testModal()">Test Modal</button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="testModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Test Modal</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>If you see this, Bootstrap modals are working!</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function testModal() {
            const modal = new bootstrap.Modal(document.getElementById('testModal'));
            modal.show();
        }
    </script>
</body>
</html>
```

**Open test-modal.html**:
- If button works → Bootstrap is fine, issue is in main app
- If button doesn't work → Bootstrap/Internet issue

---

## Check File Paths

Ensure all files are in the **same directory**:

```
f:\billing-vignesh\
├── index.html          ✓ Must be here
├── script.js           ✓ Must be here
├── invoice-form.js     ✓ Must be here
├── styles.css          ✓ Must be here
└── logo.png            (optional)
```

---

## Verify Script Loading Order

In index.html (lines 525-527), ensure this order:
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="invoice-form.js"></script>
<script src="script.js"></script>
```

**Important**: Bootstrap must load BEFORE invoice-form.js and script.js

---

## Emergency Fallback: Use Alert Instead of Modal

If modal absolutely won't work, temporarily add this to script.js:

```javascript
// Replace viewInvoiceDetail function with:
function viewInvoiceDetail(invoiceId) {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
        alert('Invoice not found!');
        return;
    }

    // Show invoice data in alert (temporary)
    const summary = `
Invoice: ${invoice.invoiceNumber}
Customer: ${invoice.customerName}
Vehicle: ${invoice.vehicleNumber}
Total: ₹${invoice.grandTotalRounded}
    `;

    alert(summary);

    // Then try modal
    try {
        const detailHtml = generateInvoiceDetailHTML(invoice);
        document.getElementById('invoiceDetailContent').innerHTML = detailHtml;
        const modal = new bootstrap.Modal(document.getElementById('invoiceDetailModal'));
        modal.show();
    } catch(e) {
        console.error('Modal error:', e);
    }
}
```

---

## Contact for Support

If none of these work, provide:
1. Browser name and version
2. Console errors (screenshot)
3. Does test-modal.html work?

---

## Quick Checklist ✓

- [ ] Internet connection working (for Bootstrap CDN)
- [ ] All 4 files in same folder (index.html, script.js, invoice-form.js, styles.css)
- [ ] Opened index.html in browser (not just viewing in text editor)
- [ ] Pressed F12 and checked Console for errors
- [ ] Tried Ctrl + F5 hard refresh
- [ ] Tested in different browser (Chrome/Firefox/Edge)
- [ ] Cleared browser cache and localStorage
- [ ] Sample invoice appears on Dashboard
- [ ] Can click on the View button (button exists)

**If all checked and still not working, run test-modal.html to isolate the issue.**
