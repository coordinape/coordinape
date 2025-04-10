import { Fragment } from 'react';

import { RequireAuth } from 'features/rainbowkit/RequireAuth';
import { Navigate, Outlet, Route } from 'react-router-dom';

import { CoLinksProvider } from '../features/colinks/CoLinksContext';
import { CoLinksLayout } from '../features/colinks/CoLinksLayout';
import { CoLinksLoggedOutLayout } from '../features/colinks/CoLinksLoggedOutLayout';
import { CoLinksWizardLayout } from '../features/colinks/wizard/CoLinksWizardLayout';
import CoLinksSplashLayout from '../features/cosoul/CoLinksSplashLayout';
import AccountPage from '../pages/AccountPage/AccountPage';
import { AuthenticatePage } from '../pages/colinks/AuthenticatePage';
import { CastsPage } from '../pages/colinks/CastsPage';
import { BigQuestionPage } from '../pages/colinks/explore/BigQuestionPage';
import { BigQuestionsPage } from '../pages/colinks/explore/BigQuestionsPage';
import { HighestRepScorePage } from '../pages/colinks/explore/HighestRepScorePage';
import { HoldingMostLinksPage } from '../pages/colinks/explore/HoldingMostLinksPage';
import { MostLinksPage } from '../pages/colinks/explore/MostLinksPage';
import { NewestMemberPage } from '../pages/colinks/explore/NewestMembersPage';
import { ExplorePage } from '../pages/colinks/ExplorePage';
import { GivePage } from '../pages/colinks/give/GivePage';
import { GivePagesLayout } from '../pages/colinks/give/GivePagesLayout';
import { HighlightsPage } from '../pages/colinks/HighlightsPage';
import { LinkHistoryPage } from '../pages/colinks/LinkHistoryPage';
import { LinkHoldersPage } from '../pages/colinks/LinkHoldersPage';
import { LinkHoldingsPage } from '../pages/colinks/LinkHoldingsPage';
import { NotFound } from '../pages/colinks/NotFound';
import { NotificationsPage } from '../pages/colinks/NotificationsPage';
import { SearchCastsPage } from '../pages/colinks/SearchCastsPage';
import { SearchPage } from '../pages/colinks/SearchPage';
import { TradesPage } from '../pages/colinks/TradesPage';
import { VerifyEmailPage } from '../pages/colinks/VerifyEmailPage';
import { VerifyWaitListEmailPage } from '../pages/colinks/VerifyWaitListEmailPage';
import { WizardPage } from '../pages/colinks/wizard/WizardPage';
import { WizardStart } from '../pages/colinks/wizard/WizardStart';
import CoSoulExplorePage from '../pages/CoSoulExplorePage/CoSoulExplorePage';
import { GiveFeed } from '../pages/GiveFeed';
import { GiveHomePage } from '../pages/GiveHome';
import { GiveSkillMap } from '../pages/GiveSkillMap';
import { GiveSkillPage, GiveSkillRedirect } from '../pages/GiveSkillPage';
import { PostPage } from '../pages/PostPage';
import { ActivityPage } from 'pages/colinks/ActivityPage';
import {
  GivePartyProfileRedirect,
  ViewProfilePageGive,
} from 'pages/colinks/CoLinksProfilePage/ProfilePageGive';
import { ViewProfilePageNetwork } from 'pages/colinks/CoLinksProfilePage/ProfilePageNetwork';
import { ViewProfilePagePosts } from 'pages/colinks/CoLinksProfilePage/ProfilePagePosts';
import { ViewProfilePageReputation } from 'pages/colinks/CoLinksProfilePage/ProfilePageReputation';
import { SkillGiveMap } from 'pages/colinks/CoLinksProfilePage/SkillGiveMap';
import { ViewProfilePageGiveMap } from 'pages/colinks/CoLinksProfilePage/ViewProfilePageGiveMap';
import { CoSoulPage } from 'pages/colinks/cosoul/CoSoulPage';
import { MostGivenPage } from 'pages/colinks/explore/MostGivenPage';
import { MostGivePage } from 'pages/colinks/explore/MostGivePage';
import { GiveLeaderboardPage } from 'pages/colinks/give/GiveLeaderboardPage';
import { GiveReceiversPage } from 'pages/colinks/give/GiveReceiversPage';
import { GiveSendersPage } from 'pages/colinks/give/GiveSendersPage';
import { GiveSkillLeaderboardPage } from 'pages/giveSkillLeaderboardPage';
import UnsubscribeEmailPage from 'pages/UnsubscribeEmailPage/UnsubscribeEmailPage';

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
      path={coLinksPaths.authenticate(':token')}
      element={<AuthenticatePage />}
    />
  </Route>,
  // Redirects since we sunsetted giveParty
  <Route key={'giveparty'}>
    <Route
      path={coLinksPaths.deprecated_giveParty}
      element={<Navigate to={coLinksPaths.give} replace />}
    />
  </Route>,
  <Route
    key={'givepartyprofile'}
    path={coLinksPaths.deprecated_givePartyAddress(':address')}
    element={<GivePartyProfileRedirect />}
  />,
  <Route
    key={'giveboard'}
    path={coLinksPaths.deprecated_givePartyBoard}
    element={<Navigate to={coLinksPaths.give} replace />}
  />,
  <Route
    key={'giveskillboard'}
    path={coLinksPaths.deprecated_giveBoardSkill(':skill')}
    element={<GiveSkillRedirect />}
  />,
  <Route
    key="splashLayout"
    element={
      <CoLinksSplashLayout>
        <Outlet />
      </CoLinksSplashLayout>
    }
  >
    <Route path="login" element={<RedirectAfterLogin />} />
  </Route>,
  <Route key={'fullscreenCoLinks'}>
    <Route
      element={
        <CoLinksProvider>
          <CoLinksLayout suppressNav>
            <Outlet />
          </CoLinksLayout>
        </CoLinksProvider>
      }
    >
      <Route
        path={coLinksPaths.profileGiveMap(':address')}
        element={<ViewProfilePageGiveMap />}
      />
      <Route
        path={coLinksPaths.skillGiveMap(':skill')}
        element={<SkillGiveMap />}
      />
    </Route>
    ,
  </Route>,

  <Fragment key="public">
    <Route
      element={
        <CoLinksProvider>
          <CoLinksLayout>
            <Outlet />
          </CoLinksLayout>
        </CoLinksProvider>
      }
    >
      <Route path={coLinksPaths.linking} element={<TradesPage />} />
      <Route path={coLinksPaths.explore} element={<ExplorePage />} />
      <Route path={coLinksPaths.givefeed} element={<GiveFeed />} />
      <Route path={coLinksPaths.give} element={<GivePage />} />
      <Route path={coLinksPaths.root} element={<GiveHomePage />} />
      <Route
        path={coLinksPaths.deprecated_home}
        element={<Navigate to={coLinksPaths.root} replace />}
      />
      <Route
        path={coLinksPaths.giveReceivers}
        element={<GiveReceiversPage />}
      />
      <Route path={coLinksPaths.topGive} element={<GiveLeaderboardPage />} />
      <Route path={coLinksPaths.giveSenders} element={<GiveSendersPage />} />
      <Route
        key="givePagesLayout"
        element={
          <GivePagesLayout>
            <Outlet />
          </GivePagesLayout>
        }
      >
        <Route
          path={coLinksPaths.giveSkill(':skill')}
          element={<GiveSkillPage />}
        />
        <Route
          path={coLinksPaths.giveSkillLeaderboard(':skill')}
          element={<GiveSkillLeaderboardPage />}
        />
        <Route key={'skillmap'}>
          <Route
            path={coLinksPaths.giveSkillMap(':skill')}
            element={<GiveSkillMap />}
          />
        </Route>
      </Route>
      <Route path={coLinksPaths.leaderboard} element={<ExplorePage />} />
      <Route path={coLinksPaths.exploreMostLinks} element={<MostLinksPage />} />
      <Route path={coLinksPaths.exploreMostGive} element={<MostGivePage />} />
      <Route path={coLinksPaths.exploreMostGiven} element={<MostGivenPage />} />
      <Route
        path={coLinksPaths.exploreRepScore}
        element={<HighestRepScorePage />}
      />
      <Route path={coLinksPaths.exploreNewest} element={<NewestMemberPage />} />
      <Route
        path={coLinksPaths.exploreHoldingMost}
        element={<HoldingMostLinksPage />}
      />
      <Route
        path={coLinksPaths.profilePosts(':address')}
        element={<ViewProfilePagePosts />}
      />
      <Route
        path={coLinksPaths.profileGive(':address')}
        element={<ViewProfilePageGive />}
      />
      <Route
        path={coLinksPaths.profileNetwork(':address')}
        element={<ViewProfilePageNetwork />}
      />
      <Route
        path={coLinksPaths.profileReputation(':address')}
        element={<ViewProfilePageReputation />}
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
    </Route>
  </Fragment>,

  <Fragment key="loggedin">
    <Route
      element={
        <RequireAuth walletRequired={true}>
          <CoLinksProvider>
            <CoLinksLayout>
              <Outlet />
            </CoLinksLayout>
          </CoLinksProvider>
        </RequireAuth>
      }
    >
      <Route path={coLinksPaths.exploreOld} element={<CoSoulExplorePage />} />
      <Route path={coLinksPaths.account} element={<AccountPage />} />
      <Route path={coLinksPaths.account} element={<AccountPage />} />
      <Route
        path={coLinksPaths.notifications}
        element={<NotificationsPage />}
      />
      <Route path={coLinksPaths.highlights} element={<HighlightsPage />} />
      <Route path={coLinksPaths.casts} element={<CastsPage />} />
      <Route path={coLinksPaths.searchCasts} element={<SearchCastsPage />} />
      <Route path={coLinksPaths.coLinksFeed} element={<ActivityPage />} />
      <Route
        path={coLinksPaths.searchResult(':query', ':model')}
        element={<SearchPage />}
      />
      <Route path={coLinksPaths.search} element={<SearchPage />} />
      <Route path={coLinksPaths.post(':id')} element={<PostPage />} />
      <Route path={coLinksPaths.bigQuestions} element={<BigQuestionsPage />} />
      <Route
        path={coLinksPaths.bigQuestion(':id')}
        element={<BigQuestionPage />}
      />

      <Route path={'*'} element={<NotFound />} />
    </Route>

    <Route
      element={
        <CoLinksWizardLayout>
          <Outlet />
        </CoLinksWizardLayout>
      }
    >
      <Route path={coLinksPaths.wizardStart} element={<WizardStart />} />
      <Route
        path={coLinksPaths.verifyWaitList(':uuid')}
        element={<VerifyWaitListEmailPage />}
      />
      <Route
        path={coLinksPaths.verify(':uuid')}
        element={<VerifyEmailPage />}
      />
      <Route
        path={coLinksPaths.unsubscribe(':unsubscribeToken')}
        element={<UnsubscribeEmailPage />}
      />
    </Route>

    <Route
      element={
        <RequireAuth walletRequired={true}>
          <CoLinksWizardLayout>
            <Outlet />
          </CoLinksWizardLayout>
        </RequireAuth>
      }
    >
      <Route path={coLinksPaths.wizard} element={<WizardPage />} />
    </Route>
    <Route
      element={
        <RequireAuth walletRequired={true}>
          <CoLinksWizardLayout>
            <Outlet />
          </CoLinksWizardLayout>
        </RequireAuth>
      }
    >
      <Route path={coLinksPaths.cosoul} element={<CoSoulPage />} />
    </Route>
  </Fragment>,
];
