import { lazy } from 'react';
import DefaultLayout from '../components/Layouts/DefaultLayout';
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
const SettingsPage = lazy(() => import("../pages/Apps/SettingsPage"));
const Error = lazy(() => import('../components/Error'));
import { Navigate, RouteObject } from 'react-router-dom';
import ProtectedRoute from './protectRoute';
import BlankLayout from '@/components/Layouts/BlankLayout';
import TaskList from '@/pages/Apps/TaskList';
import { EmptyVaultState } from '@/pages/Apps/EmptyVaultState';
import path from 'path';


const unProtectedRoutes: RouteObject[] = [
  // {
  //   path: '/auth/boxed-signin',
  //   element: <LoginBoxed />,
  // },

  {
    path: '/auth/boxed-signup',
    element: <RegisterBoxed />,
  },
  {
    path: '/auth/boxed-password-reset',
    element: <RecoverIdBoxed />,
  },

  {
    path: '/auth/cover-password-reset',
    element: <RecoverIdCover />,
  },

]

const detailLayoutPaths: RouteObject[] = [
  { path: '/', element: <Navigate to="/all_items" replace /> },
  { path: '/all_items', element: <TaskList /> },
  { path: '/personal', element: <TaskList /> },
  { path: '/trash', element: <TaskList /> },
  { path: '/pin', element: <TaskList /> },
   { path:"/Cell/:vaultId" , element: <EmptyVaultState  /> },
];

const navigateRoute: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [...detailLayoutPaths]
      },
      {
        element: <BlankLayout />,
        children: [
          {
            path: '/settings',
            element: <SettingsPage />
          }
        ]
      }
    ]
  },
  {
    element: <BlankLayout />,
    children: [...unProtectedRoutes]
  },
  {
    path: '*',
    element: <Error />,
  },
]
export { navigateRoute };
