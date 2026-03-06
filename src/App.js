import { Layout } from './Layout.js';
import { pagesConfig } from './pages.config.js';
import { renderHomePage } from './pages/home.js';

export function App() {
  const homeConfig = pagesConfig.home;

  return Layout({
    eyebrow: 'Escritório de Advocacia',
    title: homeConfig.title,
    subtitle: homeConfig.subtitle,
    content: renderHomePage()
  });
}
