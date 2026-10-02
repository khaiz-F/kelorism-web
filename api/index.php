<?php

foreach (['app', 'framework/cache', 'framework/sessions', 'framework/views', 'logs'] as $dir) {
    @mkdir("/tmp/storage/$dir", 0777, true);
}

putenv('APP_STORAGE=/tmp/storage');
$_ENV['APP_STORAGE'] = '/tmp/storage';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';

require __DIR__.'/../public/index.php';
