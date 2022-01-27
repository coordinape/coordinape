import React, { lazy } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
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

export const AppRoutes = () => {
  const hasCircles = useHasCircles();
  const hasSelectedCircle = useHasSelectedCircle();

  return hasCircles && hasSelectedCircle ? (
    <LoggedInRoutes />
  ) : (
    <Routes>
      <Route
        path={paths.getCreateCirclePath()}
        element={<CreateCirclePage />}
      />
      <Route
        path={paths.getProfilePath({ address: ':profileAddress' })}
        element={<ProfilePage />}
      />
      <Route path={paths.getHomePath()} element={<DefaultPage />} />
    </Routes>
  );
};

const LoggedInRoutes = () => {
  const selectedUser = useSelectedCircleLoadable().valueMaybe()?.myUser;
  const hasAdminView =
    useMyProfile().hasAdminView || !!selectedUser?.isCircleAdmin;

  return (
    <Routes>
      <Route path={paths.getHomePath()} element={<DefaultPage />} />
      <Route path={paths.getCreateCirclePath()} element={CreateCirclePage} />

      <Route
        path={paths.getProfilePath({ address: ':profileAddress' })}
        element={<ProfilePage />}
      />
      <Route path={paths.getMapPath()} element={<LazyAssetMapPage />} />
      <Route path={paths.getVouchingPath()} element={<VouchingPage />} />
      <Route path={paths.getHistoryPath()} element={<HistoryPage />} />

      <Route
        key={paths.getAllocationPath()}
        path={paths.getAllocationPath()}
        element={<AllocationPage />}
      />
      <Route
        key={paths.getMyTeamPath()}
        path={paths.getMyTeamPath()}
        element={<AllocationPage />}
      />
      <Route
        key={paths.getMyEpochPath()}
        path={paths.getMyEpochPath()}
        element={<AllocationPage />}
      />
      <Route
        key={paths.getGivePath()}
        path={paths.getGivePath()}
        element={<AllocationPage />}
      />

      {selectedUser && !hasAdminView && (
        <Route
          path={paths.getAdminPath()}
          element={<Navigate to={paths.getHomePath()} replace />}
        />
      )}

      <Route
        key={paths.getAdminPath()}
        path={paths.getAdminPath()}
        element={<AdminPage legacy={true} />}
      />
      <Route
        key={paths.getVaultsPath()}
        path={paths.getVaultsPath()}
        element={<VaultsPage />}
      />
      <Route
        key={paths.getCirclesPath()}
        path={paths.getCirclesPath()}
        element={<AdminPage />}
      />

      <Route path="*" element={<Navigate to={paths.getHomePath()} replace />} />
    </Routes>
  );
};
