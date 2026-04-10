<?php
require_once 'db_connect.php';
require_once 'csrf_helper.php';
session_start();

// Verify CSRF for state-changing requests
verifyCSRF();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT monthly_budget FROM users WHERE id = :user_id");
        $stmt->execute(['user_id' => $user_id]);
        $budget = $stmt->fetchColumn();
        echo json_encode(['success' => true, 'budget' => $budget]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['budget'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
        exit();
    }
    try {
        $stmt = $conn->prepare("UPDATE users SET monthly_budget = :budget WHERE id = :user_id");
        $stmt->execute(['budget' => $data['budget'], 'user_id' => $user_id]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
