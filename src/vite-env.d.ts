/// <reference types="vite/client" />

// Globals the Three.js / canvas modules attach for cross-component theming.
declare global {
  interface Window {
    __cineTheme?: (dark: boolean) => void;
    __hiveTheme?: () => void;
    __hiveSelected?: string | null;
  }
}

export {};
