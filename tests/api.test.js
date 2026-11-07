const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Testler gercek data/tasks.json dosyasina dokunmasin diye gecici klasor kullaniyorum
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-'));
process.env.DATA_FILE = path.join(tempDir, 'tasks.json');
process.env.LOG_FILE = path.join(tempDir, 'requests.log');
fs.copyFileSync(path.join(__dirname, '..', 'data', 'tasks.json'), process.env.DATA_FILE);

const app = require('../src/app');

let server;
let baseUrl;

async function api(method, url, body) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  const res = await fetch(baseUrl + url, options);
  return { status: res.status, body: await res.json() };
}

const yeniGorev = {
  title: 'Swagger notlarini hazirla',
  description: 'Backend uclari yazilacak',
  priority: 'medium',
  assignee: 'zeynep',
};

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  // Son logun yazilmasini bekliyorum, yoksa klasor ondan once siliniyor
  await new Promise((resolve) => setTimeout(resolve, 100));
  server.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('CRUD: ekle, detay, guncelle, sil', async () => {
  const created = await api('POST', '/tasks', yeniGorev);
  assert.strictEqual(created.status, 201);
  assert.strictEqual(created.body.data.status, 'pending');
  const id = created.body.data.id;

  const detail = await api('GET', `/tasks/${id}`);
  assert.strictEqual(detail.status, 200);
  assert.strictEqual(detail.body.data.title, yeniGorev.title);

  const updated = await api('PUT', `/tasks/${id}`, { status: 'completed', id: 999 });
  assert.strictEqual(updated.status, 200);
  assert.strictEqual(updated.body.data.status, 'completed');
  assert.strictEqual(updated.body.data.id, id);
  assert.strictEqual(updated.body.data.title, yeniGorev.title);

  const deleted = await api('DELETE', `/tasks/${id}`);
  assert.strictEqual(deleted.status, 200);
  assert.strictEqual((await api('GET', `/tasks/${id}`)).status, 404);
});

test('silinen id tekrar kullanilmaz', async () => {
  const first = await api('POST', '/tasks', yeniGorev);
  const second = await api('POST', '/tasks', yeniGorev);
  await api('DELETE', `/tasks/${first.body.data.id}`);
  const third = await api('POST', '/tasks', yeniGorev);
  assert.ok(third.body.data.id > second.body.data.id);
  await api('DELETE', `/tasks/${second.body.data.id}`);
  await api('DELETE', `/tasks/${third.body.data.id}`);
});

test('en son gorev silinince de id tekrar kullanilmaz', async () => {
  const last = await api('POST', '/tasks', yeniGorev);
  await api('DELETE', `/tasks/${last.body.data.id}`);
  const next = await api('POST', '/tasks', yeniGorev);
  assert.ok(next.body.data.id > last.body.data.id);
  await api('DELETE', `/tasks/${next.body.data.id}`);
});

test('olmayan ve gecersiz id', async () => {
  assert.strictEqual((await api('GET', '/tasks/9999')).status, 404);
  assert.strictEqual((await api('PUT', '/tasks/9999', { status: 'pending' })).status, 404);
  assert.strictEqual((await api('DELETE', '/tasks/9999')).status, 404);
  assert.strictEqual((await api('GET', '/tasks/abc')).status, 400);
});

test('filtreleme', async () => {
  const completed = await api('GET', '/tasks?status=completed');
  assert.strictEqual(completed.status, 200);
  assert.ok(completed.body.data.every((t) => t.status === 'completed'));
  assert.ok(completed.body.data.length > 0);

  const high = await api('GET', '/tasks?priority=high');
  assert.ok(high.body.data.every((t) => t.priority === 'high'));
  assert.ok(high.body.data.length > 0);

  assert.strictEqual((await api('GET', '/tasks?status=yanlis')).status, 400);
  assert.strictEqual((await api('GET', '/tasks?priority=yanlis')).status, 400);
});

test('arama', async () => {
  const result = await api('GET', '/tasks/search?keyword=backend');
  assert.strictEqual(result.status, 200);
  assert.ok(result.body.data.length > 0);

  const upper = await api('GET', '/tasks/search?keyword=BACKEND');
  assert.strictEqual(upper.body.total, result.body.total);

  assert.strictEqual((await api('GET', '/tasks/search')).status, 400);
});

test('kullaniciya gore listeleme', async () => {
  const result = await api('GET', '/tasks/assignee/musa');
  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.body.total, 2);
  assert.ok(result.body.data.every((t) => t.assignee === 'musa'));
  assert.strictEqual((await api('GET', '/tasks/assignee/kimseyok')).body.total, 0);
});

test('sayfalama', async () => {
  const first = await api('GET', '/tasks?page=1&limit=3');
  assert.strictEqual(first.body.data.length, 3);
  assert.strictEqual(first.body.total, 4);
  assert.strictEqual(first.body.totalPages, 2);

  const second = await api('GET', '/tasks?page=2&limit=3');
  assert.strictEqual(second.body.data.length, 1);

  assert.strictEqual((await api('GET', '/tasks?page=0')).status, 400);
  assert.strictEqual((await api('GET', '/tasks?limit=abc')).status, 400);
});

test('siralama', async () => {
  const asc = await api('GET', '/tasks?sort=createdAt');
  const dates = asc.body.data.map((t) => t.createdAt);
  assert.deepStrictEqual(dates, [...dates].sort());

  const desc = await api('GET', '/tasks?sort=createdAt&order=desc');
  assert.deepStrictEqual(desc.body.data.map((t) => t.createdAt), [...dates].reverse());

  const priority = await api('GET', '/tasks?sort=priority&order=desc');
  assert.strictEqual(priority.body.data[0].priority, 'high');
  assert.strictEqual(priority.body.data.at(-1).priority, 'low');

  assert.strictEqual((await api('GET', '/tasks?sort=yanlis')).status, 400);
  assert.strictEqual((await api('GET', '/tasks?sort=title&order=yanlis')).status, 400);
});

test('dogrulama hatalari 400 doner', async () => {
  const empty = await api('POST', '/tasks', {});
  assert.strictEqual(empty.status, 400);
  assert.strictEqual(empty.body.errors.length, 4);

  const badPriority = await api('POST', '/tasks', { ...yeniGorev, priority: 'acil' });
  assert.strictEqual(badPriority.status, 400);

  const shortTitle = await api('POST', '/tasks', { ...yeniGorev, title: 'ab' });
  assert.strictEqual(shortTitle.status, 400);

  const numberAssignee = await api('POST', '/tasks', { ...yeniGorev, assignee: 5 });
  assert.strictEqual(numberAssignee.status, 400);

  assert.strictEqual((await api('PUT', '/tasks/1', {})).status, 400);
  assert.strictEqual((await api('PUT', '/tasks/1', { status: 'bitti' })).status, 400);
  assert.strictEqual((await api('POST', '/tasks', '{bozuk json')).status, 400);
  assert.strictEqual((await api('POST', '/tasks', '[1,2]')).status, 400);
});

test('raporlar', async () => {
  const completed = await api('GET', '/reports/completed');
  const pending = await api('GET', '/reports/pending');
  const summary = await api('GET', '/reports/summary');

  assert.strictEqual(summary.status, 200);
  assert.strictEqual(summary.body.data.completed, completed.body.data.count);
  assert.strictEqual(summary.body.data.pending, pending.body.data.count);
  assert.strictEqual(
    summary.body.data.completed + summary.body.data.pending + summary.body.data.inProgress,
    summary.body.data.totalTasks,
  );
});

test('logger istekleri dosyaya yazar', async () => {
  await api('GET', '/tasks/1');
  await new Promise((resolve) => setTimeout(resolve, 100));
  const log = fs.readFileSync(process.env.LOG_FILE, 'utf-8');
  assert.match(log, /\[\d{4}-\d{2}-\d{2}T.*\] GET \/tasks\/1 200/);
});

test('olmayan adres 404 doner', async () => {
  assert.strictEqual((await api('GET', '/yanlis-adres')).status, 404);
});
