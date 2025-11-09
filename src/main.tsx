// src/main.tsx (Updated)

import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './app/store';

// Route Components
import AppLayout from './routes/AppLayout';
import Templates from './routes/Templates';
import Outcomes from './routes/Outcomes';
import Settings from './routes/Settings';
import LessonPlanner from './routes/LessonPlanner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // AppLayout is now the shell for ALL pages.
    children: [
      { index: true, path: 'planner', element: <LessonPlanner /> }, // Planner is now a child.
      { path: 'templates', element: <Templates /> },
      { path: 'outcomes', element: <Outcomes /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);