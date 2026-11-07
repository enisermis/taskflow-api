const { PRIORITIES, STATUSES } = require('../middleware/validateTask');

const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];

// Alfabetik siralayinca high, low, medium oluyordu. Oncelik icin ayri sira verdim.
const PRIORITY_RANK = { low: 1, medium: 2, high: 3 };

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function filterTasks(tasks, query) {
  let result = tasks;

  if (query.status !== undefined) {
    if (!STATUSES.includes(query.status)) {
      throw badRequest(`status su degerlerden biri olmali: ${STATUSES.join(', ')}`);
    }
    result = result.filter((task) => task.status === query.status);
  }

  if (query.priority !== undefined) {
    if (!PRIORITIES.includes(query.priority)) {
      throw badRequest(`priority su degerlerden biri olmali: ${PRIORITIES.join(', ')}`);
    }
    result = result.filter((task) => task.priority === query.priority);
  }

  return result;
}

function sortTasks(tasks, sort, order) {
  if (sort === undefined) {
    return tasks;
  }
  if (!SORTABLE_FIELDS.includes(sort)) {
    throw badRequest(`sort su alanlardan biri olmali: ${SORTABLE_FIELDS.join(', ')}`);
  }
  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    throw badRequest('order sadece asc veya desc olabilir');
  }

  const direction = order === 'desc' ? -1 : 1;

  // sort() orijinal diziyi degistirmesin diye kopyasini siraliyorum
  return [...tasks].sort((a, b) => {
    if (sort === 'priority') {
      return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * direction;
    }
    return String(a[sort]).localeCompare(String(b[sort]), 'tr') * direction;
  });
}

function readPositiveInt(value, name, fallback) {
  if (value === undefined) {
    return fallback;
  }
  if (!/^[1-9]\d*$/.test(value)) {
    throw badRequest(`${name} 1 veya daha buyuk bir tam sayi olmali`);
  }
  return Number(value);
}

function paginate(tasks, query) {
  const page = readPositiveInt(query.page, 'page', 1);
  const limit = readPositiveInt(query.limit, 'limit', 10);
  const start = (page - 1) * limit;

  return {
    page,
    limit,
    total: tasks.length,
    totalPages: Math.ceil(tasks.length / limit),
    data: tasks.slice(start, start + limit),
  };
}

module.exports = { filterTasks, sortTasks, paginate };
