<?php
// Uji login MELALUI kernel aplikasi (tanpa server eksternal).
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// 1. GET /login — mulai sesi.
$req = Request::create('/login', 'GET');
$res = $kernel->handle($req);
$kernel->terminate($req, $res);

$jar = []; // [nama => [value, raw]]
foreach ($res->headers->getCookies() as $c) {
    $jar[$c->getName()] = $c->getValue();
}
echo "GET /login → HTTP ".$res->getStatusCode().", cookies: ".implode(', ', array_keys($jar))."\n";

// 2. Ambil CSRF token dari baris sesi yang baru ditulis.
$line = DB::table('sessions')->orderByDesc('last_activity')->first();
$payload = unserialize(Crypt::decryptString($line->payload));
$token = $payload['_token'] ?? null;
echo "session row: ".substr($line->id, 0, 12)."..., _token: ".($token ? 'ADA ('.strlen($token).' ch)' : 'TIDAK ADA')."\n";

// 3. POST /login dengan cookie sesi + X-XSRF-TOKEN.
$cookieHeader = 'laravel-session='.$jar['laravel-session'];
$req = Request::create('/login', 'POST', [
    'email' => 'khairunnisazahirasamsung@gmail.com',
    'password' => 'kelorism123',
], [], [], [
    'HTTP_COOKIE' => $cookieHeader,
    'HTTP_X_XSRF_TOKEN' => $jar['XSRF-TOKEN'],
]);
$req->setLaravelSession(app('session.store'));
$res = $kernel->handle($req);

echo "POST /login → HTTP ".$res->getStatusCode();
if ($res->headers->get('Location')) {
    echo " → ".$res->headers->get('Location');
}
echo "\n";
echo "auth.check: ".var_export(auth()->check(), true);
echo ", errors: ".json_encode(session('errors')?->all() ?: (object) [])."\n";

$kernel->terminate($req, $res);
