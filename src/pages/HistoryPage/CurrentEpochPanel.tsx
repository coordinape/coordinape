import { DateTime, Interval } from 'luxon';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { Give, PlusCircle } from 'icons/__generated';
import { paths } from 'routes/paths';
import { Box, Panel, Text, Button, Flex } from 'ui';

type Props = {
  epoch: {
    start_date?: any;
    end_date: any;
    description?: string;
    number?: number;
  };
  unallocated: number;
  circleId: number;
  tokenName?: string;
  editCurrentEpoch: () => void;
  isEditing: boolean;
  isAdmin: boolean;
  css?: CSS;
};
export const CurrentEpochPanel = ({
  epoch,
  unallocated,
  circleId,
  tokenName = 'GIVE',
  editCurrentEpoch,
  isEditing,
  isAdmin,
  css = {},
}: Props) => {
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const epochTimeRemaining = Interval.fromDateTimes(DateTime.now(), endDate);
  const epochDaysRemaining = Math.floor(epochTimeRemaining.length('days'));
  const daysPlural = epochDaysRemaining > 1 ? 'Days' : 'Day';

  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMM d';

  return (
    <Panel
      css={{
        mb: '$xl',
        alignItems: 'start',
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '$md',
        border: '1px solid $borderFocusBright',
        '@sm': { gridTemplateColumns: '1fr' },
        ...css,
      }}
    >
      <Flex
        column
        alignItems="start"
        css={{ gap: '$sm', borderRight: '1px solid $borderDim' }}
      >
        <Text h1 css={{ color: '$currentEpochDate', fontSize: '$h1Temp' }}>
          {startDate.toFormat('MMM')} {startDate.toFormat('d')} -{' '}
          {endDate.toFormat(endDateFormat)}
        </Text>
        <Text
          h2
          p
          css={{ color: '$currentEpochDescription', fontSize: '$h2Temp' }}
        >
          {
            epoch.description ??
              'Epoch ' +
                (epoch.number ??
                  '') /* TODO: why is this null sometime? just from data seeding? */
          }
        </Text>
        {!isEditing && isAdmin && (
          <Button
            color="secondary"
            size="small"
            onClick={() => editCurrentEpoch()}
          >
            Edit Epoch
          </Button>
        )}
      </Flex>
      <Flex
        css={{
          gap: '$md',
          '@sm': { flexDirection: 'column' },
        }}
      >
        <Minicard
          icon={<PlusCircle />}
          title="Contributions"
          color="$text"
          content={
            epochDaysRemaining == 0
              ? 'Today is the Last Day to Add Contributions'
              : `${epochDaysRemaining} ${daysPlural} Left to Add Contributions`
          }
          path={paths.contributions(circleId)}
          linkLabel="Add Contribution"
        />
        <Minicard
          icon={<Give nostroke />}
          title="GIVE"
          // TODO: maybe we want to continue to highlight some color here
          // color={unallocated > 0 ? '$alert' : '$secondaryText'}
          color="$text"
          content={
            unallocated > 0
              ? `Allocate Your Remaining ${unallocated} ${tokenName}`
              : `No More ${tokenName} to Allocate ${unallocated}`
          }
          path={paths.give(circleId)}
          linkLabel="GIVE to Teammates"
        />
      </Flex>
    </Panel>
  );
};

type MinicardProps = {
  icon?: any;
  title?: string;
  content: any;
  color?: string;
  path: string;
  linkLabel: string;
};

const Minicard = ({
  icon,
  title,
  content,
  color,
  path,
  linkLabel,
}: MinicardProps) => {
  return (
    <Box
      css={{
        width: '100%',
        gap: '$sm',
        borderLeft: '1px solid $borderDim',
        '&:first-of-type': {
          borderLeft: 'none',
        },
        pl: '$xl',
        '@sm': {
          minWidth: 0,
        },
      }}
    >
      <Box
        css={{
          color: '$secondaryText',
          flexGrow: 1,
          display: 'flex',
          gap: '$md',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Text variant="label" css={{ mb: '$sm' }}>
            <Flex css={{ mr: '$xs' }}>{icon}</Flex>
            {title}
          </Text>
          <Text
            semibold
            css={{
              fontSize: '$medium',
              // color: alert ? 'red' : '$secondaryText',
              color: color,
            }}
          >
            {content}
          </Text>
        </Box>
        <Button size="small" color="primary" as={NavLink} key={path} to={path}>
          {linkLabel}
        </Button>
      </Box>
    </Box>
  );
};
