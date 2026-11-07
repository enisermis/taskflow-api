const reportService = require('../services/reportService');

function getCompleted(req, res) {
  res.json({ success: true, data: { count: reportService.countByStatus('completed') } });
}

function getPending(req, res) {
  res.json({ success: true, data: { count: reportService.countByStatus('pending') } });
}

function getSummary(req, res) {
  res.json({ success: true, data: reportService.getSummary() });
}

module.exports = { getCompleted, getPending, getSummary };
