import React, { useEffect } from 'react';

import * as Sentry from '@sentry/browser';

import { useCircle, useMe, useSelectedAllocation } from 'hooks';
import { useValConnectorName } from 'recoilState';

const AllocationScope = () => {
  const {
    localTeammatesChanged,
    localGiftsChanged,
    tokenRemaining,
  } = useSelectedAllocation();

  useEffect(() => {
    Sentry.configureScope((scope) => {
      scope.setTag('local_teammates_changed', localTeammatesChanged);
      scope.setTag('local_gifts_changed', localGiftsChanged);
      scope.setTag('tokens_remaining', tokenRemaining);
    });
    return () => {
      Sentry.configureScope((scope) => {
        scope.setTag('local_teammates_changed', null);
        scope.setTag('local_gifts_changed', null);
        scope.setTag('tokens_remaining', null);
      });
    };
  }, []);

  return <></>;
};

export const SentryScopeController = () => {
  const { myCircles, selectedMyUser, hasAdminView } = useMe();
  const { selectedCircleId, selectedCircle } = useCircle();
  const connectorName = useValConnectorName();

  useEffect(() => {
    Sentry.configureScope((scope) => {
      scope.setTag('selected_circle_id', selectedCircleId);
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
      scope.setTag('number_circles_member_of', myCircles.length);
    });
  }, [
    selectedCircleId,
    selectedCircle,
    connectorName,
    hasAdminView,
    selectedMyUser,
    myCircles,
  ]);

  if (selectedCircleId) {
    return <AllocationScope />;
  }

  return <></>;
};
