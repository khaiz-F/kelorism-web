<?php

foreach (['app', 'framework/cache', 'framework/sessions', 'framework/views', 'logs'] as $dir) {
    @mkdir("/tmp/storage/$dir", 0777, true);
}

$_ENV['LARAVEL_STORAGE_PATH'] = '/tmp/storage';
putenv('LARAVEL_STORAGE_PATH=/tmp/storage');

require __DIR__ . '/../public/index.php';