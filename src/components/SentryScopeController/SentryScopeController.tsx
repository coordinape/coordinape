import React, { useEffect, Suspense } from 'react';

import * as Sentry from '@sentry/browser';

import { useSelectedAllocation } from 'hooks';
import {
  useWalletAuth,
  useMyProfile,
  useSelectedCircle,
} from 'recoilState/app';

export const SentryScopeController = () => {
  return (
    <>
      <Suspense fallback={null}>
        <AllocationScope />
      </Suspense>
      <Suspense fallback={null}>
        <SelectedCircleScope />
      </Suspense>
    </>
  );
};

const AllocationScope = () => {
  const { localTeammatesChanged, localGiftsChanged, tokenRemaining } =
    useSelectedAllocation();

  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setTag('local_teammates_changed', localTeammatesChanged);
      scope.setTag('local_gifts_changed', localGiftsChanged);
      scope.setTag('tokens_remaining', tokenRemaining);
    });
    return () => {
      Sentry.configureScope(scope => {
        scope.setTag('local_teammates_changed', null);
        scope.setTag('local_gifts_changed', null);
        scope.setTag('tokens_remaining', null);
      });
    };
  }, []);

  return <></>;
};

const SelectedCircleScope = () => {
  const { hasAdminView, myUsers } = useMyProfile();
  const { myUser: selectedMyUser, circle: selectedCircle } =
    useSelectedCircle();
  const connectorName = useWalletAuth().connectorName;

  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setTag('selected_circle_id', selectedCircle.id);
      scope.setTag(
        'selected_circle',
        `${selectedCircle?.protocol?.name}-${selectedCircle?.name}`
      );
      scope.setTag('connector_name', connectorName);
      scope.setTag('has_admin_view', hasAdminView);
      scope.setTag('selected_circle_admin', selectedMyUser?.role);
      scope.setTag('selected_circle_admin', selectedMyUser?.role);
      scope.setTag('selected_circle_non_giver', selectedMyUser?.non_giver);
      scope.setTag(
        'selected_circle_non_receiver',
        selectedMyUser?.non_receiver
      );
      scope.setTag('number_circles_member_of', myUsers.length);
    });
  }, [selectedCircle, connectorName, hasAdminView, selectedMyUser, myUsers]);

  return <></>;
};
