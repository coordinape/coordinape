import React, { lazy } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import HistoryPage from 'pages/HistoryPage';
import OverviewPage from 'pages/OverviewPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import VouchingPage from 'pages/VouchingPage';
import {
  useMyProfileLoadable,
  useSelectedCircleLoadable,
} from 'recoilState/app';

import * as paths from './paths';

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyAssetMapPage = lazy(() => import('pages/AssetMapPage'));

export const Routes = () => {
  const myProfileLoadable = useMyProfileLoadable();
  const selectedLoadable = useSelectedCircleLoadable();

  if (
    myProfileLoadable.state !== 'hasValue' ||
    selectedLoadable.state !== 'hasValue'
  ) {
    return (
      <Switch>
        <Route exact path={paths.getHomePath()} component={DefaultPage} />
        <Route
          exact
          path={paths.getCreateCirclePath()}
          component={CreateCirclePage}
        />
      </Switch>
    );
  }
  const selectedUser = selectedLoadable.contents.myUser;
  const canViewAdmin =
    selectedUser.isCircleAdmin || myProfileLoadable.contents.hasAdminView;

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={DefaultPage} />
      <Route
        exact
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
          render={() => <AdminPage legacy={true} />}
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
          component={AdminPage}
        />,
      ]}

      <Route
        exact
        path={paths.getCreateCirclePath()}
        component={CreateCirclePage}
      />

      {selectedUser && [
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
