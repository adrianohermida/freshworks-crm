import { Layout } from './Layout.jsx';
import { renderHomePage } from './pages/home.js';

export function App() {
  return Layout({
    title: 'Site principal restaurado',
    content: renderHomePage()
  });
}
