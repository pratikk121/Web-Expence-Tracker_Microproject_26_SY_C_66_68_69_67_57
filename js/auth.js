async function register(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const res = await fetch('api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (data.success) {
        message.style.color = 'lightgreen';
        message.textContent = 'Registration successful! Redirecting...';
        setTimeout(() => window.location.href = 'login.html', 1500);
    } else {
        message.style.color = 'red';
        message.textContent = data.message;
    }
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const res = await fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
        window.location.href = 'index.html';
    } else {
        message.style.color = 'red';
        message.textContent = data.message;
    }
}

// Check session function for protected pages
async function checkSession() {
    const res = await fetch('api/auth.php?action=check_session');
    const data = await res.json();
    return data.success;
}

async function logout() {
    await fetch('api/auth.php?action=logout', { method: 'POST' });
    window.location.href = 'login.html';
}
