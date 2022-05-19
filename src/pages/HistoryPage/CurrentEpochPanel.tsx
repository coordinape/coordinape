import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { paths } from 'routes/paths';
import { Box, Panel, Text, Button } from 'ui';
import Medal from 'ui/icons/Medal.svg';
import PlusInCircle from 'ui/icons/PlusInCircle.svg';

type Props = {
  epoch: { start_date?: any; end_date: any };
  nominees: number;
  unallocated: number;
  vouching: boolean;
  tokenName?: string;
  css?: CSS;
};
export const CurrentEpochPanel = ({
  epoch,
  vouching,
  nominees,
  unallocated,
  tokenName = 'GIVE',
  css = {},
}: Props) => {
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);

  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMMM d';

  return (
    <Panel
      css={{
        mb: '$xl',
        fontSize: '$h2',
        fontFamily: 'Inter',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '$md',
        '@sm': { flexDirection: 'column' },
        ...css,
      }}
    >
      <Box>
        <Text inline font="inter">
          <Text inline font="inter" css={{ fontWeight: '$semibold' }}>
            {startDate.toFormat('MMMM')}
          </Text>{' '}
          {startDate.toFormat('d')} - {endDate.toFormat(endDateFormat)}
        </Text>
      </Box>
      <Box
        css={{
          display: 'flex',
          gap: '$md',
          '@sm': { flexDirection: 'column' },
        }}
      >
        {vouching && (
          <Minicard
            icon={Medal}
            title="Nominations"
            alert={nominees > 0}
            content={
              nominees > 0
                ? `${nominees} nomination${nominees > 1 ? 's' : ''}`
                : 'None yet. Nominate someone?'
            }
            path={paths.vouching}
            linkLabel="Go to Vouching"
          />
        )}
        <Minicard
          icon={PlusInCircle}
          title="Allocations"
          alert={unallocated > 0}
          content={
            unallocated > 0
              ? `Allocate Your Remaining ${unallocated} ${tokenName}`
              : `No More ${tokenName} to Allocate`
          }
          path={paths.allocation}
          linkLabel="Allocate to Teammates"
        />
      </Box>
    </Panel>
  );
};

type MinicardProps = {
  icon?: any;
  title?: string;
  content: any;
  alert?: boolean;
  path: string;
  linkLabel: string;
};

const Minicard = ({
  icon,
  title,
  content,
  alert,
  path,
  linkLabel,
}: MinicardProps) => {
  return (
    <Panel
      nested
      css={{
        minWidth: '280px',
        display: 'grid',
        gridTemplateColumns: '$lg 1fr',
        gap: '$sm',
        '@sm': {
          minWidth: 0,
        },
      }}
    >
      <Box css={{ justifySelf: 'center', '> img': { verticalAlign: 'top' } }}>
        <img src={icon} alt="logo" />
      </Box>

      <Box
        css={{
          color: '$secondaryText',
          flexGrow: 1,
          display: 'flex',
          gap: '$md',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Text
          variant="label"
          css={{
            pt: '5px', // hard-coded to align with icon
          }}
        >
          {title}
        </Text>
        <Text
          semibold
          css={{ fontSize: '$medium', color: alert ? 'red' : '$secondaryText' }}
        >
          {content}
        </Text>
        <Button outlined size="small" as={NavLink} key={path} to={path}>
          {linkLabel}
        </Button>
      </Box>
    </Panel>
  );
};
