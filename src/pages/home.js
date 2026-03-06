export function renderHomePage() {
  return `
    <section class="setup">
      <h2>Links úteis</h2>
      <div class="setup-grid">
        <article class="setup-card">
          <h3>Status</h3>
          <p>Home principal ativa (origem: <code>src/</code>).</p>
        </article>
        <article class="setup-card">
          <h3>Script SQL</h3>
          <p>
            Se necessário, acesse:
            <a href="./sql-server-setup.sql" target="_blank" rel="noreferrer">sql-server-setup.sql</a>
          </p>
        </article>
      </div>
    </section>
  `;
}
