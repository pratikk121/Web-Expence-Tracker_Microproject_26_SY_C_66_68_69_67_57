<?php
// api/config.php - Global configuration template

// Default configurations (supports local and environment-based cloud hosting)
$config = [
    'db' => [
        'host' => getenv('MYSQLHOST') ?: 'localhost',
        'name' => getenv('MYSQLDATABASE') ?: 'expense_tracker',
        'user' => getenv('MYSQLUSER') ?: 'root',
        'pass' => getenv('MYSQLPASSWORD') !== false ? getenv('MYSQLPASSWORD') : '',
        'port' => getenv('MYSQLPORT') ?: '3306',
        'charset' => 'utf8'
    ],
    'app' => [
        'debug' => getenv('APP_DEBUG') === 'true' || true,
        'env' => getenv('APP_ENV') ?: 'local' 
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
