import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme on app start
const initializeTheme = () => {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let shouldBeDark = false;
  
  if (stored === 'dark') {
    shouldBeDark = true;
  } else if (stored === 'light') {
    shouldBeDark = false;
  } else {
    // Default to system preference
    shouldBeDark = prefersDark;
  }
  
  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

// Initialize theme before React renders
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
