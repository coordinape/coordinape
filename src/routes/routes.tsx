import React, { lazy } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import DevPortalPage from '../pages/DevPortalPage';
import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CirclesPage from 'pages/CirclesPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import DistributePage from 'pages/DistributePage';
import DistributionPage from 'pages/DistributionPage';
import HistoryPage from 'pages/HistoryPage';
import IntegrationCallbackPage from 'pages/IntegrationCallbackPage';
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

import { paths } from './paths';

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
      <Route path={paths.createCircle} element={<CreateCirclePage />} />
      <Route
        path={paths.profile(':profileAddress')}
        element={<ProfilePage />}
      />
      <Route path={paths.home} element={<DefaultPage />} />
    </Routes>
  );
};

const LoggedInRoutes = () => {
  return (
    <Routes>
      <Route path={paths.home} element={<DefaultPage />} />
      <Route path={paths.createCircle} element={<CreateCirclePage />} />
      <Route
        path={paths.profile(':profileAddress')}
        element={<ProfilePage />}
      />
      <Route path={paths.map()} element={<LazyAssetMapPage />} />
      <Route path={paths.vouching} element={<VouchingPage />} />
      <Route path={paths.history} element={<HistoryPage />} />
      <Route path={paths.allocation} element={<AllocationPage />} />
      <Route path={paths.team} element={<AllocationPage />} />
      <Route path={paths.epoch} element={<AllocationPage />} />
      <Route path={paths.give} element={<AllocationPage />} />
      <Route path={paths.circles} element={<CirclesPage />} />
      <Route path={paths.vaults} element={<VaultsPage />} />
      <Route path={paths.vaultTxs(':id')} element={<VaultTransactions />} />
      <Route
        path={paths.adminCircles}
        element={
          <RequireAdmin>
            <AdminPage />
          </RequireAdmin>
        }
      />
      <Route
        path={paths.connectIntegration}
        element={<IntegrationCallbackPage />}
      />
      <Route path={paths.developers} element={<DevPortalPage />} />

      <Route path={paths.distribute(':epochId')} element={<DistributePage />} />
      <Route path={paths.distribution(':id')} element={<DistributionPage />} />

      <Route path="*" element={<Navigate to={paths.home} replace />} />
    </Routes>
  );
};

const RequireAdmin = ({ children }: { children: React.ReactElement }) => {
  const selectedUser = useSelectedCircleLoadable().valueMaybe()?.myUser;
  const hasAdminView =
    useMyProfile().hasAdminView || !!selectedUser?.isCircleAdmin;

  if (selectedUser && !hasAdminView)
    return <Navigate to={paths.home} replace />;

  return children;
};
