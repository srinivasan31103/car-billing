// Invoice Management System - Complete PDF Format

// Sample data structure matching the PDF invoice format
let invoices = [];

// Load invoices from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadInvoicesFromStorage();
    updateDashboard();
    renderInvoicesList();
    renderRecentInvoices();

    // Set default active section
    showSection('dashboard');

    // Add invoice form submission handler
    document.getElementById('invoiceUploadForm').addEventListener('submit', handleInvoiceUpload);

    // Add search functionality
    document.getElementById('searchInvoice').addEventListener('input', handleSearch);

    // Move modal to body for proper display
    const modalEl = document.getElementById('invoiceDetailModal');
    if (modalEl) {
        document.body.appendChild(modalEl);
    }

    // Add sample invoice for demo purposes
    if (invoices.length === 0) {
        addSampleInvoiceWithFullData();
    }
});

// Navigation between sections
function showSection(sectionId, element) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else {
        document.querySelector(`a[href="#"][onclick*="${sectionId}"]`)?.classList.add('active');
    }

    // Refresh data when showing certain sections
    if (sectionId === 'dashboard') {
        updateDashboard();
        renderRecentInvoices();
    } else if (sectionId === 'invoices') {
        renderInvoicesList();
    }
}

// Handle comprehensive invoice form submission
function handleInvoiceUpload(event) {
    event.preventDefault();

    // Collect all form data
    const invoiceNumber = document.getElementById('invoiceNumber').value.trim();
    const invoiceDate = document.getElementById('invoiceDate').value;
    const customerName = document.getElementById('customerName').value.trim();
    const vehicleNumber = document.getElementById('vehicleNumber').value.trim();

    // Validate required fields
    if (!invoiceNumber || !invoiceDate || !customerName || !vehicleNumber) {
        showMessage('Please fill in all required fields (marked with *)', 'danger');
        return;
    }

    // Collect parts and labor data
    const parts = collectPartsData();
    const labor = collectLaborData();

    if (parts.length === 0 && labor.length === 0) {
        showMessage('Please add at least one part or labor item', 'danger');
        return;
    }

    // Calculate totals
    const partSubTotal = parts.reduce((sum, part) => sum + part.amount, 0);
    const laborSubTotal = labor.reduce((sum, item) => sum + item.amount, 0);

    const cgstOnPart = partSubTotal * 0.09;
    const sgstOnPart = partSubTotal * 0.09;
    const cgstOnLabor = laborSubTotal * 0.09;
    const sgstOnLabor = laborSubTotal * 0.09;

    const totalAmount = partSubTotal + laborSubTotal + cgstOnPart + sgstOnPart + cgstOnLabor + sgstOnLabor;
    const grandTotalRounded = Math.round(totalAmount);

    // Create comprehensive invoice object
    const invoice = {
        id: 'INV' + Date.now(),
        invoiceNumber: invoiceNumber,
        customerName: customerName,
        customerAddress: document.getElementById('customerAddress').value.trim(),
        customerCity: document.getElementById('customerCity').value.trim(),
        customerState: document.getElementById('customerState').value.trim(),
        customerPinCode: document.getElementById('customerPinCode').value.trim(),
        customerContact: document.getElementById('customerContact').value.trim(),
        customerGSTIN: document.getElementById('customerGSTIN').value.trim(),
        vehicleNumber: vehicleNumber,
        vehicleModel: document.getElementById('vehicleModel').value.trim(),
        vehicleFuelType: document.getElementById('vehicleFuelType').value,
        vehicleChassisNo: document.getElementById('vehicleChassisNo').value.trim(),
        vehicleKilometers: document.getElementById('vehicleKilometers').value,
        invoiceDate: invoiceDate,
        repairOrderNumber: document.getElementById('repairOrderNumber').value.trim(),
        repairOrderDate: document.getElementById('repairOrderDate').value,
        repairOrderType: document.getElementById('repairOrderType').value,
        placeOfSupply: document.getElementById('placeOfSupply').value.trim(),
        serviceAdvisor: document.getElementById('serviceAdvisor').value.trim(),
        serviceAdvisorNumber: document.getElementById('serviceAdvisorNumber').value.trim(),
        partInvoiceNumber: document.getElementById('partInvoiceNumber').value.trim(),
        laborInvoiceNumber: document.getElementById('laborInvoiceNumber').value.trim(),
        parts: parts,
        labor: labor,
        partSubTotal: partSubTotal,
        laborSubTotal: laborSubTotal,
        cgstOnPart: cgstOnPart,
        sgstOnPart: sgstOnPart,
        cgstOnLabor: cgstOnLabor,
        sgstOnLabor: sgstOnLabor,
        totalAmount: totalAmount,
        grandTotalRounded: grandTotalRounded,
        couponDiscount: 0,
        discount: 0,
        amcDiscount: 0,
        tcsTax: 0,
        observations: document.getElementById('observations').value.trim(),
        deferredJobs: document.getElementById('deferredJobs').value.trim(),
        uploadDate: new Date().toISOString(),
        fileName: '',
        status: 'paid'
    };

    // Add to invoices array
    invoices.push(invoice);

    // Save to localStorage
    saveInvoicesToStorage();

    // Show success message
    showMessage('Invoice created successfully! Total: ₹' + grandTotalRounded.toLocaleString('en-IN'), 'success');

    // Reset form
    document.getElementById('invoiceUploadForm').reset();

    // Clear parts and labor tables
    document.getElementById('partsTableBody').innerHTML = '';
    document.getElementById('laborTableBody').innerHTML = '';

    // Reset counters
    if (typeof partRowCounter !== 'undefined') partRowCounter = 0;
    if (typeof laborRowCounter !== 'undefined') laborRowCounter = 0;

    // Add initial rows again
    setTimeout(() => {
        addPartRow();
        addLaborRow();
    }, 100);

    // Update dashboard and all invoice lists
    updateDashboard();
    renderRecentInvoices();
    renderInvoicesList();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show message to user
function showMessage(message, type) {
    const messageDiv = document.getElementById('uploadMessage');
    messageDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// Update dashboard statistics
function updateDashboard() {
    const totalInvoices = invoices.length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.invoiceDate);
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
    }).length;

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const avgInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    document.getElementById('totalInvoices').textContent = totalInvoices;
    document.getElementById('thisMonth').textContent = thisMonthInvoices;
    document.getElementById('totalRevenue').textContent = '₹' + formatNumber(totalRevenue);
    document.getElementById('avgInvoice').textContent = '₹' + formatNumber(avgInvoice);
}

// Render recent invoices on dashboard
function renderRecentInvoices() {
    const container = document.getElementById('recentInvoicesList');

    if (invoices.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">No invoices uploaded yet</p>';
        return;
    }

    // Get last 5 invoices
    const recentInvoices = [...invoices].sort((a, b) =>
        new Date(b.uploadDate) - new Date(a.uploadDate)
    ).slice(0, 5);

    let html = `
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Invoice No.</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    recentInvoices.forEach(invoice => {
        html += `
            <tr>
                <td><strong>${invoice.invoiceNumber}</strong></td>
                <td>${invoice.customerName}</td>
                <td>${invoice.vehicleNumber}</td>
                <td>${formatDate(invoice.invoiceDate)}</td>
                <td><strong>₹${formatNumber(invoice.totalAmount)}</strong></td>
                <td><button class="btn-view" onclick="viewInvoiceDetail('${invoice.id}')">View</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Render all invoices list
function renderInvoicesList() {
    const container = document.getElementById('invoicesList');

    if (invoices.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">No invoices available</p>';
        return;
    }

    const sortedInvoices = [...invoices].sort((a, b) =>
        new Date(b.invoiceDate) - new Date(a.invoiceDate)
    );

    let html = `
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Invoice No.</th>
                    <th>Customer Name</th>
                    <th>Vehicle No.</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedInvoices.forEach(invoice => {
        html += `
            <tr>
                <td><strong>${invoice.invoiceNumber}</strong></td>
                <td>${invoice.customerName}</td>
                <td>${invoice.vehicleNumber}</td>
                <td>${formatDate(invoice.invoiceDate)}</td>
                <td><strong>₹${formatNumber(invoice.totalAmount)}</strong></td>
                <td><span class="badge badge-success">Paid</span></td>
                <td><button class="btn-view" onclick="viewInvoiceDetail('${invoice.id}')">View Details</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Search invoices
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm === '') {
        renderInvoicesList();
        return;
    }

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm) ||
        inv.customerName.toLowerCase().includes(searchTerm) ||
        inv.vehicleNumber.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('invoicesList');

    if (filteredInvoices.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">No matching invoices found</p>';
        return;
    }

    let html = `
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Invoice No.</th>
                    <th>Customer Name</th>
                    <th>Vehicle No.</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredInvoices.forEach(invoice => {
        html += `
            <tr>
                <td><strong>${invoice.invoiceNumber}</strong></td>
                <td>${invoice.customerName}</td>
                <td>${invoice.vehicleNumber}</td>
                <td>${formatDate(invoice.invoiceDate)}</td>
                <td><strong>₹${formatNumber(invoice.totalAmount)}</strong></td>
                <td><span class="badge badge-success">Paid</span></td>
                <td><button class="btn-view" onclick="viewInvoiceDetail('${invoice.id}')">View Details</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// View invoice detail in modal - EXACT PDF FORMAT
function viewInvoiceDetail(invoiceId) {
    console.log('=== viewInvoiceDetail called ===');
    console.log('Invoice ID:', invoiceId);
    console.log('Total invoices in array:', invoices.length);
    console.log('All invoice IDs:', invoices.map(inv => inv.id));

    const invoice = invoices.find(inv => inv.id === invoiceId);

    if (!invoice) {
        console.error('Invoice not found with ID:', invoiceId);
        console.error('Available invoices:', invoices);
        alert('Invoice not found! ID: ' + invoiceId);
        return;
    }

    console.log('Invoice found:', invoice);
    console.log('Invoice has parts:', invoice.parts ? invoice.parts.length : 0);
    console.log('Invoice has labor:', invoice.labor ? invoice.labor.length : 0);

    try {
        const detailHtml = generateInvoiceDetailHTML(invoice);
        console.log('HTML generated, length:', detailHtml.length);

        const contentElement = document.getElementById('invoiceDetailContent');

        if (!contentElement) {
            console.error('invoiceDetailContent element not found');
            alert('Error: Modal content element not found');
            return;
        }

        contentElement.innerHTML = detailHtml;
        console.log('Content inserted into modal');

        const modalElement = document.getElementById('invoiceDetailModal');
        if (!modalElement) {
            console.error('invoiceDetailModal element not found');
            alert('Error: Modal element not found');
            return;
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        console.log('Modal displayed successfully');
    } catch (error) {
        console.error('Error in viewInvoiceDetail:', error);
        console.error('Error stack:', error.stack);
        alert('Error displaying invoice: ' + error.message + '\n\nCheck console for details');
    }
}

// Generate detailed invoice HTML matching PDF format exactly
function generateInvoiceDetailHTML(invoice) {
    let html = `
        <div class="invoice-pdf-format">
            <div class="invoice-header-section" style="position: relative;">
                <img src="logo.png" alt="Company Logo" style="position: absolute; top: 0; left: 0; max-height: 80px;">
                <h2 class="text-center">Invoice</h2>
                <h4 class="text-center">Invoice Summary</h4>
            </div>

            <!-- Dealer Details -->
            <div class="section-block">
                <h5 class="section-heading">Dealer Details</h5>
                <div class="row">
                    <div class="col-md-6">
                        <div class="info-row"><span class="label-text">Dealer Name:</span> SS AUTOMART PRIVATE LIMITED</div>
                        <div class="info-row"><span class="label-text">City:</span> Tirupur</div>
                        <div class="info-row"><span class="label-text">Pin Code:</span> 641652</div>
                        <div class="info-row"><span class="label-text">Email ID:</span> gm.service@ssauto.co.in</div>
                    </div>
                    <div class="col-md-6">
                        <div class="info-row"><span class="label-text">Dealer Address:</span> Opp to Vivekananda Sevalayam, S.F No: 501/1, TIRUPPUR</div>
                        <div class="info-row"><span class="label-text">State:</span> Tamilnadu</div>
                        <div class="info-row"><span class="label-text">Contact No:</span> 7867044430</div>
                        <div class="info-row"><span class="label-text">GSTIN:</span> 33AATCS5542D1Z9</div>
                    </div>
                </div>
            </div>

            <!-- Customer, Vehicle, and Invoice Details in 3 columns -->
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="section-block">
                        <h5 class="section-heading">Customer Details</h5>
                        <div class="info-row"><span class="label-text">Name:</span> ${invoice.customerName}</div>
                        ${invoice.customerAddress ? `<div class="info-row"><span class="label-text">Address:</span> ${invoice.customerAddress}</div>` : ''}
                        ${invoice.customerCity ? `<div class="info-row"><span class="label-text">City:</span> ${invoice.customerCity}</div>` : '<div class="info-row"><span class="label-text">City:</span> Palladam</div>'}
                        ${invoice.customerState ? `<div class="info-row"><span class="label-text">State:</span> ${invoice.customerState}</div>` : '<div class="info-row"><span class="label-text">State:</span> TAMIL NADU</div>'}
                        ${invoice.customerPinCode ? `<div class="info-row"><span class="label-text">Pin Code:</span> ${invoice.customerPinCode}</div>` : '<div class="info-row"><span class="label-text">Pin Code:</span> 641652</div>'}
                        ${invoice.customerGSTIN ? `<div class="info-row"><span class="label-text">GSTIN:</span> ${invoice.customerGSTIN}</div>` : ''}
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="section-block">
                        <h5 class="section-heading">Vehicle Details</h5>
                        <div class="info-row"><span class="label-text">Registration No:</span> ${invoice.vehicleNumber}</div>
                        ${invoice.vehicleModel ? `<div class="info-row"><span class="label-text">Model Name / Trim:</span> ${invoice.vehicleModel}</div>` : '<div class="info-row"><span class="label-text">Model Name / Trim:</span> SU**B Creta 1.5 MPi MT S+ SE</div>'}
                        ${invoice.vehicleFuelType ? `<div class="info-row"><span class="label-text">Fuel Type:</span> ${invoice.vehicleFuelType}</div>` : '<div class="info-row"><span class="label-text">Fuel Type:</span> Petrol</div>'}
                        ${invoice.vehicleChassisNo ? `<div class="info-row"><span class="label-text">Chassis No:</span> ${invoice.vehicleChassisNo}</div>` : '<div class="info-row"><span class="label-text">Chassis No:</span> MALPB812LNM399968</div>'}
                        ${invoice.vehicleKilometers ? `<div class="info-row"><span class="label-text">Kilometers:</span> ${invoice.vehicleKilometers}</div>` : '<div class="info-row"><span class="label-text">Kilometers:</span> 72737.0</div>'}
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="section-block">
                        <h5 class="section-heading">Invoice Details</h5>
                        <div class="info-row"><span class="label-text">Invoice Number:</span> <strong>${invoice.invoiceNumber}</strong></div>
                        <div class="info-row"><span class="label-text">Invoice Date:</span> ${formatDateTime(invoice.invoiceDate)}</div>
                        ${invoice.repairOrderNumber ? `<div class="info-row"><span class="label-text">Repair Order Number:</span> ${invoice.repairOrderNumber}</div>` : '<div class="info-row"><span class="label-text">Repair Order Number:</span> R202501930</div>'}
                        ${invoice.repairOrderDate ? `<div class="info-row"><span class="label-text">Repair Order Date:</span> ${invoice.repairOrderDate}</div>` : '<div class="info-row"><span class="label-text">Repair Order Date:</span> 2025-11-04 10:31:27</div>'}
                        <div class="info-row"><span class="label-text">Repair Order Type:</span> ${invoice.repairOrderType || 'N/A'}</div>
                        <div class="info-row"><span class="label-text">Place of Supply:</span> ${invoice.placeOfSupply || 'N/A'}</div>
                        <div class="info-row"><span class="label-text">Service Advisor:</span> ${invoice.serviceAdvisor || 'N/A'}</div>
                        <div class="info-row"><span class="label-text">Service Advisor Number:</span> ${invoice.serviceAdvisorNumber || 'N/A'}</div>
                    </div>
                </div>
            </div>

            <!-- Parts Table -->
            ${invoice.parts && invoice.parts.length > 0 ? `
            <div class="mt-4">
                <h5 class="section-heading">Part Invoice ${invoice.partInvoiceNumber || 'S4840G202503637'}</h5>
                <div class="table-responsive">
                    <table class="pdf-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Part/OP Code</th>
                                <th>Description</th>
                                <th>HSN/SAC</th>
                                <th>Tax%</th>
                                <th>Qty</th>
                                <th>Rate/Unit</th>
                                <th>Disc Amt</th>
                                <th>Amount(Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.parts.map((part, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${part.code}</td>
                                    <td>${part.description}</td>
                                    <td>${part.hsn}</td>
                                    <td>${part.tax}%</td>
                                    <td>${part.qty}</td>
                                    <td>${formatNumber(part.rate)}</td>
                                    <td>${formatNumber(part.discount)}</td>
                                    <td><strong>${formatNumber(part.amount)}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}

            <!-- Labor Table -->
            ${invoice.labor && invoice.labor.length > 0 ? `
            <div class="mt-4">
                <h5 class="section-heading">Labour and Services - Labour Invoice ${invoice.laborInvoiceNumber || 'S4840G202503636'}</h5>
                <div class="table-responsive">
                    <table class="pdf-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>OP Code</th>
                                <th>Description</th>
                                <th>HSN/SAC</th>
                                <th>Tax%</th>
                                <th>Qty</th>
                                <th>Rate/Unit</th>
                                <th>Disc Amt</th>
                                <th>Amount(Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.labor.map((labor, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${labor.code}</td>
                                    <td>${labor.description}</td>
                                    <td>${labor.hsn}</td>
                                    <td>${labor.tax}%</td>
                                    <td>${labor.qty}</td>
                                    <td>${formatNumber(labor.rate)}</td>
                                    <td>${formatNumber(labor.discount)}</td>
                                    <td><strong>${formatNumber(labor.amount)}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}

            <!-- Summary Section -->
            <div class="mt-4">
                <h5 class="section-heading">Summary</h5>
                <div class="row">
                    <div class="col-md-6">
                        <table class="summary-table">
                            <tr>
                                <td class="label-text">Part Amount(Rs)</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Sub Total</td>
                                <td class="text-end"><strong>${formatNumber(invoice.partSubTotal)}</strong></td>
                            </tr>
                            <tr>
                                <td>Coupon Discount</td>
                                <td class="text-end">${formatNumber(invoice.couponDiscount)}</td>
                            </tr>
                            <tr>
                                <td>TCS Tax</td>
                                <td class="text-end">${formatNumber(invoice.tcsTax)}</td>
                            </tr>
                            <tr>
                                <td>Discount</td>
                                <td class="text-end">${formatNumber(invoice.discount)}</td>
                            </tr>
                            <tr>
                                <td>AMC Discount</td>
                                <td class="text-end">${formatNumber(invoice.amcDiscount)}</td>
                            </tr>
                            <tr>
                                <td>CGST@9% ON Part Value of ${formatNumber(invoice.partSubTotal)}</td>
                                <td class="text-end"><strong>${formatNumber(invoice.cgstOnPart)}</strong></td>
                            </tr>
                            <tr>
                                <td>SGST@9% ON Part Value of ${formatNumber(invoice.partSubTotal)}</td>
                                <td class="text-end"><strong>${formatNumber(invoice.sgstOnPart)}</strong></td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <table class="summary-table">
                            <tr>
                                <td class="label-text">Labor Amount(Rs)</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Sub Total</td>
                                <td class="text-end"><strong>${formatNumber(invoice.laborSubTotal)}</strong></td>
                            </tr>
                            <tr>
                                <td>Coupon Discount</td>
                                <td class="text-end">${formatNumber(0)}</td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td>Discount</td>
                                <td class="text-end">${formatNumber(0)}</td>
                            </tr>
                            <tr>
                                <td>AMC Discount</td>
                                <td class="text-end">${formatNumber(0)}</td>
                            </tr>
                            <tr>
                                <td>CGST @ 9% on Labor value of ${formatNumber(invoice.laborSubTotal)}</td>
                                <td class="text-end"><strong>${formatNumber(invoice.cgstOnLabor)}</strong></td>
                            </tr>
                            <tr>
                                <td>SGST @ 9% on Labor value of ${formatNumber(invoice.laborSubTotal)}</td>
                                <td class="text-end"><strong>${formatNumber(invoice.sgstOnLabor)}</strong></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Total Row -->
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="total-section">
                            <div class="total-row">
                                <span>Total(Rs)</span>
                                <span>${formatNumber(invoice.partSubTotal + invoice.cgstOnPart + invoice.sgstOnPart)}</span>
                                <span>${formatNumber(invoice.laborSubTotal + invoice.cgstOnLabor + invoice.sgstOnLabor)}</span>
                            </div>
                            <div class="total-row grand-total">
                                <span><strong>Grand Total(Rs) (Rounded)</strong></span>
                                <span colspan="2"><strong>${formatNumber(invoice.grandTotalRounded)}</strong></span>
                            </div>
                            <div class="amount-words">
                                <strong>Rupees ${numberToWords(invoice.grandTotalRounded)} Only</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Observation, Deferred Jobs, Customer Advisory -->
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="section-block">
                        <h5 class="section-heading">Customer Advisory</h5>
                        <p class="small-text">Authorized Workshop recommends its customers against use of Non-genuine Fitment which may hamper your safety and/or Result in Poor Performance of your vehicle.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="section-block">
                        <h5 class="section-heading">Deferred Jobs</h5>
                        <p>${invoice.deferredJobs || 'Tyre Damage'}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="section-block">
                        <h5 class="section-heading">Observation:</h5>
                        <p>${invoice.observations || 'No Accessory Fitment'}</p>
                    </div>
                </div>
            </div>

            <!-- Authorized Signatory -->
            <div class="mt-4 text-end">
                <p><strong>For SS AUTOMART PRIVATE LIMITED</strong></p>
                <p class="mt-5">(Authorized Signatory)</p>
            </div>
        </div>
    `;

    return html;
}

// Print invoice
function printInvoice() {
    const invoiceContent = document.getElementById('invoiceDetailContent').innerHTML;

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    // Write the HTML content with styles
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice Print</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                /* Include necessary styles for printing */
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                .invoice-pdf-format {
                    background: white;
                    padding: 2rem;
                    font-family: Arial, sans-serif;
                }
                .section-block {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 5px;
                    margin-bottom: 1rem;
                    border-left: 3px solid #3498db;
                }
                .section-heading {
                    color: #2c3e50;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .info-row {
                    padding: 0.25rem 0;
                    font-size: 0.9rem;
                    line-height: 1.6;
                }
                .label-text {
                    font-weight: 600;
                    color: #2c3e50;
                    margin-right: 0.5rem;
                }
                .pdf-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1rem;
                    font-size: 0.85rem;
                }
                .pdf-table thead {
                    background-color: #2c3e50;
                    color: white;
                }
                .pdf-table th, .pdf-table td {
                    padding: 0.625rem 0.5rem;
                    border: 1px solid #dee2e6;
                    vertical-align: top;
                }
                .pdf-table tbody tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .summary-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }
                .summary-table tr {
                    border-bottom: 1px solid #dee2e6;
                }
                .summary-table td {
                    padding: 0.5rem;
                }
                .summary-table .text-end {
                    text-align: right;
                }
                .total-section {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 5px;
                    margin-top: 1rem;
                    border: 2px solid #2c3e50;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 0;
                    font-size: 1rem;
                    border-bottom: 1px solid #dee2e6;
                }
                .total-row.grand-total {
                    border-top: 3px solid #2c3e50;
                    border-bottom: none;
                    font-size: 1.25rem;
                    color: #2c3e50;
                    margin-top: 1rem;
                    padding-top: 1rem;
                }
                .amount-words {
                    text-align: center;
                    padding: 1rem;
                    background: #e9ecef;
                    border-radius: 5px;
                    margin-top: 1rem;
                    font-size: 1rem;
                    color: #2c3e50;
                }
                .small-text {
                    font-size: 0.85rem;
                    line-height: 1.6;
                    color: #495057;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-pdf-format">
                ${invoiceContent}
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();

    // Wait for content to load and then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

// Add sample invoice with complete data matching the PDF
function addSampleInvoiceWithFullData() {
    const sampleInvoice = {
        id: 'INV1730000000001',
        invoiceNumber: 'B202501926',
        customerName: 'JANANI L K',
        customerAddress: '',
        customerCity: 'Palladam',
        customerState: 'TAMIL NADU',
        customerPinCode: '641652',
        customerContact: '8608082109',
        customerGSTIN: '',
        vehicleNumber: 'TN39DX6478',
        vehicleModel: 'SU**B Creta 1.5 MPi MT S+ SE',
        vehicleFuelType: 'Petrol',
        vehicleChassisNo: 'MALPB812LNM399968',
        vehicleKilometers: '72737.0',
        invoiceDate: '2025-11-04',
        repairOrderNumber: 'R202501930',
        repairOrderDate: '2025-11-04 10:31:27',
        repairOrderType: 'Paid Service',
        placeOfSupply: 'Tamilnadu',
        serviceAdvisor: 'Vignesh M',
        serviceAdvisorNumber: '7867044453',
        partInvoiceNumber: 'S4840G202503637',
        laborInvoiceNumber: 'S4840G202503636',
        parts: [
            {code: '08M9858100', description: '25 g-GREASE-CALIPER GUIDE ROD', hsn: '34039900', tax: 18, qty: 1.00, rate: 218.64, discount: 0.00, amount: 218.64},
            {code: 'ACS73AP001', description: '50 ml-WINDSHIELD WASHER', hsn: '34029099', tax: 18, qty: 2.00, rate: 16.94, discount: 0.00, amount: 33.88},
            {code: '954133A000-AS', description: 'BATTERY-TRANSMITTER', hsn: '83016000', tax: 18, qty: 1.00, rate: 366.94, discount: 0.00, amount: 366.94},
            {code: 'NPNBRKCLREB', description: 'Brake Parts Kleen', hsn: '38140010', tax: 18, qty: 1.00, rate: 443.22, discount: 0.00, amount: 443.22},
            {code: '97133S5000', description: 'FILTER ASSY-AIR', hsn: '84213990', tax: 18, qty: 1.00, rate: 398.30, discount: 0.00, amount: 398.30},
            {code: '28113A0100', description: 'FILTER-AIR CLEANER', hsn: '84213100', tax: 18, qty: 1.00, rate: 286.44, discount: 0.00, amount: 286.44},
            {code: '2151223001', description: 'PLUG-OIL DRAIN', hsn: '39269099', tax: 18, qty: 1.00, rate: 260.16, discount: 0.00, amount: 260.16},
            {code: '8659028000', description: 'RETAINER ASSY-BUMPER COVER MTG', hsn: '87089900', tax: 18, qty: 5.00, rate: 6.78, discount: 0.00, amount: 33.91},
            {code: '263502M000', description: 'SERVICE KIT-OIL FILTER', hsn: '84212300', tax: 18, qty: 1.00, rate: 503.38, discount: 0.00, amount: 503.38},
            {code: 'NPNBS6SYNSHELL', description: 'SHELL HELIX ULTRA AH 0W30 API SP/C', hsn: '27101972', tax: 18, qty: 3.60, rate: 974.58, discount: 0.00, amount: 3508.51}
        ],
        labor: [
            {code: 'A10AAACDVASEB', description: 'AC Disinfectant Bardahl (EB) (Optional)', hsn: '998729', tax: 18, qty: 1.00, rate: 575.00, discount: 0.00, amount: 575.00},
            {code: 'A10AABR18BRAK', description: 'Brake Bleeding', hsn: '998729', tax: 18, qty: 1.00, rate: 681.00, discount: 0.00, amount: 681.00},
            {code: 'A10AAECLVASEB', description: 'Engine Cleaning/Dressing Large Bardahl (EB) (Optional)', hsn: '998729', tax: 18, qty: 1.00, rate: 399.00, discount: 0.00, amount: 399.00},
            {code: 'A10AAGM01PMSS', description: 'Periodic Maintenance Service (PMS)', hsn: '998729', tax: 18, qty: 1.00, rate: 2143.00, discount: 0.00, amount: 2143.00}
        ],
        partSubTotal: 6053.38,
        laborSubTotal: 3798.00,
        cgstOnPart: 544.80,
        sgstOnPart: 544.80,
        cgstOnLabor: 341.82,
        sgstOnLabor: 341.82,
        totalAmount: 11625,
        grandTotalRounded: 11625,
        couponDiscount: 0.00,
        discount: 0.00,
        amcDiscount: 0.00,
        tcsTax: 0.00,
        observations: 'No Accessory Fitment',
        deferredJobs: 'Tyre Damage',
        uploadDate: new Date().toISOString(),
        fileName: 'SM_S4840_B202501926.pdf',
        status: 'paid'
    };

    invoices.push(sampleInvoice);
    saveInvoicesToStorage();
    updateDashboard();
    renderRecentInvoices();
}

// Utility functions
function formatNumber(num) {
    if (!num && num !== 0) return '0.00';
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Convert number to words (Indian system)
function numberToWords(num) {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    function convertLessThanThousand(n) {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    }

    if (num < 1000) return convertLessThanThousand(num);
    if (num < 100000) {
        const thousands = Math.floor(num / 1000);
        const remainder = num % 1000;
        return convertLessThanThousand(thousands) + ' Thousand' + (remainder !== 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }

    const lakhs = Math.floor(num / 100000);
    let remainder = num % 100000;
    let result = convertLessThanThousand(lakhs) + ' Lakh';
    if (remainder >= 1000) {
        result += ' ' + convertLessThanThousand(Math.floor(remainder / 1000)) + ' Thousand';
        remainder = remainder % 1000;
    }
    if (remainder > 0) {
        result += ' ' + convertLessThanThousand(remainder);
    }
    return result;
}

// LocalStorage functions
function saveInvoicesToStorage() {
    localStorage.setItem('invoices', JSON.stringify(invoices));
}

function loadInvoicesFromStorage() {
    const stored = localStorage.getItem('invoices');
    if (stored) {
        invoices = JSON.parse(stored);
    }
}

// Delete invoice (optional feature)
function deleteInvoice(invoiceId) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        invoices = invoices.filter(inv => inv.id !== invoiceId);
        saveInvoicesToStorage();
        updateDashboard();
        renderRecentInvoices();
        renderInvoicesList();
        showMessage('Invoice deleted successfully', 'success');
    }
}
