# Testing Checklist - Car Service Billing App

## Pre-Testing Setup
- [ ] All files are in the same directory
- [ ] logo.png is present (or placeholder will show)
- [ ] Open index.html in browser

## 1. Dashboard Tests

### Load & Display
- [ ] Dashboard loads without errors
- [ ] Sample invoice is pre-loaded
- [ ] Statistics show:
  - Total Invoices: 1
  - This Month: 1
  - Total Revenue: ₹11,625.00
  - Avg. Invoice: ₹11,625.00
- [ ] Recent invoices table displays
- [ ] Sample invoice shows: B202501926, JANANI L K, TN39DX6478

### View Invoice
- [ ] Click "View" button on sample invoice
- [ ] Modal opens with invoice details
- [ ] All sections display:
  - Dealer Details
  - Customer Details (JANANI L K, Palladam)
  - Vehicle Details (TN39DX6478, Creta, Petrol, 72737.0 km)
  - Invoice Details (B202501926, dates, advisor)
  - Parts table (10 items)
  - Labor table (4 items)
  - Summary with taxes
  - Grand Total: ₹11,625
  - Amount in words: "Rupees Eleven Thousand Six Hundred Twenty Five Only"
  - Observations, Deferred Jobs, Customer Advisory
- [ ] Close button works
- [ ] Print button opens print dialog

## 2. Invoices Page Tests

### Navigation
- [ ] Click "Invoices" in nav menu
- [ ] Page changes to Invoices section
- [ ] Nav link becomes active (blue background)

### Invoice List
- [ ] Sample invoice displays in table
- [ ] Table shows: Invoice No, Customer, Vehicle, Date, Amount, Status, Action
- [ ] Status badge shows "Paid" in green
- [ ] Amount displays correctly: ₹11,625

### Search Function
- [ ] Type "B202501926" → invoice appears
- [ ] Type "JANANI" → invoice appears
- [ ] Type "TN39DX6478" → invoice appears
- [ ] Type random text → "No matching invoices found"
- [ ] Clear search → invoice reappears

### View Details
- [ ] Click "View Details" button
- [ ] Modal opens with complete invoice
- [ ] All data matches dashboard view

## 3. Add Invoice (Admin Form) Tests

### Navigation
- [ ] Click "Add Invoice" in nav menu
- [ ] Form page loads
- [ ] All sections visible:
  - Invoice Details
  - Customer Details
  - Vehicle Details
  - Service Details
  - Parts (with + Add Part button)
  - Labour and Services (with + Add Labor button)
  - Additional Information
  - Summary (Auto-calculated)

### Initial State
- [ ] Parts table is empty or has 1 row
- [ ] Labor table is empty or has 1 row
- [ ] Summary shows all ₹0.00
- [ ] Grand Total shows ₹0
- [ ] Service Advisor pre-filled: "Vignesh M"
- [ ] Advisor Number pre-filled: "7867044453"
- [ ] Place of Supply pre-filled: "Tamilnadu"
- [ ] State pre-filled: "TAMIL NADU"

### Parts Entry
- [ ] Click "+ Add Part" button
- [ ] New row appears with input fields
- [ ] Enter test data:
  - Code: TEST001
  - Description: Test Part
  - HSN: 12345678
  - Tax%: 18
  - Qty: 2
  - Rate: 500
  - Discount: 0
- [ ] Amount auto-calculates to 1000.00
- [ ] Parts SubTotal updates in summary: ₹1,000.00
- [ ] Parts CGST updates: ₹90.00 (9%)
- [ ] Parts SGST updates: ₹90.00 (9%)
- [ ] Parts Total: ₹1,180.00
- [ ] Grand Total updates: ₹1,180

### Labor Entry
- [ ] Click "+ Add Labor" button
- [ ] New row appears
- [ ] Enter test data:
  - Code: LAB001
  - Description: Test Service
  - HSN: 998729
  - Tax%: 18
  - Qty: 1
  - Rate: 300
  - Discount: 0
- [ ] Amount auto-calculates to 300.00
- [ ] Labor SubTotal updates: ₹300.00
- [ ] Labor CGST updates: ₹27.00
- [ ] Labor SGST updates: ₹27.00
- [ ] Labor Total: ₹354.00
- [ ] Grand Total updates: ₹1,534

### Calculations
- [ ] Change Qty in part row → Amount recalculates
- [ ] Change Rate → Amount recalculates
- [ ] Add Discount → Amount reduces correctly
- [ ] All summary totals update automatically
- [ ] Grand Total rounds correctly

### Delete Rows
- [ ] Click × button on a part row → row removed
- [ ] Summary recalculates
- [ ] Click × button on labor row → row removed
- [ ] Summary recalculates

### Form Validation
- [ ] Try to submit empty form
- [ ] Error: "Please fill in all required fields (marked with *)"
- [ ] Fill only Invoice Number → still error
- [ ] Fill Invoice Number, Date, Customer, Vehicle → form validates
- [ ] Try to submit without parts/labor
- [ ] Error: "Please add at least one part or labor item"

### Complete Submission
Fill in complete test invoice:
- [ ] Invoice Number: TEST001
- [ ] Invoice Date: (today's date/time)
- [ ] Customer Name: Test Customer
- [ ] Vehicle Number: TN00XX0000
- [ ] Add 1 part with qty, rate
- [ ] Add 1 labor with qty, rate
- [ ] Fill additional fields (optional)
- [ ] Click "Create Invoice" button
- [ ] Success message appears: "Invoice created successfully! Total: ₹..."
- [ ] Form resets
- [ ] Parts/Labor tables clear
- [ ] New empty rows appear
- [ ] Page scrolls to top

### Verify New Invoice
- [ ] Go to Dashboard
- [ ] Statistics updated:
  - Total Invoices: 2
  - Total Revenue increased
- [ ] New invoice appears in Recent Invoices
- [ ] Click "View" on new invoice
- [ ] All entered data displays correctly
- [ ] Calculations match

## 4. Contact/About Page Tests

- [ ] Click "Contact / About" in nav
- [ ] Page displays company information
- [ ] "About Us" section shows
- [ ] "Our Services" list displays
- [ ] Contact information shows:
  - SS AUTOMART PRIVATE LIMITED
  - Address, Phone, Email, GSTIN

## 5. Responsive Design Tests

### Desktop (1920x1080)
- [ ] All sections display properly
- [ ] Tables are readable
- [ ] No horizontal scroll
- [ ] Logo and header look good

### Tablet (768x1024)
- [ ] Navigation collapses to hamburger menu
- [ ] Form fields stack appropriately
- [ ] Tables are scrollable
- [ ] Summary sections stack vertically

### Mobile (375x667)
- [ ] All content is accessible
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable
- [ ] Form inputs are usable
- [ ] Tables scroll horizontally
- [ ] Invoice modal fits screen

## 6. Browser Compatibility Tests

Test in each browser:

### Google Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Forms submit correctly
- [ ] Modal displays properly

### Microsoft Edge
- [ ] Same functionality as Chrome

### Mozilla Firefox
- [ ] All features work
- [ ] No warnings

### Safari (if available)
- [ ] iOS/Mac compatible

## 7. Data Persistence Tests

### LocalStorage
- [ ] Create an invoice
- [ ] Close browser completely
- [ ] Reopen index.html
- [ ] Invoice still exists in list
- [ ] Statistics still correct
- [ ] Can view invoice details

### Multiple Invoices
- [ ] Create 5 different invoices
- [ ] All appear in dashboard
- [ ] All searchable in Invoices page
- [ ] Statistics update correctly

## 8. Performance Tests

- [ ] Dashboard loads in < 2 seconds
- [ ] Forms are responsive (no lag)
- [ ] Calculations happen instantly
- [ ] Modal opens quickly
- [ ] Search results appear immediately
- [ ] Can handle 50+ invoices without slowdown

## 9. Print Tests

- [ ] Open invoice in modal
- [ ] Click "Print" button
- [ ] Print preview shows invoice only (no nav/header)
- [ ] Layout is clean for printing
- [ ] All data is visible

## 10. Edge Cases

### Empty States
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Refresh page
- [ ] Dashboard shows 0 invoices
- [ ] "No invoices uploaded yet" message
- [ ] Can still create new invoice

### Invalid Data
- [ ] Enter negative numbers in qty/rate → should accept but calculate
- [ ] Enter 0 in rate → Amount should be 0
- [ ] Enter very large numbers → should handle (test with 999999)

### Long Text
- [ ] Enter long customer name (50+ chars) → should display/wrap
- [ ] Enter long part description → should display in table

## Test Results

**Date Tested**: ___________
**Tested By**: ___________
**Browser**: ___________
**Status**: PASS ☐ / FAIL ☐

**Issues Found**:
1. _______________________
2. _______________________
3. _______________________

**Notes**:
_________________________________
_________________________________
_________________________________

## Success Criteria

All checkboxes must be checked for application to be considered production-ready:
- ✅ No JavaScript console errors
- ✅ All forms submit successfully
- ✅ Calculations are accurate
- ✅ Data persists across sessions
- ✅ Responsive on all devices
- ✅ All buttons and links functional
- ✅ Invoices display correctly in PDF format
