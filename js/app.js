let expensesData = [];
let chartInstance = null;
let currentCurrency = localStorage.getItem('currency') || 'USD';
let exchangeRates = JSON.parse(localStorage.getItem('exchangeRates')) || { USD: 1 };
const currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥' };
let monthlyBudget = null;
let currentReceiptBase64 = '';

// Helper to escape HTML and prevent XSS
function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

let offlineQueue = JSON.parse(localStorage.getItem('offlineQueue')) || [];

document.addEventListener('DOMContentLoaded', async () => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.log('SW Registration failed', err));
    }

    // Network Status Listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', updateOfflineBanner);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkDailyReminder();
        }
    });
    updateOfflineBanner();

    // Check Auth
    const isAuthenticated = await checkSession();
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    document.body.classList.remove('hidden');

    // Default Date
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.valueAsDate = new Date();

    // Set User Name
    const username = localStorage.getItem('offline_username');
    if (username) {
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) userDisplay.textContent = username;
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
    await fetchBudget();
    await loadCategories();
    await loadExpenses();

    // Check Reminder Setup
    checkDailyReminder();

    // Attach Listeners
    const form = document.getElementById('add-expense-form');
    if (form) form.addEventListener('submit', addExpense);

    const editForm = document.getElementById('edit-expense-form');
    if (editForm) editForm.addEventListener('submit', updateExpense);
    
    // Attempt sync if online
    if (navigator.onLine) {
        syncOfflineData();
    }
});

function updateOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) {
        if (navigator.onLine) {
            banner.classList.add('hidden');
        } else {
            banner.classList.remove('hidden');
        }
    }
}

async function handleOnline() {
    updateOfflineBanner();
    await syncOfflineData();
    await loadCategories();
    await loadExpenses();
}

async function fetchRates() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        exchangeRates = data.rates;
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
    } catch (error) {
        console.error('Failed to fetch rates, using cached', error);
    }
}

function formatMoney(amount) {
    const rate = exchangeRates[currentCurrency] || 1;
    const converted = amount * rate;
    const symbol = currencySymbols[currentCurrency] || currentCurrency;
    return `${symbol}${converted.toFixed(2)}`;
}

async function loadCategories() {
    try {
        const res = await fetch('api/categories.php');
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('categories_cache', JSON.stringify(data.data));
            populateCategories(data.data);
        }
    } catch (e) {
        const cached = JSON.parse(localStorage.getItem('categories_cache') || '[]');
        populateCategories(cached);
    }
}

function populateCategories(categories) {
    const select = document.getElementById('category');
    if (!select) return;
    select.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        // Keep type data attribute to calculate income vs expense locally
        option.dataset.type = cat.type; 
        select.appendChild(option);
    });
}

async function loadExpenses() {
    try {
        const res = await fetch('api/expenses.php');
        const data = await res.json();
        if (data.success) {
            expensesData = data.data;
            localStorage.setItem('expenses_cache', JSON.stringify(expensesData));
            renderAll();
        }
    } catch (e) {
        expensesData = JSON.parse(localStorage.getItem('expenses_cache') || '[]');
        renderAll();
    }
}

function saveLocalExpenses() {
    localStorage.setItem('expenses_cache', JSON.stringify(expensesData));
    localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
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

        const pendingStar = exp.id < 0 ? '<span title="Pending Sync" style="color:var(--text-muted);font-size:0.8rem;margin-left:5px;"><i class="fas fa-sync"></i></span>' : '';
        const receiptIcon = exp.receipt_url ? `<a href="${exp.receipt_url}" target="_blank" style="margin-left:5px; color:#3498db;" title="View Receipt"><i class="fas fa-paperclip"></i></a>` : '';

        const safeDescription = escapeHTML(exp.description || exp.category_name);
        const safeCategory = escapeHTML(exp.category_name);

        li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background: rgba(255,255,255,0.05); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1);">
                    <i class="fas ${exp.category_icon || 'fa-tag'}"></i>
                </div>
                <div class="expense-info">
                    <strong>${safeDescription} ${pendingStar} ${receiptIcon}</strong>
                    <small>${escapeHTML(exp.date)}</small>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="expense-amount ${colorClass}">${sign}${formattedAmount}</span>
                <button onclick="openEditModal(${exp.id})" style="background: var(--card-bg-hover); color: var(--text-color); padding: 6px 12px; border-radius: 8px; font-size: 0.8rem;" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteExpense(${exp.id})" style="background: var(--danger-color); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem;" title="Delete">
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
    
    renderBudget(expense);
}

function renderChart() {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const categoryTotals = {};
    expensesData
        .filter(e => e.category_type === 'expense')
        .forEach(e => {
            const name = e.category_name;
            const amount = parseFloat(e.amount) * (exchangeRates[currentCurrency] || 1);
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
                    '#ffffff', '#aaaaaa', '#666666', '#333333', '#dddddd'
                ],
                borderColor: '#050505',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#ffffff' } },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) label += ': ';
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

function getCategoryData(id) {
    const select = document.getElementById('category');
    const option = select.querySelector(`option[value="${id}"]`);
    if(option) {
        return { name: option.textContent, type: option.dataset.type };
    }
    return { name: 'Unknown', type: 'expense' };
}

async function addExpense(e) {
    e.preventDefault();

    const desc = document.getElementById('desc').value.trim();
    const rawAmount = parseFloat(document.getElementById('amount').value);
    const categoryId = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!desc || isNaN(rawAmount) || rawAmount <= 0 || !categoryId || !date) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const rate = exchangeRates[currentCurrency] || 1;
    const amountInUSD = rawAmount / rate;
    
    const recurringPeriodEl = document.getElementById('recurring-period');
    const recurring_period = recurringPeriodEl ? recurringPeriodEl.value : '';
    
    const payload = { 
        description: desc, 
        amount: amountInUSD, 
        category_id: categoryId, 
        date,
        receipt_base64: currentReceiptBase64,
        recurring_period: recurring_period
    };

    try {
        const res = await fetch('api/expenses.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('add-expense-form').reset();
            document.getElementById('date').valueAsDate = new Date();
            
            // Mark logged for today
            localStorage.setItem('last_logged', new Date().toDateString());
            document.getElementById('daily-reminder-banner').classList.add('hidden');

            // Clear receipt
            currentReceiptBase64 = '';
            if(document.getElementById('receipt-name')) document.getElementById('receipt-name').textContent = '';

            loadExpenses();
        } else {
            alert('Error: ' + data.message);
        }
    } catch(err) {
        // OFFLINE FALLBACK
        const fakeId = -Date.now(); // negative ID denotes local-only
        const catData = getCategoryData(categoryId);
        const newExp = {
            id: fakeId,
            description: desc, // description will be escaped during render
            amount: amountInUSD,
            category_id: categoryId,
            category_name: catData.name,
            category_type: catData.type,
            date: date
        };
        expensesData.unshift(newExp);
        offlineQueue.push({ action: 'POST', payload: payload, fakeId: fakeId });
        saveLocalExpenses();
        renderAll();
        
        // Mark logged for today
        localStorage.setItem('last_logged', new Date().toDateString());
        document.getElementById('daily-reminder-banner').classList.add('hidden');

        document.getElementById('add-expense-form').reset();
        document.getElementById('date').valueAsDate = new Date();
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure?')) return;

    try {
        // If it's a locally created expense, remove it from the offline queue
        if (id < 0) {
            offlineQueue = offlineQueue.filter(q => q.fakeId !== id);
            expensesData = expensesData.filter(e => e.id !== id);
            saveLocalExpenses();
            renderAll();
            return;
        }

        const res = await fetch(`api/expenses.php?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            loadExpenses();
        } else {
            alert('Error deleting: ' + data.message);
        }
    } catch(err) {
        // OFFLINE FALLBACK
        expensesData = expensesData.filter(e => e.id !== id);
        offlineQueue.push({ action: 'DELETE', payload: { id } });
        saveLocalExpenses();
        renderAll();
    }
}

function openEditModal(id) {
    const exp = expensesData.find(e => e.id == id);
    if (!exp) return;

    document.getElementById('edit-id').value = exp.id;
    document.getElementById('edit-desc').value = exp.description || '';

    const rate = exchangeRates[currentCurrency] || 1;
    document.getElementById('edit-amount').value = (parseFloat(exp.amount) * rate).toFixed(2);

    const editSelect = document.getElementById('edit-category');
    
    // Safety check for category copying
    if (mainSelect && editSelect) {
        editSelect.innerHTML = mainSelect.innerHTML;
        editSelect.value = exp.category_id;
    }

    document.getElementById('edit-date').value = escapeHTML(exp.date);
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    document.getElementById('edit-expense-form').reset();
}

async function updateExpense(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('edit-id').value);
    const desc = document.getElementById('edit-desc').value.trim();
    const rawAmount = parseFloat(document.getElementById('edit-amount').value);
    const categoryId = document.getElementById('edit-category').value;
    const date = document.getElementById('edit-date').value;

    if (!desc || isNaN(rawAmount) || rawAmount <= 0 || !categoryId || !date) {
        alert("Please fill out all fields.");
        return;
    }

    const rate = exchangeRates[currentCurrency] || 1;
    const amountInUSD = rawAmount / rate;
    const payload = { id: id, description: desc, amount: amountInUSD, category_id: categoryId, date };

    try {
        if (id < 0) {
            // Updating an offline-created expense. Find it in queue and update its payload.
            const idx = offlineQueue.findIndex(q => q.fakeId === id && q.action === 'POST');
            if (idx !== -1) {
                // Update the POST payload with the new details (remove the 'id' field as API POST doesn't take id)
                offlineQueue[idx].payload = { description: desc, amount: amountInUSD, category_id: categoryId, date };
            }
            // Update local state
            updateLocalExpense(id, payload, categoryId);
            closeEditModal();
            return;
        }

        const res = await fetch('api/expenses.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            closeEditModal();
            loadExpenses();
        } else {
            alert('Error: ' + data.message);
        }
    } catch(err) {
        // OFFLINE FALLBACK
        offlineQueue.push({ action: 'PUT', payload: payload });
        updateLocalExpense(id, payload, categoryId);
        closeEditModal();
    }
}

function updateLocalExpense(id, payload, categoryId) {
    const catData = getCategoryData(categoryId);
    const expIdx = expensesData.findIndex(e => e.id === id);
    if (expIdx !== -1) {
        expensesData[expIdx].description = payload.description;
        expensesData[expIdx].amount = payload.amount;
        expensesData[expIdx].category_id = payload.category_id;
        expensesData[expIdx].category_name = catData.name;
        expensesData[expIdx].category_type = catData.type;
        expensesData[expIdx].date = payload.date;
        saveLocalExpenses();
        renderAll();
    }
}

// Background Syncing Function
async function syncOfflineData() {
    if (offlineQueue.length === 0) return;

    // We process the queue sequentially to maintain order of operations
    const processingQueue = [...offlineQueue];
    
    for (let q of processingQueue) {
        try {
            let res;
            if (q.action === 'POST') {
                res = await fetch('api/expenses.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(q.payload)
                });
            } else if (q.action === 'PUT') {
                res = await fetch('api/expenses.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(q.payload)
                });
            } else if (q.action === 'DELETE') {
                res = await fetch(`api/expenses.php?id=${q.payload.id}`, { method: 'DELETE' });
            }
            
            // Remove success items
            offlineQueue = offlineQueue.filter(item => item !== q);
            localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));

        } catch (e) {
            console.error("Sync failed for an item, stopping sync process", e);
            break; // Stop syncing if connection dies again
        }
    }

    if (offlineQueue.length === 0) {
        console.log("All offline data synced!");
        loadExpenses(); // Refresh with real IDs
    }
}

// Notification Tracker Engine
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('This browser does not support system notifications.');
        return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        alert('Reminders enabled!');
        checkDailyReminder();
    } else {
        alert('Permission denied. Reminders will only appear inside the app.');
    }
}

function checkDailyReminder() {
    const lastLogged = localStorage.getItem('last_logged');
    const lastNotified = localStorage.getItem('last_notified');
    const today = new Date().toDateString();

    const banner = document.getElementById('daily-reminder-banner');

    if (lastLogged !== today) {
        // Show in-app banner
        if (banner) banner.classList.remove('hidden');

        // Show native notification if allowed, and hasn't been notified today
        if (Notification.permission === 'granted' && lastNotified !== today) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('Web Expense Tracker', {
                        body: 'Don\'t forget to log your expenses for today!',
                        icon: 'icon-192.png',
                        vibrate: [200, 100, 200],
                        tag: 'daily-reminder', // Replaces existing reminder notifications
                        actions: [
                            { action: 'open', title: 'Log Expense Now' }
                        ]
                    });
                    localStorage.setItem('last_notified', today);
                });
            }
        }
    } else {
        // Already logged today
        if (banner) banner.classList.add('hidden');
    }
}

// ================= NEW FEATURES =================

// Budget System
async function fetchBudget() {
    try {
        const res = await fetch('api/budget.php');
        const data = await res.json();
        if (data.success) monthlyBudget = data.budget ? parseFloat(data.budget) : null;
    } catch(e) { console.error("Budget fetch error", e); }
}

async function promptSetBudget() {
    const limit = prompt("Enter your monthly budget limit in USD:", monthlyBudget || "");
    if (limit && !isNaN(limit)) {
        monthlyBudget = parseFloat(limit);
        renderAll();
        try {
            await fetch('api/budget.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({budget: monthlyBudget})
            });
        } catch(e) {}
    }
}

function renderBudget(totalExpenseNum = null) {
    if (!monthlyBudget) {
        document.getElementById('budget-spent').textContent = "Not Set";
        document.getElementById('budget-progress').style.width = '0%';
        return;
    }
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    let spentThisMonth = 0;
    
    // Calculate local month spend if not provided natively by updateStats
    spentThisMonth = expensesData
        .filter(e => e.category_type === 'expense' && e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const formattedSpent = formatMoney(spentThisMonth);
    const formattedLimit = formatMoney(monthlyBudget);
    
    document.getElementById('budget-spent').textContent = `${formattedSpent} / ${formattedLimit}`;
    
    let pct = (spentThisMonth / monthlyBudget) * 100;
    if (pct > 100) pct = 100;
    
    const bar = document.getElementById('budget-progress');
    if (!bar) return;
    
    bar.style.width = pct + '%';
    
    if (pct >= 100) {
        bar.style.background = 'var(--danger-color)';
    } else if (pct >= 80) {
        bar.style.background = 'orange';
    } else {
        bar.style.background = 'var(--success-color)';
    }
}

// Receipt Image Compressor
function updateReceiptLabel(input) {
    const nameSpan = document.getElementById('receipt-name');
    if (input.files && input.files[0]) {
        const file = input.files[0];
        nameSpan.textContent = file.name;
        
        // Compress image to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX = 800; // Keep payload small for offline sync and DB
                let width = img.width;
                let height = img.height;
                if (width > height && width > MAX) {
                    height *= MAX / width; width = MAX;
                } else if (height > MAX) {
                    width *= MAX / height; height = MAX;
                }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                currentReceiptBase64 = canvas.toDataURL('image/jpeg', 0.6);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        nameSpan.textContent = '';
        currentReceiptBase64 = '';
    }
}

// CSV Exporter
function exportCSV() {
    if (expensesData.length === 0) return alert("No data to export.");
    
    let csvContent = "Date,Description,Category,Type,Amount (USD)\n";
    
    expensesData.forEach(e => {
        const desc = (e.description || e.category_name).replace(/"/g, '""'); // Escape quotes
        const type = e.category_type.toUpperCase();
        const amount = parseFloat(e.amount).toFixed(2);
        csvContent += `${e.date},"${desc}",${e.category_name},${type},${amount}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Expenses_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
