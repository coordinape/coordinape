import { Outlet, Route } from 'react-router-dom';

import { MainLayout } from '../components';
import { RequireAuth } from '../features/auth';

import { RedirectAfterLogin } from './RedirectAfterLogin';

export const loginRoute = [
  <Route
    key={'login'}
    element={
      <MainLayout>
        <Outlet />
      </MainLayout>
    }
  >
    <Route
      path="login"
      element={
        <RequireAuth>
          <RedirectAfterLogin />
        </RequireAuth>
      }
    />
  </Route>,
];
