const express = require('express');

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(express.json());

// Hocam logger'i en uste koydum, boylece hatali istekler de kayda dusuyor
app.use(logger);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API ayakta',
    endpoints: ['/tasks', '/reports/summary'],
  });
});

app.use('/tasks', taskRoutes);
app.use('/reports', reportRoutes);

// Bu ikisi en sonda olmak zorunda, yoksa normal route'lardan once calisiyorlar
app.use(notFound);
app.use(errorHandler);

module.exports = app;
