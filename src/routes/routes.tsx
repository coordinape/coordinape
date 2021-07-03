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

  // TODO: simpler way to do this?
  const asVoyuer = !selectedMyUser && hasAdminView;
  if (!selectedCircle || (!selectedMyUser && !hasAdminView)) {
    return <PreconnectPage />;
  }

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={PreconnectPage} />
      {!asVoyuer ? (
        <>
          <Route
            exact
            path={paths.getAllocationPath()}
            component={AllocationPage}
          />
          <Route
            exact
            path={paths.getMyTeamPath()}
            component={AllocationPage}
          />
          <Route
            exact
            path={paths.getMyEpochPath()}
            component={AllocationPage}
          />
          <Route exact path={paths.getGivePath()} component={AllocationPage} />
        </>
      ) : null}

      <Route
        exact
        path={paths.getProfilePath(':profileAddress')}
        component={ProfilePage}
      />
      <Route exact path={paths.getMapPath()} component={LazyGraphPage} />
      <Route exact path={paths.getHistoryPath()} component={HistoryPage} />
      {selectedMyUser && selectedMyUser.role !== 0 ? (
        <Route exact path={paths.getAdminPath()} component={AdminPage} />
      ) : undefined}
      <Route component={PreconnectPage} />
    </Switch>
  );
};

export default Routes;
