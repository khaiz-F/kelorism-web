<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

foreach (['app', 'framework/cache', 'framework/sessions', 'framework/views', 'logs'] as $dir) {
    @mkdir("/tmp/storage/$dir", 0777, true);
}

$_ENV['LARAVEL_STORAGE_PATH'] = '/tmp/storage';
putenv('LARAVEL_STORAGE_PATH=/tmp/storage');

if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
    die('vendor/autoload.php TIDAK ADA');
}

require __DIR__ . '/../public/index.php';