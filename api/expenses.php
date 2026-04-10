<?php
// api/expenses.php
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
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

function uploadBase64Image($base64_string) {
    if (empty($base64_string)) return null;
    $upload_dir = 'uploads/';
    if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);
    
    // Split the string on commas
    // data:image/jpeg;base64,....
    $data = explode(',', $base64_string);
    if (count($data) < 2) return null;
    
    $image_data = base64_decode($data[1]);
    $file_name = uniqid() . '.jpg';
    $file_path = $upload_dir . $file_name;
    
    file_put_contents($file_path, $image_data);
    return $file_path; // This will return 'uploads/id.jpg' which the frontend can use as 'api/' + URL
}

if ($method === 'GET') {
    // ---- LAZY AUTO-LOGGER FOR RECURRING EXPENSES ----
    try {
        $stmt = $conn->prepare("SELECT * FROM recurring_expenses WHERE user_id = ? AND next_run_date <= CURDATE()");
        $stmt->execute([$user_id]);
        $due_recurring = $stmt->fetchAll();
        
        foreach ($due_recurring as $rec) {
            $next_run = new DateTime($rec['next_run_date']);
            $today = new DateTime();
            
            while ($next_run <= $today) {
                // Insert the expense
                $ins = $conn->prepare("INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES (?, ?, ?, ?, ?)");
                $ins->execute([$user_id, $rec['category_id'], $rec['amount'], $rec['description'] . ' (Auto)', $next_run->format('Y-m-d')]);
                
                // Increment next_run
                if ($rec['period'] === 'weekly') {
                    $next_run->modify('+1 week');
                } elseif ($rec['period'] === 'monthly') {
                    $next_run->modify('+1 month');
                } elseif ($rec['period'] === 'yearly') {
                    $next_run->modify('+1 year');
                } else {
                    break;
                }
            }
            
            // Update the recurring record
            $upd = $conn->prepare("UPDATE recurring_expenses SET next_run_date = ? WHERE id = ?");
            $upd->execute([$next_run->format('Y-m-d'), $rec['id']]);
        }
    } catch (PDOException $e) {
        // Just log or ignore auto-logger errors
    }
    // --------------------------------------------------

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
        
        foreach ($expenses as &$exp) {
            $exp['description'] = htmlspecialchars($exp['description'] ?? '', ENT_QUOTES, 'UTF-8');
            $exp['category_name'] = htmlspecialchars($exp['category_name'] ?? '', ENT_QUOTES, 'UTF-8');
            // Format receipt URL for frontend
            if ($exp['receipt_url']) {
                $exp['receipt_url'] = 'api/' . $exp['receipt_url'];
            }
        }
        
        echo json_encode(['success' => true, 'data' => $expenses]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }

} elseif ($method === 'POST') {
    $amount = filter_var($input['amount'] ?? '', FILTER_VALIDATE_FLOAT);
    $category_id = filter_var($input['category_id'] ?? '', FILTER_VALIDATE_INT);
    $description = trim($input['description'] ?? '');
    $date = $input['date'] ?? date('Y-m-d');
    $receipt_base64 = $input['receipt_base64'] ?? '';
    $recurring_period = $input['recurring_period'] ?? '';

    if ($amount === false || $amount <= 0 || $category_id === false || empty($date) || empty($description)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or missing required fields']);
        exit();
    }
    
    // Sanitize description for database storage
    $description = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
    $receipt_url = uploadBase64Image($receipt_base64);

    try {
        $stmt = $conn->prepare("INSERT INTO expenses (user_id, category_id, amount, description, date, receipt_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $category_id, $amount, $description, $date, $receipt_url]);
        $expense_id = $conn->lastInsertId();
        
        if (!empty($recurring_period) && in_array($recurring_period, ['weekly', 'monthly', 'yearly'])) {
            // Calculate next run date
            $next_run = new DateTime($date);
            $next_run->modify('+1 ' . rtrim($recurring_period, 'ly')); // weekly -> +1 week, monthly -> +1 month, yearly -> +1 year
            // wait, rtrim('monthly', 'ly') = 'month', rtrim('weekly','ly') = 'week', rtrim('yearly', 'ly') = 'year'. Yes, it works for DateTime!
            
            $stmt = $conn->prepare("INSERT INTO recurring_expenses (user_id, category_id, amount, description, period, next_run_date) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $category_id, $amount, $description, $recurring_period, $next_run->format('Y-m-d')]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Expense added', 'id' => $expense_id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : ($input['id'] ?? '');

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
        exit();
    }

    try {
        // Optional: delete receipt image file if it exists
        $stmt = $conn->prepare("SELECT receipt_url FROM expenses WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        $exp = $stmt->fetch();
        if ($exp && $exp['receipt_url']) {
            if (file_exists($exp['receipt_url'])) unlink($exp['receipt_url']);
        }
        
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
    $id = $input['id'] ?? '';
    
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
        exit();
    }
    
    $amount = $input['amount'] ?? null;
    $category_id = $input['category_id'] ?? null;
    $description = $input['description'] ?? null;
    $date = $input['date'] ?? null;
    $receipt_base64 = $input['receipt_base64'] ?? null;

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
        $description = trim($description);
        if(empty($description)) {
             http_response_code(400); echo json_encode(['success' => false, 'message' => 'Description cannot be empty']); exit();
        }
        $fields[] = "description = ?"; 
        $params[] = htmlspecialchars($description, ENT_QUOTES, 'UTF-8'); 
    }
    if ($date !== null) { $fields[] = "date = ?"; $params[] = $date; }
    if ($receipt_base64 !== null && !empty($receipt_base64)) {
        $receipt_url = uploadBase64Image($receipt_base64);
        if ($receipt_url) {
            $fields[] = "receipt_url = ?"; $params[] = $receipt_url;
        }
    }

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
            echo json_encode(['success' => true, 'message' => 'No changes made or expense not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
