import React, { lazy } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import DistributePage from 'pages/DistributePage';
import HistoryPage from 'pages/HistoryPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import { VaultTransactions } from 'pages/VaultsPage/VaultTransactions';
import VouchingPage from 'pages/VouchingPage';
import {
  useMyProfile,
  useSelectedCircleLoadable,
  useHasSelectedCircle,
} from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';

import {
  paths,
  getCreateCirclePath,
  getProfilePath,
  getMapPath,
  getDistributePath,
} from './paths';

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
      <Route path={getCreateCirclePath()} element={<CreateCirclePage />} />
      <Route
        path={getProfilePath({ address: ':profileAddress' })}
        element={<ProfilePage />}
      />
      <Route path={paths.home} element={<DefaultPage />} />
    </Routes>
  );
};

const LoggedInRoutes = () => {
  const selectedUser = useSelectedCircleLoadable().valueMaybe()?.myUser;
  const hasAdminView =
    useMyProfile().hasAdminView || !!selectedUser?.isCircleAdmin;

  return (
    <Routes>
      <Route path={paths.home} element={<DefaultPage />} />
      <Route path={getCreateCirclePath()} element={<CreateCirclePage />} />
      <Route
        path={getProfilePath({ address: ':profileAddress' })}
        element={<ProfilePage />}
      />
      <Route path={getMapPath()} element={<LazyAssetMapPage />} />
      <Route path={paths.vouching} element={<VouchingPage />} />
      <Route path={paths.history} element={<HistoryPage />} />
      <Route path={paths.allocation} element={<AllocationPage />} />
      <Route path={paths.team} element={<AllocationPage />} />
      <Route path={paths.epoch} element={<AllocationPage />} />
      <Route path={paths.give} element={<AllocationPage />} />
      <Route
        path={paths.admin}
        element={
          selectedUser && !hasAdminView ? (
            <Navigate to={paths.home} replace />
          ) : (
            <AdminPage legacy={true} />
          )
        }
      />
      <Route path={paths.vaults} element={<VaultsPage />} />
      <Route path={paths.vaultTxs(':id')} element={<VaultTransactions />} />
      <Route path={paths.adminCircles} element={<AdminPage />} />
      <Route
        path={getDistributePath(':epochId')}
        element={<DistributePage />}
      />

      <Route path="*" element={<Navigate to={paths.home} replace />} />
    </Routes>
  );
};
