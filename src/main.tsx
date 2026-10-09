import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pages are prerendered at build time; hydrate when markup is present (production),
// otherwise render from scratch (dev server).
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
