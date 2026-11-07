const taskStore = require('./taskStore');

function countBy(tasks, field) {
  const counts = {};
  for (const task of tasks) {
    counts[task[field]] = (counts[task[field]] || 0) + 1;
  }
  return counts;
}

function countByStatus(status) {
  return taskStore.getAll().filter((task) => task.status === status).length;
}

function getSummary() {
  const tasks = taskStore.getAll();
  const completed = tasks.filter((task) => task.status === 'completed').length;

  return {
    totalTasks: tasks.length,
    completed,
    pending: tasks.filter((task) => task.status === 'pending').length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    // Hic gorev yokken 0'a bolme olmasin diye kontrol ekledim
    completionRate: tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100),
    byPriority: countBy(tasks, 'priority'),
    byAssignee: countBy(tasks, 'assignee'),
  };
}

module.exports = { countByStatus, getSummary };
