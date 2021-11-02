import React, { lazy } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { USER_ROLE_ADMIN } from 'config/constants';
import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CirclesPage from 'pages/CirclesPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import HistoryPage from 'pages/HistoryPage';
import OverviewPage from 'pages/OverviewPage';
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

  if (!selectedCircle || (!selectedMyUser && !hasAdminView)) {
    return (
      <Switch>
        <Route exact path={paths.getHomePath()} component={DefaultPage} />
        <Route
          exact
          path={paths.getCreateCirclePath()}
          component={CreateCirclePage}
        />
        <Redirect to={paths.getHomePath()} />
      </Switch>
    );
  }

  const canViewAdmin = selectedMyUser?.role === USER_ROLE_ADMIN || hasAdminView;

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

      {canViewAdmin && [
        <Route
          exact
          key={paths.getAdminPath()}
          path={paths.getAdminPath()}
          component={AdminPage}
        />,
        <Route
          exact
          key={paths.getOverviewPath()}
          path={paths.getOverviewPath()}
          component={OverviewPage}
        />,
        <Route
          exact
          key={paths.getVaultsPath()}
          path={paths.getVaultsPath()}
          component={VaultsPage}
        />,
        <Route
          exact
          key={paths.getCirclesPath()}
          path={paths.getCirclesPath()}
          component={CirclesPage}
        />,
      ]}

      <Route
        exact
        path={paths.getCreateCirclePath()}
        component={CreateCirclePage}
      />

      {selectedMyUser && [
        <Route
          exact
          key={paths.getAllocationPath()}
          path={paths.getAllocationPath()}
          component={AllocationPage}
        />,
        <Route
          exact
          key={paths.getMyTeamPath()}
          path={paths.getMyTeamPath()}
          component={AllocationPage}
        />,
        <Route
          exact
          key={paths.getMyEpochPath()}
          path={paths.getMyEpochPath()}
          component={AllocationPage}
        />,
        <Route
          exact
          key={paths.getGivePath()}
          path={paths.getGivePath()}
          component={AllocationPage}
        />,
      ]}

      <Redirect to={paths.getHomePath()} />
    </Switch>
  );
};

export default Routes;
