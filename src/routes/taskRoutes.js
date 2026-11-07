const express = require('express');

const taskController = require('../controllers/taskController');
const { validateCreate, validateUpdate } = require('../middleware/validateTask');

const router = express.Router();

// Hocam /search ve /assignee'yi bilerek /:id'nin ustune aldim.
// Altta kalinca express "search" kelimesini id saniyor, ben de ilk basta buna takildim.
router.get('/search', taskController.searchTasks);
router.get('/assignee/:name', taskController.getTasksByAssignee);

router.get('/', taskController.getTasks);
router.post('/', validateCreate, taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validateUpdate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
