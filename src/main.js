import { App } from './App.js';

function bootstrap() {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Elemento #app não encontrado.');
  }

  root.innerHTML = App();
}

bootstrap();
