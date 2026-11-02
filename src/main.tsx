import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { GuideProvider } from './context/GuideContext';
import './styles/site.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <GuideProvider>
          <App />
        </GuideProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
