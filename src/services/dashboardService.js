const { queryAll } = require('./database');

async function getDashboardSummary() {
  const integrations = await queryAll(
    `SELECT key, name, purpose, status, last_sync, pending_tasks, updated_at
     FROM integrations_status
     ORDER BY name ASC`
  );

  const operational = integrations.filter((item) => item.status === 'operational').length;
  const planned = integrations.filter((item) => item.status === 'planned').length;
  const blocked = integrations.filter((item) => item.status === 'blocked').length;

  return {
    totals: {
      integrations: integrations.length,
      operational,
      planned,
      blocked
    },
    integrations
  };
}

module.exports = {
  getDashboardSummary
};
