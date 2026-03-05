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

async function loadJsonOrThrow(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Falha em ${url}`);
  }

  return response.json();
}

async function loadDashboard() {
  try {
    return await loadJsonOrThrow('./api/dashboard/summary');
  } catch (_apiError) {
    return loadJsonOrThrow('./dashboard-summary.json');
  }
}

(async function bootstrapPage() {
  const kpiContainer = document.getElementById('kpis');
  const grid = document.getElementById('integration-grid');
  const sourceBadge = document.getElementById('data-source');

  try {
    const data = await loadDashboard();

    const isStaticMode = typeof data.integrations?.[0]?.last_sync === 'string'
      && data.integrations[0].last_sync.includes('modo estático');

    sourceBadge.textContent = isStaticMode
      ? 'Modo GitHub Pages (dados estáticos)'
      : 'Modo servidor local (API + SQLite)';

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
    sourceBadge.textContent = 'Falha ao carregar dados';
    kpiContainer.innerHTML = '<p>Erro ao carregar indicadores.</p>';
    grid.innerHTML = `<p>${error.message}</p>`;
  }
})();
