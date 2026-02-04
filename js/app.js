let expensesData = [];
let chartInstance = null;
let currentCurrency = localStorage.getItem('currency') || 'USD';
let exchangeRates = { USD: 1 };
const currencySymbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥'
};

document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkSession();
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    document.body.classList.remove('hidden');

    // Set default date
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.valueAsDate = new Date();

    // Set User Name
    const res = await (await fetch('api/auth.php?action=check_session')).json();
    if (res.data && res.data.user) {
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) userDisplay.textContent = res.data.user.username;
    }

    // Initialize Currency
    const currencySelect = document.getElementById('currency-selector');
    if (currencySelect) {
        currencySelect.value = currentCurrency;
        currencySelect.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem('currency', currentCurrency);
            renderAll();
        });
    }

    await fetchRates();
    loadCategories();
    loadExpenses();

    // Attach Event Listener
    const form = document.getElementById('add-expense-form');
    if (form) form.addEventListener('submit', addExpense);
});

async function fetchRates() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        exchangeRates = data.rates;
    } catch (error) {
        console.error('Failed to fetch rates', error);
    }
}

function formatMoney(amount) {
    const rate = exchangeRates[currentCurrency] || 1;
    const converted = amount * rate;
    const symbol = currencySymbols[currentCurrency] || currentCurrency;
    return `${symbol}${converted.toFixed(2)}`;
}

async function loadCategories() {
    const res = await fetch('api/categories.php');
    const data = await res.json();
    if (data.success) {
        const select = document.getElementById('category');
        if (!select) return;
        select.innerHTML = '<option value="">Select Category</option>';
        data.data.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    }
}

async function loadExpenses() {
    const res = await fetch('api/expenses.php');
    const data = await res.json();
    if (data.success) {
        expensesData = data.data;
        renderAll();
    }
}

function renderAll() {
    renderExpenses();
    updateStats();
    renderChart();
}

function renderExpenses() {
    const list = document.getElementById('expense-list');
    if (!list) return;
    list.innerHTML = '';

    expensesData.forEach(exp => {
        const li = document.createElement('li');
        li.className = 'expense-item';

        const isIncome = exp.category_type === 'income';
        const sign = isIncome ? '+' : '-';
        const colorClass = isIncome ? 'income' : 'expense';
        const formattedAmount = formatMoney(parseFloat(exp.amount));

        li.innerHTML = `
            <div class="expense-info">
                <strong>${exp.description || exp.category_name}</strong>
                <small>${exp.date} &bull; ${exp.category_name}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="expense-amount ${colorClass}">${sign}${formattedAmount}</span>
                <button onclick="deleteExpense(${exp.id})" style="background: var(--danger-color); padding: 5px 10px; border-radius: 5px; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

function updateStats() {
    const income = expensesData
        .filter(e => e.category_type === 'income')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const expense = expensesData
        .filter(e => e.category_type === 'expense')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const balance = income - expense;

    const totalBalanceEl = document.getElementById('total-balance');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');

    if (totalBalanceEl) totalBalanceEl.textContent = formatMoney(balance);
    if (totalIncomeEl) totalIncomeEl.textContent = `+${formatMoney(income)}`;
    if (totalExpenseEl) totalExpenseEl.textContent = `-${formatMoney(expense)}`;
}

function renderChart() {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Group by category (Expenses only)
    const categoryTotals = {};
    expensesData
        .filter(e => e.category_type === 'expense')
        .forEach(e => {
            const name = e.category_name;
            const amount = parseFloat(e.amount) * (exchangeRates[currentCurrency] || 1); // Convert for chart
            if (!categoryTotals[name]) categoryTotals[name] = 0;
            categoryTotals[name] += amount;
        });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: [
                    '#ff6b6b', '#4e54c8', '#2ecc71', '#f1c40f', '#e67e22', '#9b59b6', '#34495e'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                const symbol = currencySymbols[currentCurrency] || currentCurrency;
                                label += symbol + context.parsed.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

async function addExpense(e) {
    e.preventDefault();

    const desc = document.getElementById('desc').value;
    const rawAmount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Convert BACK to USD before saving, IF usage assumes DB stores USD.
    // However, user enters amount in "current currency"? Usually yes.
    // If usage stores in USD, we simply divide by rate.

    const rate = exchangeRates[currentCurrency] || 1;
    const amountInUSD = rawAmount / rate;

    // For simplicity, let's assume user enters USD if we don't do complex conversion logic on INPUT.
    // BUT the request is "automatic conversion". A typical user expects to enter "100 INR" if INR is selected.
    // So we should convert user input to base currency (USD?) before sending to DB?
    // OR we assume DB just stores "numbers" and we treat them as base units. 
    // To make it truly multi-currency, we should normalize to base (USD) or store currency with transaction.
    // Given the simple schema, I will normalize to USD (base) when saving, and convert to Display Currency when reading.

    // DECISION: Store in USD (Base). 
    // Input is in Current Currency.

    // Save amountInUSD
    const res = await fetch('api/expenses.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc, amount: amountInUSD, category_id: category, date })
    });

    const data = await res.json();
    if (data.success) {
        document.getElementById('add-expense-form').reset();
        document.getElementById('date').valueAsDate = new Date();
        loadExpenses();
    } else {
        alert('Error: ' + data.message);
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure?')) return;

    const res = await fetch(`api/expenses.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
        loadExpenses();
    } else {
        alert('Error deleting: ' + data.message);
    }
}
