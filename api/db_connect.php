<?php
// api/db_connect.php

// api/db_connect.php

// Load configuration
$config = require_once __DIR__ . '/config.php';
$dbConfig = $config['db'];
$appConfig = $config['app'];

header('Content-Type: application/json');

try {
    // DSN includes charset for security
    $dsn = "mysql:host={$dbConfig['host']};dbname={$dbConfig['name']};charset={$dbConfig['charset']}";
    
    $conn = new PDO($dsn, $dbConfig['user'], $dbConfig['pass']);
    
    // Strict attributes
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // Native prepared statements

} catch(PDOException $e) {
    // Suppress technical details in production
    $message = ($appConfig['env'] === 'local' || $appConfig['debug']) 
        ? 'Connection failed: ' . $e->getMessage() 
        : 'A database connection error occurred. Please try again later.';
        
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $message]);
    exit();
}
?>
