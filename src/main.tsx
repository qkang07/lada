import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import "@arco-design/web-react/dist/css/arco.css";
import './index.css'
import { baseRoutes } from './routes';
import { loader } from '@monaco-editor/react';
import { initCompMan } from './components/CompManager';

loader.config({
  // paths: { vs: ((window as any).publicPath || '/') + 'monaco/min/vs' },
  paths: { vs: 'https://static.huolala.cn/npm/monaco-editor@0.36.1/min/vs' },
});

initCompMan()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={baseRoutes} />
)
