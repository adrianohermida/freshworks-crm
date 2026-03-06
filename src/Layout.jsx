export function Layout({ title, content }) {
  return `
    <main class="container">
      <header>
        <p class="eyebrow">freshworks-crm</p>
        <h1>${title}</h1>
        <p>Página principal servida diretamente a partir da pasta <code>src/</code>.</p>
      </header>
      ${content}
    </main>
  `;
}
