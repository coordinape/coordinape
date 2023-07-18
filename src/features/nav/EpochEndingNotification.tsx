import { DateTime, Interval } from 'luxon';
import { CSS } from 'stitches.config';

import Countdown from 'components/Countdown';
// import { AlertCircle } from 'icons/__generated';
import { useCurrentEpochInfo } from 'pages/HistoryPage/useCurrentEpochInfo';
import { Text } from 'ui';

export const EpochEndingNotification = ({
  css,
  circleId,
  message = 'Epoch Ends',
  showCountdown = false,
  asTag = true,
  indicatorOnly = false,
}: {
  css?: CSS;
  circleId: number;
  message?: string;
  showCountdown?: boolean;
  asTag?: boolean;
  indicatorOnly?: boolean;
}) => {
  const { currentEpochEndDate } = useCurrentEpochInfo(circleId);
  const endDate = DateTime.fromISO(currentEpochEndDate);
  const epochTimeRemaining = Interval.fromDateTimes(DateTime.now(), endDate);
  const epochDaysRemaining = Math.floor(epochTimeRemaining.length('days'));
  const daysPlural = epochDaysRemaining > 1 ? 'Days' : 'Day';

  if (!currentEpochEndDate) {
    return <></>;
  }

  return (
    <>
      {epochDaysRemaining < 3 && (
        <>
          {indicatorOnly ? (
            // <AlertCircle color="warning" />
            <Text
              color="warning"
              css={{
                lineHeight: '$none',
                height: 0,
                fontSize: '42px',
                position: 'relative',
                top: '-3px',
                ...css,
              }}
            >
              &bull;
            </Text>
          ) : (
            <>
              <Text tag={asTag} color="warning" css={css}>
                {epochDaysRemaining == 0
                  ? `${message} Today`
                  : `${message} in ${epochDaysRemaining} ${daysPlural}`}
              </Text>
              {showCountdown && epochDaysRemaining == 0 && (
                <Countdown targetDate={currentEpochEndDate} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
