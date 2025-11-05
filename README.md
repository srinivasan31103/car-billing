# Car Service Billing Website

A clean, professional car service billing website for internal client use. This application allows you to manage service invoices, view customer details, and track vehicle service history.

## Features

- **Dashboard**: Overview of total invoices, monthly statistics, and revenue tracking
- **Invoice Management**: Upload, view, and search service invoices
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Clean blue, white, and grey color scheme with Bootstrap styling
- **Data Persistence**: Uses browser localStorage to save invoice data
- **Invoice Details**: View comprehensive invoice information including parts, labor, and taxes

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5.3.0
- LocalStorage API

## File Structure

```
billing-vignesh/
├── index.html          # Main HTML file with all pages
├── styles.css          # Custom CSS styling
├── script.js           # JavaScript for functionality
├── logo.png           # Company logo (your logo file)
└── README.md          # This file
```

## Installation & Usage

1. **Download the files**: Ensure all files are in the same directory
2. **Add your logo**: Place your `logo.png` file in the same folder
3. **Open the website**: Double-click `index.html` or open it in your web browser

No server setup or installation required - this is a fully client-side application!

## How to Use

### Creating a New Invoice (Admin)

The **Add Invoice** section provides a comprehensive form for admins to create complete invoices with all billing details:

1. Click on **Add Invoice** in the navigation menu
2. Fill in all sections:

   **Invoice Details:**
   - Invoice Number, Date, Part Invoice Number, Labor Invoice Number
   - Repair Order Number and Date

   **Customer Details:**
   - Name, Contact Number, Address, City, State, Pin Code, GSTIN

   **Vehicle Details:**
   - Registration Number, Model/Trim, Fuel Type, Chassis Number, Kilometers

   **Service Details:**
   - Service Advisor Name and Number, Place of Supply

   **Parts:**
   - Click "+ Add Part" to add rows
   - Enter: Part Code, Description, HSN/SAC, Tax%, Qty, Rate, Discount
   - Amount auto-calculates for each row

   **Labor:**
   - Click "+ Add Labor" to add rows
   - Enter: OP Code, Description, HSN/SAC, Tax%, Qty, Rate, Discount
   - Amount auto-calculates for each row

   **Additional Information:**
   - Observations, Deferred Jobs, Repair Order Type

3. The **Summary** section auto-calculates:
   - Parts Subtotal, CGST, SGST, Total
   - Labor Subtotal, CGST, SGST, Total
   - **Grand Total (Rounded)**

4. Click **Create Invoice** button

All calculations (line items, taxes, grand total) are automated. The invoice will be saved and displayed in the exact PDF format when viewed.

### Viewing Invoices

1. Go to **Dashboard** to see recent invoices and statistics
2. Go to **Invoices** to see all invoices in a table format
3. Use the search box to filter invoices by number, customer name, or vehicle number
4. Click **View Details** to see comprehensive invoice information

### Dashboard Statistics

The dashboard displays:
- Total number of invoices
- Invoices uploaded this month
- Total revenue from all invoices
- Average invoice amount

## Customization

### Change Company Details

Edit the **Contact/About** section in [index.html](index.html) (around line 200) to update:
- Workshop name
- Address
- Phone number
- Email
- GSTIN

### Change Colors

Edit [styles.css](styles.css) to customize:
- Header gradient: `.header-section` (line 15)
- Primary button color: `.btn-primary` (line 220)
- Accent colors throughout

### Add Your Logo

Replace `logo.png` with your company logo. Recommended size: 200x50 pixels (transparent PNG).

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

Modern browsers with ES6 and localStorage support required.

## Data Storage

Invoice data is stored in the browser's localStorage. This means:
- Data persists across browser sessions
- Data is stored locally on the user's computer
- Clearing browser data will delete all invoices
- Data is not shared between different browsers or devices

### Export Data (Optional Enhancement)

For production use, consider implementing:
- Backend database (MySQL, PostgreSQL, MongoDB)
- Server-side processing (Node.js, PHP, Python)
- PDF parsing for automatic data extraction
- Cloud storage for invoice PDFs

## Sample Invoice

The application includes a sample invoice based on the provided PDF (`SM_S4840_B202501926.pdf`) for demonstration purposes.

## Security Notes

This is designed for internal use only:
- No authentication/authorization implemented
- Data stored in browser localStorage (not secure for sensitive data)
- No server-side validation
- Not suitable for public deployment without additional security measures

## Future Enhancements

Potential features to add:
- User authentication
- Database integration
- Automatic PDF data extraction
- Invoice PDF generation
- Email notifications
- Advanced reporting and analytics
- Multi-user support
- Data backup and export

## Support

For issues or questions, contact the development team.

## License

© 2025 SS AUTOMART PRIVATE LIMITED - All Rights Reserved

---

**Note**: This is an internal tool. Do not deploy publicly without implementing proper security measures, authentication, and data protection.
