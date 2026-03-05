const express = require('express');
const { getDashboardSummary } = require('../services/dashboardService');

const router = express.Router();

router.get('/summary', async (_request, response) => {
  try {
    const summary = await getDashboardSummary();
    response.json(summary);
  } catch (error) {
    response.status(500).json({
      message: 'Falha ao carregar dados operacionais do dashboard.',
      details: error.message
    });
  }
});

module.exports = router;
