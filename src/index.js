import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from './App';
import Authorization from './components/Authorization/Authorization';

import './index.scss';

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Authorization />,
  },
  {
    path: "/*",
    element: <App />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
