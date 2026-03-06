export function renderHomePage() {
  return `
    <section class="setup">
      <h2>Áreas de Atuação</h2>
      <div class="setup-grid">
        <article class="setup-card">
          <h3>Cível e Empresarial</h3>
          <p>Consultivo e contencioso para contratos, responsabilidade civil e relações empresariais.</p>
        </article>
        <article class="setup-card">
          <h3>Trabalhista</h3>
          <p>Defesa técnica em demandas trabalhistas e prevenção de riscos para empregadores.</p>
        </article>
        <article class="setup-card">
          <h3>Família e Sucessões</h3>
          <p>Atendimento humanizado para divórcios, guarda, inventários e planejamento sucessório.</p>
        </article>
      </div>
    </section>

    <section class="setup">
      <h2>Contato</h2>
      <div class="setup-grid">
        <article class="setup-card">
          <h3>Atendimento</h3>
          <p>Segunda a sexta, 9h às 18h.</p>
          <p><strong>E-mail:</strong> contato@hermidamaia.adv.br</p>
          <p><strong>Telefone:</strong> (00) 0000-0000</p>
        </article>
      </div>
    </section>
  `;
}
