<?php
// api/config.php - Global configuration template

// Default configurations (shared across environments)
$config = [
    'db' => [
        'host' => 'localhost',
        'name' => 'expense_tracker',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8'
    ],
    'app' => [
        'debug' => false, // Set to true for local development details
        'env' => 'production' 
    ]
];

// Load local overrides if they exist
$localConfigPath = __DIR__ . '/config.local.php';
if (file_exists($localConfigPath)) {
    $localConfig = include($localConfigPath);
    if (is_array($localConfig)) {
        // Recursively merge local overrides into the global config
        $config = array_replace_recursive($config, $localConfig);
    }
}

return $config;
