import React, { lazy } from 'react';

import { Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import HistoryPage from 'pages/HistoryPage';
import PreconnectPage from 'pages/PreconnectPage';
import { rSelectedMyUser, rSelectedCircle } from 'recoilState';

import * as paths from './paths';

// TODO: User sign in flow
// 1. Go to any specific path they have. Select circle if specified in URL.
//    Redirect if invalid (admin or no permission to see circle)
//
// 2. Use local storage to select a circle OR open circle select modal THEN
//    DRAFT
//    If during epoch
//       First time -> Epoch
//       If they set their epoch settings -> Team
//       If they already GAVE back to GIVE
//    ELSE between epochs:
//       HISTORY

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyGraphPage = lazy(() => import('pages/GraphPage'));

export const Routes = () => {
  const selectedMyUser = useRecoilValue(rSelectedMyUser);
  const selectedCircle = useRecoilValue(rSelectedCircle);

  if (!selectedMyUser && !selectedCircle) {
    return <PreconnectPage />;
  }

  return (
    <Switch>
      <Route exact path={paths.getHomePath()} component={PreconnectPage} />
      <Route
        exact
        path={paths.getAllocationPath()}
        component={AllocationPage}
      />
      <Route exact path={paths.getMyTeamPath()} component={AllocationPage} />
      <Route exact path={paths.getMyEpochPath()} component={AllocationPage} />
      <Route exact path={paths.getGivePath()} component={AllocationPage} />
      <Route
        exact
        path={paths.getProfilePath(':profileAddress')}
        component={PreconnectPage}
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
