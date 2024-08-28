import { Fragment } from 'react';

import { Rainbowify } from 'features/rainbowkit/Rainbowify';
import { RequireAuth } from 'features/rainbowkit/RequireAuth';
import { Outlet, Route } from 'react-router-dom';

import {
  MintPage,
  SplashPage,
  ViewPage as CoSoulViewPage,
} from '../features/cosoul';
import { CoSoulArtPublic } from '../features/cosoul/art/CoSoulArtPublic';
import CoSoulArtOnlyLayout from '../features/cosoul/CoSoulArtOnlyLayout';
import CoSoulLayout from '../features/cosoul/CoSoulLayout';
import { DebugCoSoulGalleryPage } from '../features/cosoul/DebugCoSoulGalleryPage';
import CoSoulExplorePage from '../pages/CoSoulExplorePage/CoSoulExplorePage';

import { coSoulPaths } from './paths';
import { RedirectAfterLogin } from './RedirectAfterLogin';

export const coSoulRoutes = [
  <Fragment key={'coSoulRoutes'}>
    <Route
      element={
        <CoSoulArtOnlyLayout>
          <Outlet />
        </CoSoulArtOnlyLayout>
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
      <Route
        path={coSoulPaths.cosoulArt(':tokenId')}
        element={<CoSoulArtPublic />}
      />
      <Route
        path={coSoulPaths.cosoulImage(':tokenId')}
        element={<CoSoulArtPublic animate={false} />}
      />
      <Route
        path={coSoulPaths.cosoulGallery}
        element={<DebugCoSoulGalleryPage />}
      />
    </Route>
    <Route
      element={
        <CoSoulLayout>
          <Outlet />
        </CoSoulLayout>
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
      <Route path={coSoulPaths.cosoul} element={<SplashPage />} />
      <Route
        path={coSoulPaths.cosoulView(':address')}
        element={<CoSoulViewPage />}
      />
      <Route path={coSoulPaths.cosoulExplore} element={<CoSoulExplorePage />} />
      <Route
        path={coSoulPaths.mint}
        element={
          <Rainbowify>
            <RequireAuth walletRequired={true}>
              <MintPage />
            </RequireAuth>
          </Rainbowify>
        }
      />
    </Route>
  </Fragment>,
];
