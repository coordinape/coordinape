import { Rainbowify } from 'features/rainbowkit/Rainbowify';
import { RequireAuth } from 'features/rainbowkit/RequireAuth';
import { Outlet, Route } from 'react-router-dom';

import { RedirectAfterLogin } from './RedirectAfterLogin';

export const loginRoute = [
  <Route
    key={'login'}
    element={
      <Rainbowify>
        <Outlet />
      </Rainbowify>
    }
  >
    <Route
      path="login"
      element={
        <RequireAuth walletRequired={true}>
          <RedirectAfterLogin />
        </RequireAuth>
      }
    />
  </Route>,
];
