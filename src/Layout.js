export function Layout({ eyebrow, title, subtitle, content }) {
  return `
    <main class="container">
      <header class="hero">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </header>
      ${content}
    </main>
  `;
}
