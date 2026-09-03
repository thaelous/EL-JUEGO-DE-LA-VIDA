import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent benign ResizeObserver loop notifications from surfacing as uncaught errors
window.addEventListener('error', (e) => {
  if (
    typeof e.message === 'string' &&
    (e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
      e.message.includes('ResizeObserver loop limit exceeded'))
  ) {
    e.stopImmediatePropagation();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
