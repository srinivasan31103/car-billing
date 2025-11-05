// Invoice Form Management - Dynamic Parts and Labor with Auto-calculation

// Counter for unique row IDs
let partRowCounter = 0;
let laborRowCounter = 0;

// Add a new part row
function addPartRow() {
    partRowCounter++;
    const tbody = document.getElementById('partsTableBody');
    const row = document.createElement('tr');
    row.id = `partRow${partRowCounter}`;
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm part-code" placeholder="Part Code"></td>
        <td><input type="text" class="form-control form-control-sm part-desc" placeholder="Description"></td>
        <td><input type="text" class="form-control form-control-sm part-hsn" placeholder="HSN/SAC" value=""></td>
        <td><input type="number" class="form-control form-control-sm part-tax" value="18" min="0" max="100" onchange="calculatePartRow(${partRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm part-qty" value="1" min="0" step="0.01" onchange="calculatePartRow(${partRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm part-rate" value="0" min="0" step="0.01" onchange="calculatePartRow(${partRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm part-discount" value="0" min="0" step="0.01" onchange="calculatePartRow(${partRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm part-amount" value="0" readonly></td>
        <td><button type="button" class="btn-remove" onclick="removePartRow(${partRowCounter})">×</button></td>
    `;
    tbody.appendChild(row);
}

// Remove a part row
function removePartRow(rowId) {
    const row = document.getElementById(`partRow${rowId}`);
    if (row) {
        row.remove();
        calculateAllTotals();
    }
}

// Calculate amount for a specific part row
function calculatePartRow(rowId) {
    const row = document.getElementById(`partRow${rowId}`);
    if (!row) return;

    const qty = parseFloat(row.querySelector('.part-qty').value) || 0;
    const rate = parseFloat(row.querySelector('.part-rate').value) || 0;
    const discount = parseFloat(row.querySelector('.part-discount').value) || 0;

    const amount = (qty * rate) - discount;
    row.querySelector('.part-amount').value = amount.toFixed(2);

    calculateAllTotals();
}

// Add a new labor row
function addLaborRow() {
    laborRowCounter++;
    const tbody = document.getElementById('laborTableBody');
    const row = document.createElement('tr');
    row.id = `laborRow${laborRowCounter}`;
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm labor-code" placeholder="OP Code"></td>
        <td><input type="text" class="form-control form-control-sm labor-desc" placeholder="Description"></td>
        <td><input type="text" class="form-control form-control-sm labor-hsn" placeholder="998729" value="998729"></td>
        <td><input type="number" class="form-control form-control-sm labor-tax" value="18" min="0" max="100" onchange="calculateLaborRow(${laborRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm labor-qty" value="1" min="0" step="0.01" onchange="calculateLaborRow(${laborRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm labor-rate" value="0" min="0" step="0.01" onchange="calculateLaborRow(${laborRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm labor-discount" value="0" min="0" step="0.01" onchange="calculateLaborRow(${laborRowCounter})"></td>
        <td><input type="number" class="form-control form-control-sm labor-amount" value="0" readonly></td>
        <td><button type="button" class="btn-remove" onclick="removeLaborRow(${laborRowCounter})">×</button></td>
    `;
    tbody.appendChild(row);
}

// Remove a labor row
function removeLaborRow(rowId) {
    const row = document.getElementById(`laborRow${rowId}`);
    if (row) {
        row.remove();
        calculateAllTotals();
    }
}

// Calculate amount for a specific labor row
function calculateLaborRow(rowId) {
    const row = document.getElementById(`laborRow${rowId}`);
    if (!row) return;

    const qty = parseFloat(row.querySelector('.labor-qty').value) || 0;
    const rate = parseFloat(row.querySelector('.labor-rate').value) || 0;
    const discount = parseFloat(row.querySelector('.labor-discount').value) || 0;

    const amount = (qty * rate) - discount;
    row.querySelector('.labor-amount').value = amount.toFixed(2);

    calculateAllTotals();
}

// Calculate all totals (Parts, Labor, Taxes, Grand Total)
function calculateAllTotals() {
    // Calculate Parts Total
    let partSubTotal = 0;
    const partRows = document.querySelectorAll('#partsTableBody tr');
    partRows.forEach(row => {
        const amount = parseFloat(row.querySelector('.part-amount')?.value) || 0;
        partSubTotal += amount;
    });

    const partCGST = partSubTotal * 0.09;
    const partSGST = partSubTotal * 0.09;
    const partTotal = partSubTotal + partCGST + partSGST;

    // Calculate Labor Total
    let laborSubTotal = 0;
    const laborRows = document.querySelectorAll('#laborTableBody tr');
    laborRows.forEach(row => {
        const amount = parseFloat(row.querySelector('.labor-amount')?.value) || 0;
        laborSubTotal += amount;
    });

    const laborCGST = laborSubTotal * 0.09;
    const laborSGST = laborSubTotal * 0.09;
    const laborTotal = laborSubTotal + laborCGST + laborSGST;

    // Grand Total
    const grandTotal = Math.round(partTotal + laborTotal);

    // Update UI
    document.getElementById('partSubTotal').textContent = '₹' + partSubTotal.toFixed(2);
    document.getElementById('partCGST').textContent = '₹' + partCGST.toFixed(2);
    document.getElementById('partSGST').textContent = '₹' + partSGST.toFixed(2);
    document.getElementById('partTotal').textContent = '₹' + partTotal.toFixed(2);

    document.getElementById('laborSubTotal').textContent = '₹' + laborSubTotal.toFixed(2);
    document.getElementById('laborCGST').textContent = '₹' + laborCGST.toFixed(2);
    document.getElementById('laborSGST').textContent = '₹' + laborSGST.toFixed(2);
    document.getElementById('laborTotal').textContent = '₹' + laborTotal.toFixed(2);

    document.getElementById('grandTotal').textContent = '₹' + grandTotal.toLocaleString('en-IN');
}

// Collect parts data from the table
function collectPartsData() {
    const parts = [];
    const partRows = document.querySelectorAll('#partsTableBody tr');

    partRows.forEach(row => {
        const code = row.querySelector('.part-code').value;
        const description = row.querySelector('.part-desc').value;
        const hsn = row.querySelector('.part-hsn').value;
        const tax = parseFloat(row.querySelector('.part-tax').value) || 18;
        const qty = parseFloat(row.querySelector('.part-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.part-rate').value) || 0;
        const discount = parseFloat(row.querySelector('.part-discount').value) || 0;
        const amount = parseFloat(row.querySelector('.part-amount').value) || 0;

        if (code || description) {  // Only add if there's some data
            parts.push({
                code,
                description,
                hsn,
                tax,
                qty,
                rate,
                discount,
                amount
            });
        }
    });

    return parts;
}

// Collect labor data from the table
function collectLaborData() {
    const labor = [];
    const laborRows = document.querySelectorAll('#laborTableBody tr');

    laborRows.forEach(row => {
        const code = row.querySelector('.labor-code').value;
        const description = row.querySelector('.labor-desc').value;
        const hsn = row.querySelector('.labor-hsn').value;
        const tax = parseFloat(row.querySelector('.labor-tax').value) || 18;
        const qty = parseFloat(row.querySelector('.labor-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.labor-rate').value) || 0;
        const discount = parseFloat(row.querySelector('.labor-discount').value) || 0;
        const amount = parseFloat(row.querySelector('.labor-amount').value) || 0;

        if (code || description) {  // Only add if there's some data
            labor.push({
                code,
                description,
                hsn,
                tax,
                qty,
                rate,
                discount,
                amount
            });
        }
    });

    return labor;
}

// Initialize form - add one part and one labor row by default
document.addEventListener('DOMContentLoaded', function() {
    // Add initial rows
    setTimeout(() => {
        addPartRow();
        addLaborRow();
    }, 100);
});
