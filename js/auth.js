async function register(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const res = await fetch('api/auth.php?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
    if (data.success) {
        message.style.color = '#ffffff';
        message.textContent = 'Registration successful! Redirecting...';
        setTimeout(() => window.location.href = 'login.html', 1500);
    } else {
        message.style.color = 'var(--danger-color)';
        message.textContent = data.message || data.error;
    }
    } catch (e) {
        message.style.color = 'var(--danger-color)';
        message.textContent = 'You are offline. Cannot register right now.';
    }
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const res = await fetch('api/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem('offline_user', 'true');
            localStorage.setItem('offline_username', username);
            window.location.href = 'index.html';
        } else {
            message.style.color = 'var(--danger-color)';
            message.textContent = data.message || data.error;
        }
    } catch (e) {
        message.style.color = 'var(--danger-color)';
        message.textContent = 'You are offline. Cannot login right now.';
    }
}

// Check session function for protected pages
async function checkSession() {
    try {
        const res = await fetch('api/auth.php?action=check_session');
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('offline_user', 'true');
        } else {
            localStorage.removeItem('offline_user');
        }
        return data.success;
    } catch (e) {
        // Offline mode fallback
        return localStorage.getItem('offline_user') === 'true';
    }
}

async function logout() {
    try {
        await fetch('api/auth.php?action=logout', { method: 'POST' });
    } catch (e) {
        console.log("Logged out offline");
    }
    localStorage.removeItem('offline_user');
    window.location.href = 'login.html';
}
