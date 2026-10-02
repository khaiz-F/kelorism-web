<?php

ini_set('display_errors', '1');
error_reporting(E_ALL);

foreach (['app', 'framework/cache', 'framework/sessions', 'framework/views', 'logs'] as $dir) {
    @mkdir("/tmp/storage/$dir", 0777, true);
}
$_ENV['LARAVEL_STORAGE_PATH'] = '/tmp/storage';
putenv('LARAVEL_STORAGE_PATH=/tmp/storage');

register_shutdown_function(function () {
    $e = error_get_last();
    if ($e) {
        echo '<pre>FATAL: ' . print_r($e, true) . '</pre>';
    }
});

try {
    require __DIR__ . '/../public/index.php';
} catch (Throwable $e) {
    echo '<pre>' . get_class($e) . ': ' . $e->getMessage() . "\n"
        . $e->getFile() . ':' . $e->getLine() . '</pre>';
}