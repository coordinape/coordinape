import { Fragment } from 'react';

import { Outlet, Route } from 'react-router-dom';

import { RequireAuth } from '../features/auth';
import { CoLinksProvider } from '../features/colinks/CoLinksContext';
import { CoLinksLayout } from '../features/colinks/CoLinksLayout';
import { CoLinksSplashPage } from '../features/colinks/CoLinksSplashPage';
import { CoLinksWizardLayout } from '../features/colinks/wizard/CoLinksWizardLayout';
import CoLinksSplashLayout from '../features/cosoul/CoLinksSplashLayout';
import AccountPage from '../pages/AccountPage/AccountPage';
import { ActivityPage } from '../pages/colinks/ActivityPage';
import { LaunchPage } from '../pages/colinks/LaunchPage';
import { LeaderboardPage } from '../pages/colinks/LeaderboardPage';
import { LinkHistoryPage } from '../pages/colinks/LinkHistoryPage';
import { LinkHoldersPage } from '../pages/colinks/LinkHoldersPage';
import { LinkHoldingsPage } from '../pages/colinks/LinkHoldingsPage';
import { NFTPage } from '../pages/colinks/NFTPage';
import { RepScorePage } from '../pages/colinks/RepScorePage';
import { TradesPage } from '../pages/colinks/TradesPage';
import { ViewProfilePage } from '../pages/colinks/ViewProfilePage/ViewProfilePage';
import { WizardPage } from '../pages/colinks/wizard/WizardPage';
import { WizardStart } from '../pages/colinks/wizard/WizardStart';
import CoSoulExplorePage from '../pages/CoSoulExplorePage/CoSoulExplorePage';
import { InviteCodePage } from '../pages/InviteCodePage';

import { coLinksPaths } from './paths';
import { RedirectAfterLogin } from './RedirectAfterLogin';

export const coLinksRoutes = [
  <Route
    key="invite/:code"
    path={coLinksPaths.inviteCode(':code')}
    element={<InviteCodePage />}
  />,
  <Route
    key="splashLayout"
    element={
      <CoLinksSplashLayout>
        <Outlet />
      </CoLinksSplashLayout>
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
    <Route path={coLinksPaths.root} element={<CoLinksSplashPage />} />
  </Route>,
  <Fragment key="loggedin">
    <Route path={coLinksPaths.launch} element={<LaunchPage />} />

    <Route
      element={
        <RequireAuth>
          <CoLinksProvider>
            <CoLinksLayout>
              <Outlet />
            </CoLinksLayout>
          </CoLinksProvider>
        </RequireAuth>
      }
    >
      <Route
        path={coLinksPaths.profile(':address')}
        element={<ViewProfilePage />}
      />
      <Route path={coLinksPaths.trades} element={<TradesPage />} />
      <Route path={coLinksPaths.explore} element={<CoSoulExplorePage />} />
      <Route path={coLinksPaths.account} element={<AccountPage />} />
      <Route path={coLinksPaths.home} element={<ActivityPage />} />
      <Route
        path={coLinksPaths.history(':address')}
        element={<LinkHistoryPage />}
      />
      <Route
        path={coLinksPaths.holdings(':address')}
        element={<LinkHoldingsPage />}
      />
      <Route
        path={coLinksPaths.holders(':address')}
        element={<LinkHoldersPage />}
      />
      <Route path={coLinksPaths.score(':address')} element={<RepScorePage />} />
      <Route path={coLinksPaths.leaderboard} element={<LeaderboardPage />} />
      <Route path={coLinksPaths.nfts} element={<NFTPage />} />
    </Route>

    <Route
      element={
        <CoLinksWizardLayout>
          <Outlet />
        </CoLinksWizardLayout>
      }
    >
      <Route path={coLinksPaths.wizardStart} element={<WizardStart />} />
    </Route>

    <Route
      element={
        <RequireAuth>
          <CoLinksWizardLayout>
            <Outlet />
          </CoLinksWizardLayout>
        </RequireAuth>
      }
    >
      <Route path={coLinksPaths.wizard} element={<WizardPage />} />
    </Route>
  </Fragment>,
];
