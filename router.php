<?php
// router.php - Fixes MIME types for the PHP built-in server
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    // Explicitly set MIME types for problematic files
    if (preg_match('/\.css$/', $path)) {
        header("Content-Type: text/css");
    } elseif (preg_match('/\.js$/', $path)) {
        header("Content-Type: application/javascript");
    } elseif (preg_match('/\.json$/', $path)) {
        header("Content-Type: application/json");
    } elseif (preg_match('/\.php$/', $path)) {
        // Special case for manifest.php which should be served as manifest+json
        // but it already has its own header() call.
        return false;
    }
    return false; // Serve the file as is
}

// Default to index.html for root or missing routes (SPA-ish)
if ($path === '/' || !file_exists($file)) {
    include 'index.html';
    return true;
}

return false;
?>
