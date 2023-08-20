import React from 'react';
import Index from '@/pages/AppList';

import App from '@/pages/App';

import PageList from '@/pages/App/PageList';

import Design from '@/pages/Design';

import AppCreate from '@/pages/AppCreate';
import { createBrowserRouter } from 'react-router-dom';



export interface RouteInfo {
  icon?: any;
  title?: string;
  path: string;
  hidden?: boolean;
  children?: RouteInfo[];
  redirectTo?: string;
  exact?: boolean;
  component?: any;
}

const baseRoutes = createBrowserRouter([

  {
    path: '/app/:appName',
    element: <App/>,
    children: [
      {
        path: 'pages',
        element: <PageList/>,
      },
      
    ],
  },
  {
    path: 'design/:id',
    element: <Design/>,
  },
  {
    path: '/create',
    element: <AppCreate/>,
  },

  {
    path: '/',
    element: <Index/>,
  },
]);

export { baseRoutes };
