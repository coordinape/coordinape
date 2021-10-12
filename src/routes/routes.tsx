import React, { lazy } from 'react';

import { Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import AdminPage from 'pages/AdminPage';
import AdminPage1 from 'pages/AdminPage1';
import AllocationPage from 'pages/AllocationPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import HistoryPage from 'pages/HistoryPage';
import ProfilePage from 'pages/ProfilePage';
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
    (selectedMyUser && selectedMyUser.role !== 0) || hasAdminView
      ? AdminPage
      : DefaultPage;
  const SneakyAdminPage1 =
    (selectedMyUser && selectedMyUser.role !== 0) || hasAdminView
      ? AdminPage1
      : DefaultPage;

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={DefaultPage} />
      <Route
        exact
        path={paths.getProfilePath(':profileAddress')}
        component={ProfilePage}
      />
      <Route exact path={paths.getMapPath()} component={LazyAssetMapPage} />
      <Route exact path={paths.getVouchingPath()} component={VouchingPage} />
      <Route exact path={paths.getHistoryPath()} component={HistoryPage} />
      <Route exact path={paths.getAdminPath()} component={SneakyAdminPage} />
      <Route exact path={paths.getAdminPath1()} component={SneakyAdminPage1} />

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
