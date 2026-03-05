const statusMap = {
  operational: 'Operacional',
  planned: 'Planejada',
  blocked: 'Bloqueada'
};

function createKpi(title, value) {
  const template = document.getElementById('kpi-template');
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector('h3').textContent = title;
  node.querySelector('strong').textContent = value;
  return node;
}

function createIntegrationCard(item) {
  const template = document.getElementById('integration-template');
  const node = template.content.firstElementChild.cloneNode(true);

  node.querySelector('h3').textContent = item.name;

  const badge = node.querySelector('.badge');
  badge.textContent = statusMap[item.status] || item.status;
  badge.classList.add(item.status);

  node.querySelector('.purpose').textContent = item.purpose;
  node.querySelector('.pending').textContent = item.pending_tasks;
  node.querySelector('.sync').textContent = item.last_sync || 'Sem sincronização';

  return node;
}

async function loadDashboard() {
  const response = await fetch('/api/dashboard/summary');
  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados da página inicial.');
  }

  return response.json();
}

(async function bootstrapPage() {
  const kpiContainer = document.getElementById('kpis');
  const grid = document.getElementById('integration-grid');

  try {
    const data = await loadDashboard();

    const kpis = [
      ['Integrações', data.totals.integrations],
      ['Operacionais', data.totals.operational],
      ['Planejadas', data.totals.planned],
      ['Bloqueadas', data.totals.blocked]
    ];

    kpis.forEach(([title, value]) => {
      kpiContainer.appendChild(createKpi(title, value));
    });

    data.integrations.forEach((item) => {
      grid.appendChild(createIntegrationCard(item));
    });
  } catch (error) {
    kpiContainer.innerHTML = '<p>Erro ao carregar indicadores.</p>';
    grid.innerHTML = `<p>${error.message}</p>`;
  }
})();
