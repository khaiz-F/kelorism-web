// Uji login via CDP di host localhost.
const CHROME_JSON = 'http://127.0.0.1:9222/json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const target = await (await fetch(CHROME_JSON)).json().then((t) => t.find((x) => x.type === 'page'));
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
    new Promise((resolve) => {
        const mid = ++id;
        pending.set(mid, resolve);
        ws.send(JSON.stringify({ id: mid, method, params }));
    });

const logs = [];
ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result);
        pending.delete(msg.id);
        return;
    }
    const { method, params } = msg;
    if (method === 'Runtime.consoleAPICalled')
        logs.push(`[console.${params.type}] ${params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
    if (method === 'Runtime.exceptionThrown')
        logs.push(`[EXCEPTION] ${params.exceptionDetails.exception?.description ?? params.exceptionDetails.text}`);
    if (method === 'Log.entryAdded')
        logs.push(`[${params.entry.source}:${params.entry.level}] ${params.entry.text}`);
    if (method === 'Network.responseReceived') {
        const s = params.response.status;
        if (s >= 400 || s === 302) logs.push(`[HTTP ${s}] ${params.response.url} -> ${params.response.headers.Location ?? ''}`);
    }
};

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');

await send('Page.navigate', { url: 'http://localhost:8000/login' });
await sleep(5000);

const fillResult = await send('Runtime.evaluate', {
    expression: `(() => {
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        const email = document.querySelector('#email');
        const pass = document.querySelector('#password');
        if (!email || !pass) return 'INPUT TIDAK KETEMU';
        set.call(email, 'superadmin@kelorism.test');
        email.dispatchEvent(new Event('input', { bubbles: true }));
        set.call(pass, 'password');
        pass.dispatchEvent(new Event('input', { bubbles: true }));
        const btn = document.querySelector('button[type="submit"]');
        if (!btn) return 'TOMBOL TIDAK KETEMU';
        btn.click();
        return 'SUBMIT DIKLIK';
    })()`,
    returnByValue: true,
});
console.log('>>', fillResult.result?.value ?? JSON.stringify(fillResult));

await sleep(6000);

const finalUrl = await send('Runtime.evaluate', {
    expression: `location.host + location.pathname + ' | ' + document.body.innerText.slice(0, 120).replace(/\\n/g, ' / ')`,
    returnByValue: true,
});
console.log('>> HASIL AKHIR:', finalUrl.result?.value);
console.log('--- LOG BROWSER ---');
logs.length ? logs.forEach((l) => console.log(l)) : console.log('(bersih, tanpa error)');
ws.close();
process.exit(0);
