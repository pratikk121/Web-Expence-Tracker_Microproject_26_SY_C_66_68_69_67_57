<?php
// api/expenses.php
require_once 'db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    // Fetch expenses
    // Optional filters: month (YYYY-MM), category_id
    $month = isset($_GET['month']) ? $_GET['month'] : date('Y-m'); // Default current month? Or all? Let's default to all if not specified, or current month. Let's support ?month=YYYY-MM
    // Actually simpler to just fetch all by default or limit?
    // Let's allow fetching by month or all.
    
    $sql = "SELECT e.*, c.name as category_name, c.type as category_type, c.icon as category_icon 
            FROM expenses e 
            JOIN categories c ON e.category_id = c.id 
            WHERE e.user_id = ?";
    $params = [$user_id];

    if (isset($_GET['month'])) {
        $sql .= " AND DATE_FORMAT(e.date, '%Y-%m') = ?";
        $params[] = $_GET['month'];
    }
    
    $sql .= " ORDER BY e.date DESC, e.id DESC";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $expenses = $stmt->fetchAll();
        
        // Output Sanitization for Frontend Protection
        foreach ($expenses as &$exp) {
            $exp['description'] = htmlspecialchars($exp['description'] ?? '', ENT_QUOTES, 'UTF-8');
            $exp['category_name'] = htmlspecialchars($exp['category_name'] ?? '', ENT_QUOTES, 'UTF-8');
        }
        
        echo json_encode(['success' => true, 'data' => $expenses]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }

} elseif ($method === 'POST') {
    // Add Expense
    $amount = $input['amount'] ?? '';
    $category_id = $input['category_id'] ?? '';
    $description = $input['description'] ?? '';
    $date = $input['date'] ?? date('Y-m-d');

    // Server-side validation
    if (empty($amount) || !is_numeric($amount) || $amount <= 0 || empty($category_id) || empty($date) || empty($description)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or missing required fields']);
        exit();
    }
    
    // Sanitize input before DB (PDO already protects against SQLi, but good to strip tags)
    $description = strip_tags($description);

    try {
        $stmt = $conn->prepare("INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $category_id, $amount, $description, $date]);
        echo json_encode(['success' => true, 'message' => 'Expense added', 'id' => $conn->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    // Delete Expense
    $id = isset($_GET['id']) ? $_GET['id'] : ($input['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Expense deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Expense not found or access denied']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    // Update Expense - simplified, typically via ID in URL or body
    // Let's assume body has everything including ID
    $id = $input['id'] ?? '';
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
        exit();
    }
    
    // We need to construct dynamic update query or just update all fields
    $amount = $input['amount'] ?? null;
    $category_id = $input['category_id'] ?? null;
    $description = $input['description'] ?? null;
    $date = $input['date'] ?? null;

    // Simple update of all provided fields
    $fields = [];
    $params = [];

    if ($amount !== null) { 
        if(!is_numeric($amount) || $amount <= 0) {
            http_response_code(400); echo json_encode(['success' => false, 'message' => 'Invalid amount']); exit();
        }
        $fields[] = "amount = ?"; $params[] = $amount; 
    }
    if ($category_id !== null) { $fields[] = "category_id = ?"; $params[] = $category_id; }
    if ($description !== null) { 
        if(empty(trim($description))) {
             http_response_code(400); echo json_encode(['success' => false, 'message' => 'Description cannot be empty']); exit();
        }
        $fields[] = "description = ?"; $params[] = strip_tags($description); 
    }
    if ($date !== null) { $fields[] = "date = ?"; $params[] = $date; }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit();
    }

    $params[] = $id;
    $params[] = $user_id;

    $sql = "UPDATE expenses SET " . implode(', ', $fields) . " WHERE id = ? AND user_id = ?";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
         if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Expense updated']);
        } else {
            // Could be not found or no change
            echo json_encode(['success' => true, 'message' => 'No changes made or expense not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
