import React, { lazy } from 'react';

import { Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { USER_ROLE_ADMIN } from 'config/constants';
import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CirclesPage from 'pages/CirclesPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import HistoryPage from 'pages/HistoryPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import VouchingPage from 'pages/VouchingPage';
import { rSelectedMyUser, rSelectedCircle, rHasAdminView } from 'recoilState';

import * as paths from './paths';

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyAssetMapPage = lazy(() => import('pages/AssetMapPage'));

export const Routes = () => {
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const hasAdminView = useRecoilValue(rHasAdminView);

  // TODO: simpler way to do this? Maybe redirect?
  const asVoyeur = !selectedMyUser && hasAdminView;
  if (!selectedCircle || (!selectedMyUser && !hasAdminView)) {
    return (
      <Switch>
        <Route
          exact
          path={paths.getCreateCirclePath()}
          component={CreateCirclePage}
        />
        <Route component={DefaultPage} />
      </Switch>
    );
  }
  const SneakyAllocationPage = !asVoyeur ? AllocationPage : DefaultPage;
  const SneakyAdminPage =
    (selectedMyUser && selectedMyUser.role === USER_ROLE_ADMIN) || hasAdminView
      ? AdminPage
      : DefaultPage;
  const SneakyAdminVaultsPage =
    (selectedMyUser && selectedMyUser.role !== 0) || hasAdminView
      ? VaultsPage
      : DefaultPage;
  const SneakyAdminCirclesPage =
    (selectedMyUser && selectedMyUser.role !== 0) || hasAdminView
      ? CirclesPage
      : DefaultPage;

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={DefaultPage} />
      <Route
        exact
        // TODO: This use of the path pattern is odd
        path={paths.getProfilePath({ address: ':profileAddress' })}
        component={ProfilePage}
      />
      <Route exact path={paths.getMapPath()} component={LazyAssetMapPage} />
      <Route exact path={paths.getVouchingPath()} component={VouchingPage} />
      <Route exact path={paths.getHistoryPath()} component={HistoryPage} />
      <Route exact path={paths.getAdminPath()} component={SneakyAdminPage} />
      <Route exact path={paths.getVaultsPath()} component={SneakyAdminVaultsPage} />
      <Route exact path={paths.getCirclesPath()} component={SneakyAdminCirclesPage} />

      <Route
        exact
        path={paths.getCreateCirclePath()}
        component={CreateCirclePage}
      />

      <Route
        exact
        path={paths.getAllocationPath()}
        component={SneakyAllocationPage}
      />
      <Route
        exact
        path={paths.getMyTeamPath()}
        component={SneakyAllocationPage}
      />
      <Route
        exact
        path={paths.getMyEpochPath()}
        component={SneakyAllocationPage}
      />
      <Route
        exact
        path={paths.getGivePath()}
        component={SneakyAllocationPage}
      />

      <Route component={DefaultPage} />
    </Switch>
  );
};

export default Routes;
