import { Fragment } from 'react';

import { Outlet, Route } from 'react-router-dom';

import { RequireAuth } from '../features/auth';
import { CoLinksProvider } from '../features/colinks/CoLinksContext';
import { CoLinksLayout } from '../features/colinks/CoLinksLayout';
import { CoLinksLoggedOutLayout } from '../features/colinks/CoLinksLoggedOutLayout';
import { CoLinksSplashPage } from '../features/colinks/CoLinksSplashPage';
import { CoLinksWizardLayout } from '../features/colinks/wizard/CoLinksWizardLayout';
import CoLinksSplashLayout from '../features/cosoul/CoLinksSplashLayout';
import AccountPage from '../pages/AccountPage/AccountPage';
import { ActivityPage } from '../pages/colinks/ActivityPage';
import { ExploreSkills } from '../pages/colinks/explore/ExploreSkills';
import { HighestRepScorePage } from '../pages/colinks/explore/HighestRepScorePage';
import { HoldingMostLinksPage } from '../pages/colinks/explore/HoldingMostLinksPage';
import { MostLinksPage } from '../pages/colinks/explore/MostLinksPage';
import { ExplorePage } from '../pages/colinks/ExplorePage';
import { HighlightsPage } from '../pages/colinks/HighlightsPage';
import { InvitesPage } from '../pages/colinks/InvitesPage';
import { LaunchPage } from '../pages/colinks/LaunchPage';
import { LinkHistoryPage } from '../pages/colinks/LinkHistoryPage';
import { LinkHoldersPage } from '../pages/colinks/LinkHoldersPage';
import { LinkHoldingsPage } from '../pages/colinks/LinkHoldingsPage';
import { NFTPage } from '../pages/colinks/NFTPage';
import { NotificationsPage } from '../pages/colinks/NotificationsPage';
import { RepScorePage } from '../pages/colinks/RepScorePage';
import { SearchPage } from '../pages/colinks/SearchPage';
import { TradesPage } from '../pages/colinks/TradesPage';
import { VerifyEmailPage } from '../pages/colinks/VerifyEmailPage';
import { VerifyWaitListEmailPage } from '../pages/colinks/VerifyWaitListEmailPage';
import { ViewProfilePage } from '../pages/colinks/ViewProfilePage/ViewProfilePage';
import { WizardPage } from '../pages/colinks/wizard/WizardPage';
import { WizardStart } from '../pages/colinks/wizard/WizardStart';
import CoSoulExplorePage from '../pages/CoSoulExplorePage/CoSoulExplorePage';
import { InviteCodePage } from '../pages/InviteCodePage';
import { PostPage } from '../pages/PostPage';

import { coLinksPaths } from './paths';
import { RedirectAfterLogin } from './RedirectAfterLogin';

export const coLinksRoutes = [
  <Route
    key={'not_logged_in'}
    element={
      <CoLinksLoggedOutLayout>
        <Outlet />
      </CoLinksLoggedOutLayout>
    }
  >
    <Route
      path={coLinksPaths.inviteCode(':code')}
      element={<InviteCodePage />}
    />
  </Route>,
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
    <Route path={coLinksPaths.info} element={<CoLinksSplashPage />} />
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
      <Route path={coLinksPaths.linking} element={<TradesPage />} />
      <Route path={coLinksPaths.exploreOld} element={<CoSoulExplorePage />} />
      <Route path={coLinksPaths.account} element={<AccountPage />} />
      <Route path={coLinksPaths.home} element={<ActivityPage />} />
      <Route
        path={coLinksPaths.notifications}
        element={<NotificationsPage />}
      />
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
      <Route path={coLinksPaths.invites} element={<InvitesPage />} />
      <Route path={coLinksPaths.highlights} element={<HighlightsPage />} />
      <Route path={coLinksPaths.leaderboard} element={<ExplorePage />} />
      <Route path={coLinksPaths.nfts} element={<NFTPage />} />
      <Route
        path={coLinksPaths.exploreSkill(':skill')}
        element={<ExploreSkills />}
      />
      <Route path={coLinksPaths.exploreSkills} element={<ExploreSkills />} />
      <Route path={coLinksPaths.explore} element={<ExplorePage />} />
      <Route path={coLinksPaths.search} element={<SearchPage />} />
      <Route
        path={coLinksPaths.searchResult(':query')}
        element={<SearchPage />}
      />
      <Route path={coLinksPaths.exploreMostLinks} element={<MostLinksPage />} />
      <Route
        path={coLinksPaths.exploreRepScore}
        element={<HighestRepScorePage />}
      />

      <Route
        path={coLinksPaths.exploreHoldingMost}
        element={<HoldingMostLinksPage />}
      />
      <Route path={coLinksPaths.post(':id')} element={<PostPage />} />
    </Route>

    <Route
      element={
        <CoLinksWizardLayout>
          <Outlet />
        </CoLinksWizardLayout>
      }
    >
      <Route path={coLinksPaths.root} element={<LaunchPage />} />
      <Route path={coLinksPaths.wizardStart} element={<WizardStart />} />
      <Route
        path={coLinksPaths.verifyWaitList(':uuid')}
        element={<VerifyWaitListEmailPage />}
      />
      <Route
        path={coLinksPaths.verify(':uuid')}
        element={<VerifyEmailPage />}
      />
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
