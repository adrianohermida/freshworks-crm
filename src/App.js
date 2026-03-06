import { Layout } from './Layout.js';
import { renderHomePage } from './pages/home.js';

export function App() {
  return Layout({
    title: 'Hermida Maia Advocacia',
    content: renderHomePage()
  });
}
