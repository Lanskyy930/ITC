function formatCurrency(amount) {
    return `₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

const conversionSelect = document.getElementById('conversion-select');
const conversionPanels = document.querySelectorAll('.conversion-panel');

if (conversionSelect) {
    conversionSelect.addEventListener('change', (event) => {
        const selected = event.target.value;
        conversionPanels.forEach((panel) => {
            panel.hidden = panel.dataset.conversion !== selected;
        });
    });

    document.getElementById('btn-c-to-f').addEventListener('click', () => {
        const val = Number.parseFloat(document.getElementById('celsius-input').value);
        const out = document.getElementById('celsius-result');
        out.value = Number.isNaN(val) ? 'Enter a valid number' : `${((val * 9) / 5 + 32).toFixed(2)} °F`;
    });

    document.getElementById('btn-f-to-c').addEventListener('click', () => {
        const val = Number.parseFloat(document.getElementById('fahrenheit-input').value);
        const out = document.getElementById('fahrenheit-result');
        out.value = Number.isNaN(val) ? 'Enter a valid number' : `${(((val - 32) * 5) / 9).toFixed(2)} °C`;
    });

    document.getElementById('btn-m-to-ft').addEventListener('click', () => {
        const val = Number.parseFloat(document.getElementById('meters-input').value);
        const out = document.getElementById('meters-result');
        out.value = Number.isNaN(val) ? 'Enter a valid number' : `${(val * 3.28084).toFixed(2)} ft`;
    });

    document.getElementById('btn-ft-to-m').addEventListener('click', () => {
        const val = Number.parseFloat(document.getElementById('feet-input').value);
        const out = document.getElementById('feet-result');
        out.value = Number.isNaN(val) ? 'Enter a valid number' : `${(val / 3.28084).toFixed(2)} m`;
    });
}

const computeTaxBtn = document.getElementById('compute-tax-btn');

if (computeTaxBtn) {
    computeTaxBtn.addEventListener('click', () => {
        const income = Number.parseFloat(document.getElementById('taxable-income').value);
        const taxResult = document.getElementById('tax-result');

        if (Number.isNaN(income) || income < 0) {
            taxResult.value = 'Enter a valid non-negative income';
            return;
        }

        let tax = 0;

        if (income <= 250000) {
            tax = 0;
        } else if (income <= 400000) {
            tax = (income - 250000) * 0.20;
        } else if (income <= 800000) {
            tax = 30000 + (income - 400000) * 0.25;
        } else if (income <= 2000000) {
            tax = 130000 + (income - 800000) * 0.30;
        } else if (income <= 8000000) {
            tax = 490000 + (income - 2000000) * 0.32;
        } else {
            tax = 2410000 + (income - 8000000) * 0.35;
        }

        taxResult.value = formatCurrency(tax);
    });
}

const computeLoopBtn = document.getElementById('compute-loop-btn');

if (computeLoopBtn) {
    computeLoopBtn.addEventListener('click', () => {
        const n = Number.parseInt(document.getElementById('loop-number').value, 10);
        const factorialOut = document.getElementById('factorial-result');
        const sumOut = document.getElementById('sum-result');
        const averageOut = document.getElementById('average-result');

        if (Number.isNaN(n) || n < 1) {
            factorialOut.value = 'Enter an integer >= 1';
            sumOut.value = 'Enter an integer >= 1';
            averageOut.value = 'Enter an integer >= 1';
            return;
        }

        let factorial = 1n;
        let i = 1n;
        const bigN = BigInt(n);
        while (i <= bigN) {
            factorial *= i;
            i++;
        }

        let sum = 0;
        let j = 1;
        do {
            sum += j;
            j++;
        } while (j <= n);

        let forSum = 0;
        for (let k = 1; k <= n; k++) {
            forSum += k;
        }
        const average = forSum / n;

        factorialOut.value = factorial.toString();
        sumOut.value = sum.toLocaleString();
        averageOut.value = average.toFixed(2);
    });
}

const addEmployeeBtn = document.getElementById('add-employee-btn');
const payrollTbody = document.getElementById('payroll-tbody');

if (addEmployeeBtn && payrollTbody) {
    const payrollList = [];

    function renderPayrollTable() {
        payrollTbody.innerHTML = '';

        if (payrollList.length === 0) {
            payrollTbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7">No employees added yet.</td>
                </tr>
            `;
            return;
        }

        payrollList.forEach((emp, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="no-cell">
                        <span>${index + 1}</span>
                        <button type="button" class="btn-delete-row" data-index="${index}">Delete</button>
                    </div>
                </td>
                <td class="emp-name-cell"></td>
                <td>${emp.daysWorked}</td>
                <td>${formatCurrency(emp.dailyRate)}</td>
                <td>${formatCurrency(emp.grossPay)}</td>
                <td>${formatCurrency(emp.deduction)}</td>
                <td><strong>${formatCurrency(emp.netPay)}</strong></td>
            `;
            row.querySelector('.emp-name-cell').textContent = emp.name;
            payrollTbody.appendChild(row);
        });
    }

    addEmployeeBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('employee-name');
        const daysInput = document.getElementById('employee-days');
        const rateInput = document.getElementById('employee-rate');
        const deductionInput = document.getElementById('employee-deduction');

        const name = nameInput.value.trim();
        const daysWorked = Number.parseFloat(daysInput.value);
        const dailyRate = Number.parseFloat(rateInput.value);
        const deduction = Number.parseFloat(deductionInput.value) || 0;

        if (!name || Number.isNaN(daysWorked) || Number.isNaN(dailyRate) || daysWorked < 0 || dailyRate < 0 || deduction < 0) {
            alert('Please enter a valid employee name and non-negative numbers.');
            return;
        }

        const grossPay = daysWorked * dailyRate;
        const netPay = grossPay - deduction;

        payrollList.push({
            name,
            daysWorked,
            dailyRate,
            grossPay,
            deduction,
            netPay
        });

        renderPayrollTable();

        nameInput.value = '';
        daysInput.value = '';
        rateInput.value = '';
        deductionInput.value = '0';
        nameInput.focus();
    });

    payrollTbody.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.btn-delete-row');
        if (!deleteBtn) return;

        const index = Number.parseInt(deleteBtn.dataset.index, 10);
        payrollList.splice(index, 1);
        renderPayrollTable();
    });
}