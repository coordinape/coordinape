import React, { lazy } from 'react';

import { Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import HistoryPage from 'pages/HistoryPage';
import PreconnectPage from 'pages/PreconnectPage';
import ProfilePage from 'pages/ProfilePage';
import { rSelectedMyUser, rSelectedCircle, rHasAdminView } from 'recoilState';

import * as paths from './paths';

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyGraphPage = lazy(() => import('pages/GraphPage'));

export const Routes = () => {
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const hasAdminView = useRecoilValue(rHasAdminView);

  // TODO: simpler way to do this? Maybe redirect?
  const asVoyeur = !selectedMyUser && hasAdminView;
  if (!selectedCircle || (!selectedMyUser && !hasAdminView)) {
    return <PreconnectPage />;
  }
  const SneakyAllocationPage = !asVoyeur ? AllocationPage : PreconnectPage;
  const SneakyAdminPage =
    (selectedMyUser && selectedMyUser.role !== 0) || hasAdminView
      ? AdminPage
      : PreconnectPage;

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={PreconnectPage} />
      <Route
        exact
        path={paths.getProfilePath(':profileAddress')}
        component={ProfilePage}
      />
      <Route exact path={paths.getMapPath()} component={LazyGraphPage} />
      <Route exact path={paths.getHistoryPath()} component={HistoryPage} />
      <Route exact path={paths.getAdminPath()} component={SneakyAdminPage} />

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

      <Route component={PreconnectPage} />
    </Switch>
  );
};

export default Routes;
