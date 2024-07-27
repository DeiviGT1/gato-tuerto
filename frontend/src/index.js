// src/index.js
import React from 'react';
import "./index.css"
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
    <SpeedInsights  />
    <Analytics />
  </BrowserRouter>
);
