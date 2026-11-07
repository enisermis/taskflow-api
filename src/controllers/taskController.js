const taskStore = require('../services/taskStore');
const { filterTasks, sortTasks, paginate } = require('../services/taskQuery');

// Hocam her fonksiyonda ayni kontrolu yazmamak icin id okumayi buraya aldim
function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ success: false, message: 'Gecersiz gorev id' });
    return null;
  }
  return id;
}

function sendNotFound(res, id) {
  res.status(404).json({ success: false, message: `${id} numarali gorev bulunamadi` });
}

function sendList(tasks, req, res) {
  const filtered = filterTasks(tasks, req.query);
  const sorted = sortTasks(filtered, req.query.sort, req.query.order);
  res.json({ success: true, ...paginate(sorted, req.query) });
}

function getTasks(req, res) {
  sendList(taskStore.getAll(), req, res);
}

function searchTasks(req, res) {
  const keyword = (req.query.keyword || '').trim().toLocaleLowerCase('tr');

  if (!keyword) {
    return res.status(400).json({ success: false, message: 'keyword parametresi zorunlu' });
  }

  // Sadece basliga bakmak yetmedi, aciklamada gecen kelimeyi de bulsun istedim
  const matches = taskStore.getAll().filter((task) => {
    const text = `${task.title} ${task.description}`.toLocaleLowerCase('tr');
    return text.includes(keyword);
  });

  sendList(matches, req, res);
}

function getTasksByAssignee(req, res) {
  const name = req.params.name.toLocaleLowerCase('tr');
  const tasks = taskStore
    .getAll()
    .filter((task) => task.assignee.toLocaleLowerCase('tr') === name);

  sendList(tasks, req, res);
}

function getTaskById(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const task = taskStore.getById(id);
  if (!task) return sendNotFound(res, id);

  res.json({ success: true, data: task });
}

function createTask(req, res) {
  const task = taskStore.create(req.body);
  res.status(201).json({ success: true, data: task });
}

function updateTask(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const task = taskStore.update(id, req.body);
  if (!task) return sendNotFound(res, id);

  res.json({ success: true, data: task });
}

function deleteTask(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  if (!taskStore.remove(id)) return sendNotFound(res, id);

  res.json({ success: true, message: `${id} numarali gorev silindi` });
}

module.exports = {
  getTasks,
  searchTasks,
  getTasksByAssignee,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
