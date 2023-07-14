/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateTime, Interval } from 'luxon';
import { useQuery } from 'react-query';

import { CSS } from '../../stitches.config';
import { Text } from '../../ui';
import {
  getHistoryData,
  QUERY_KEY_ACTIVE_HISTORY,
} from 'pages/HistoryPage/getHistoryData';
import { useReceiveInfo } from 'pages/HistoryPage/useReceiveInfo';

export const NavCurrentCircleEpochEndingNotification = ({
  circleId,
  user,
  css,
  checkAllocation = false,
}: {
  circleId: number;
  user?: { id: number; role: number };
  css?: CSS;
  checkAllocation?: boolean;
}) => {
  const userId = user?.id;
  const query = useQuery(
    [QUERY_KEY_ACTIVE_HISTORY, circleId],
    // TODO make this work without a userId
    // @ts-ignore
    () => getHistoryData(circleId, userId),
    {
      enabled: !!userId && !!circleId,
    }
  );

  const circle = query.data;
  const me = circle?.users[0];
  const unallocated = (!me?.non_giver && me?.give_token_remaining) || 0;
  const { currentEpochEndDate } = useReceiveInfo(circleId, user?.id);
  const endDate = DateTime.fromISO(currentEpochEndDate);
  const epochTimeRemaining = Interval.fromDateTimes(DateTime.now(), endDate);
  const epochDaysRemaining = Math.floor(epochTimeRemaining.length('days'));
  const daysPlural = epochDaysRemaining > 1 ? 'Days' : 'Day';

  if (!currentEpochEndDate || (checkAllocation && unallocated == 0)) {
    return <></>;
  }

  return (
    <>
      {epochDaysRemaining < 3 && (
        <Text tag color="warning" css={css}>
          {epochDaysRemaining == 0
            ? 'Due Today'
            : `${epochDaysRemaining} ${daysPlural} Left`}
        </Text>
      )}
    </>
  );
};
