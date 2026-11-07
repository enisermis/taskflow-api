const fs = require('fs');
const path = require('path');

// Veritabani istenmedigi icin gorevleri JSON dosyasinda tutuyorum.
// Testler gercek veriyi bozmasin diye dosya yolunu env ile degistirebiliyorum.
const DATA_FILE =
  process.env.DATA_FILE || path.join(__dirname, '..', '..', 'data', 'tasks.json');

// Hocam son verilen id'yi ayri dosyada tutuyorum. Sadece listedeki en buyuk id'ye baksaydim
// en son gorev silininca ayni numara yeni goreve tekrar verilirdi.
const LAST_ID_FILE = path.join(path.dirname(DATA_FILE), 'lastId.json');

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });

  // Yazarken program kapanirsa dosya yarim kalmasin diye once gecici dosyaya yaziyorum
  const tempFile = `${file}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
  fs.renameSync(tempFile, file);
}

function saveTasks(tasks) {
  writeJson(DATA_FILE, tasks);
}

function getLastId(tasks) {
  const saved = fs.existsSync(LAST_ID_FILE)
    ? JSON.parse(fs.readFileSync(LAST_ID_FILE, 'utf-8')).lastId
    : 0;

  // Sayac dosyasi yoksa ya da geride kaldiysa listedeki en buyuk id'yi de hesaba katiyorum
  return tasks.reduce((max, task) => Math.max(max, task.id), saved);
}

function saveLastId(lastId) {
  writeJson(LAST_ID_FILE, { lastId });
}

function getAll() {
  return readTasks();
}

function getById(id) {
  return readTasks().find((task) => task.id === id);
}

function create(data) {
  const tasks = readTasks();

  const lastId = getLastId(tasks);
  const now = new Date().toISOString();

  const newTask = {
    id: lastId + 1,
    title: data.title,
    description: data.description,
    priority: data.priority,
    assignee: data.assignee,
    status: data.status || 'pending',
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  saveLastId(newTask.id);
  return newTask;
}

function update(id, data) {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  // Sadece izin verdigim alanlari aliyorum, biri body'de id gonderip degistiremesin
  const fields = ['title', 'description', 'priority', 'assignee', 'status'];
  for (const field of fields) {
    if (data[field] !== undefined) {
      tasks[index][field] = data[field];
    }
  }
  tasks[index].updatedAt = new Date().toISOString();

  saveTasks(tasks);
  return tasks[index];
}

function remove(id) {
  const tasks = readTasks();
  const remaining = tasks.filter((task) => task.id !== id);

  if (remaining.length === tasks.length) {
    return false;
  }

  // Silmeden once son id'yi kaydediyorum, yoksa silinen en buyuk numara kaybolurdu
  saveLastId(getLastId(tasks));
  saveTasks(remaining);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
