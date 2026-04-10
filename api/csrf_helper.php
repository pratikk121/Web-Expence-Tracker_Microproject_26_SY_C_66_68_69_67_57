<?php
// api/csrf_helper.php

/**
 * Verifies the X-CSRF-Token header against the current session token.
 * Should be called at the top of any state-changing endpoint (POST, PUT, DELETE).
 */
function verifyCSRF() {
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Only check state-changing methods
    if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
        // CSRF check is only necessary if the user is authenticated via session
        if (!isset($_SESSION)) {
            session_start();
        }
        
        if (isset($_SESSION['user_id'])) {
            $headers = getallheaders();
            $token = $headers['X-CSRF-Token'] ?? null;
            
            if (!$token || !isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
                http_response_code(403);
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'CSRF verification failed. Missing or invalid security token.']);
                exit();
            }
        }
    }
}
