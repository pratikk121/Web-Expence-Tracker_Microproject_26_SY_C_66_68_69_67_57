<?php
// api/auth.php
require_once 'db_connect.php';
session_start();

// Helper to send JSON response
function sendResponse($success, $message = '', $data = []) {
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'register') {
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($username) || empty($email) || empty($password)) {
            sendResponse(false, 'All fields are required');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(false, 'Invalid email format');
        }

        $username = htmlspecialchars(strip_tags($username), ENT_QUOTES, 'UTF-8');

        // Check if user exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->rowCount() > 0) {
            sendResponse(false, 'Username or Email already exists');
        }

        // Hash password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        try {
            $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $password_hash]);
            sendResponse(true, 'Registration successful');
        } catch (PDOException $e) {
            sendResponse(false, 'Registration failed: ' . $e->getMessage());
        }

    } elseif ($action === 'login') {
        $username = $data['username'] ?? ''; // Can be username or email in UI, but let's stick to username for now or allow both loop.
        // Let's assume username for simplicity or email. Let's start with email or username.
        // Form says username/email? Let's check plan. Plan didn't specify. I'll accept 'username' field but check both columns or just username.
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            sendResponse(false, 'All fields are required');
        }

        $stmt = $conn->prepare("SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $username]); // Check both
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Sanitize output just to be absolutely safe
            $safe_username = htmlspecialchars($user['username'], ENT_QUOTES, 'UTF-8');
            sendResponse(true, 'Login successful', ['user' => ['id' => $user['id'], 'username' => $safe_username]]);
        } else {
            sendResponse(false, 'Invalid credentials');
        }

    } elseif ($action === 'logout') {
        session_destroy();
        sendResponse(true, 'Logged out successfully');
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'check_session') {
        if (isset($_SESSION['user_id'])) {
            $safe_username = htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8');
            sendResponse(true, 'Authenticated', ['user' => ['id' => $_SESSION['user_id'], 'username' => $safe_username]]);
        } else {
            sendResponse(false, 'Not authenticated');
        }
    }
}
?>
