import { Fragment } from 'react';

import { Outlet, Route } from 'react-router-dom';

import { RequireWeb3Auth } from '../features/auth';
import { RequireLoggedIn } from '../features/auth/RequireWeb3Auth';
import { CoLinksProvider } from '../features/colinks/CoLinksContext';
import { CoLinksLayout } from '../features/colinks/CoLinksLayout';
import { CoLinksLoggedOutLayout } from '../features/colinks/CoLinksLoggedOutLayout';
import { CoLinksSplashPage } from '../features/colinks/CoLinksSplashPage';
import { CoLinksWizardLayout } from '../features/colinks/wizard/CoLinksWizardLayout';
import CoLinksSplashLayout from '../features/cosoul/CoLinksSplashLayout';
import AccountPage from '../pages/AccountPage/AccountPage';
import { ActivityPage } from '../pages/colinks/ActivityPage';
import { AuthenticatePage } from '../pages/colinks/AuthenticatePage';
import { BigQuestionPage } from '../pages/colinks/explore/BigQuestionPage';
import { BigQuestionsPage } from '../pages/colinks/explore/BigQuestionsPage';
import { ExploreSkills } from '../pages/colinks/explore/ExploreSkills';
import { HighestRepScorePage } from '../pages/colinks/explore/HighestRepScorePage';
import { HoldingMostLinksPage } from '../pages/colinks/explore/HoldingMostLinksPage';
import { MostLinksPage } from '../pages/colinks/explore/MostLinksPage';
import { NewestMemberPage } from '../pages/colinks/explore/NewestMembersPage';
import { ExplorePage } from '../pages/colinks/ExplorePage';
import { HighlightsPage } from '../pages/colinks/HighlightsPage';
import { InvitesPage } from '../pages/colinks/InvitesPage';
import { LaunchPage } from '../pages/colinks/LaunchPage';
import { LinkHistoryPage } from '../pages/colinks/LinkHistoryPage';
import { LinkHoldersPage } from '../pages/colinks/LinkHoldersPage';
import { LinkHoldingsPage } from '../pages/colinks/LinkHoldingsPage';
import { NFTPage } from '../pages/colinks/NFTPage';
import { NotFound } from '../pages/colinks/NotFound';
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
import { GiveLeaderboard } from '../pages/GiveLeaderboard';
import { GiveSkillLeaderboard } from '../pages/GiveSkillLeaderboard';
import { InviteCodePage } from '../pages/InviteCodePage';
import { PostPage } from '../pages/PostPage';
import { MostGivenPage } from 'pages/colinks/explore/MostGivenPage';
import { MostGivePage } from 'pages/colinks/explore/MostGivePage';
import { GiveMap } from 'pages/GiveMap';
import { GiveParty } from 'pages/GiveParty';
import { PartyProfile } from 'pages/GiveParty/PartyProfile';
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
      path={coLinksPaths.inviteCode(':code')}
      element={<InviteCodePage />}
    />
    <Route
      path={coLinksPaths.authenticate(':token')}
      element={<AuthenticatePage />}
    />
  </Route>,
  <Route key={'giveparty'}>
    <Route path={coLinksPaths.giveParty} element={<GiveParty />} />
  </Route>,
  <Route key={'givemap'}>
    <Route path={coLinksPaths.givemap} element={<GiveMap />} />
  </Route>,
  <Route key={'giveparty'}>
    <Route
      path={coLinksPaths.partyProfile(':address')}
      element={<PartyProfile />}
    />
  </Route>,
  <Route key={'giveboard'}>
    <Route path={coLinksPaths.giveBoard} element={<GiveLeaderboard />} />
  </Route>,
  <Route key={'giveboard'}>
    <Route
      path={coLinksPaths.giveBoardSkill(':skill')}
      element={<GiveSkillLeaderboard />}
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
        <RequireWeb3Auth>
          <RedirectAfterLogin />
        </RequireWeb3Auth>
      }
    />
    <Route path={coLinksPaths.info} element={<CoLinksSplashPage />} />
  </Route>,
  <Fragment key="loggedin">
    <Route path={coLinksPaths.launch} element={<LaunchPage />} />

    <Route
      element={
        <RequireLoggedIn>
          <CoLinksProvider>
            <CoLinksLayout>
              <Outlet />
            </CoLinksLayout>
          </CoLinksProvider>
        </RequireLoggedIn>
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
      <Route
        path={coLinksPaths.searchResult(':query', ':model')}
        element={<SearchPage />}
      />
      <Route path={coLinksPaths.search} element={<SearchPage />} />
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
      <Route
        path={coLinksPaths.unsubscribe(':unsubscribeToken')}
        element={<UnsubscribeEmailPage />}
      />
    </Route>

    <Route
      element={
        <RequireWeb3Auth>
          <CoLinksWizardLayout>
            <Outlet />
          </CoLinksWizardLayout>
        </RequireWeb3Auth>
      }
    >
      <Route path={coLinksPaths.wizard} element={<WizardPage />} />
    </Route>
  </Fragment>,
];
