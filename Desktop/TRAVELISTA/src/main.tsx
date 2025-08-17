import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from './components/ui/sonner'
import React from 'react'

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
    <Toaster />
    <Sonner />
  </React.StrictMode>
);