import React, { lazy } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import DistributePage from 'pages/DistributePage';
import HistoryPage from 'pages/HistoryPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import VouchingPage from 'pages/VouchingPage';
import {
  useMyProfile,
  useSelectedCircleLoadable,
  useHasSelectedCircle,
} from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';

import * as paths from './paths';

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyAssetMapPage = lazy(() => import('pages/AssetMapPage'));

export const Routes = () => {
  const hasCircles = useHasCircles();
  const hasSelectedCircle = useHasSelectedCircle();

  return hasCircles && hasSelectedCircle ? (
    <LoggedInRoutes />
  ) : (
    <Switch>
      <Route
        exact
        path={paths.getCreateCirclePath()}
        component={CreateCirclePage}
      />
      <Route
        exact
        path={paths.getProfilePath({ address: ':profileAddress' })}
        component={ProfilePage}
      />
      <Route path={paths.getHomePath()} component={DefaultPage} />
    </Switch>
  );
};

const LoggedInRoutes = () => {
  const selectedUser = useSelectedCircleLoadable().valueMaybe()?.myUser;
  const hasAdminView =
    useMyProfile().hasAdminView || !!selectedUser?.isCircleAdmin;

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={DefaultPage} />
      <Route
        exact
        path={paths.getCreateCirclePath()}
        component={CreateCirclePage}
      />

      <Route
        exact
        path={paths.getProfilePath({ address: ':profileAddress' })}
        component={ProfilePage}
      />
      <Route exact path={paths.getMapPath()} component={LazyAssetMapPage} />
      <Route exact path={paths.getVouchingPath()} component={VouchingPage} />
      <Route exact path={paths.getHistoryPath()} component={HistoryPage} />

      <Route
        exact
        key={paths.getAllocationPath()}
        path={paths.getAllocationPath()}
        component={AllocationPage}
      />
      <Route
        exact
        key={paths.getMyTeamPath()}
        path={paths.getMyTeamPath()}
        component={AllocationPage}
      />
      <Route
        exact
        key={paths.getMyEpochPath()}
        path={paths.getMyEpochPath()}
        component={AllocationPage}
      />
      <Route
        exact
        key={paths.getGivePath()}
        path={paths.getGivePath()}
        component={AllocationPage}
      />

      {selectedUser && !hasAdminView && (
        <Route path={paths.getAdminPath()}>
          <Redirect to={paths.getHomePath()} />
        </Route>
      )}

      <Route
        exact
        key={paths.getAdminPath()}
        path={paths.getAdminPath()}
        render={() => <AdminPage legacy={true} />}
      />
      <Route
        exact
        key={paths.getVaultsPath()}
        path={paths.getVaultsPath()}
        component={VaultsPage}
      />
      <Route
        exact
        key={paths.getCirclesPath()}
        path={paths.getCirclesPath()}
        component={AdminPage}
      />
      <Route
        exact
        key={paths.getDistributePath({
          circleId: ':circleId',
          epochId: ':epochId',
        })}
        path={paths.getDistributePath({
          circleId: ':circleId',
          epochId: ':epochId',
        })}
        component={DistributePage}
      />
      <Redirect to={paths.getHomePath()} />
    </Switch>
  );
};

export default Routes;
