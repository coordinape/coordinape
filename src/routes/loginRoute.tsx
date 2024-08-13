import { Rainbowify } from 'features/rainbowkit/Rainbowify';
import { RequireAuth } from 'features/rainbowkit/RequireAuth';
import { Outlet, Route } from 'react-router-dom';

import { MainLayout } from '../components';

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
        <Rainbowify>
          <RequireAuth walletRequired={true}>
            <RedirectAfterLogin />
          </RequireAuth>
        </Rainbowify>
      }
    />
  </Route>,
];
