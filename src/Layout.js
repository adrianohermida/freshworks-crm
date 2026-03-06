export function Layout({ title, content }) {
  return `
    <main class="container">
      <header class="hero">
        <p class="eyebrow">Escritório de Advocacia</p>
        <h1>${title}</h1>
        <p class="subtitle">Atuação estratégica, técnica e humana para pessoas e empresas.</p>
      </header>
      ${content}
    </main>
  `;
}
