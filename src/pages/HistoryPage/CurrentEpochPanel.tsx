import { NavLink } from 'react-router-dom';

import { useAllocation } from 'hooks';
import { useSelectedCircle } from 'recoilState';
import { paths } from 'routes/paths';
import { Box, Panel, Text, Button } from 'ui';
import Medal from 'ui/icons/Medal.svg';
import PlusInCircle from 'ui/icons/PlusInCircle.svg';

import { IEpoch } from 'types';

export const CurrentEpochPanel = ({ epoch }: { epoch: IEpoch }) => {
  const { circle, activeNominees } = useSelectedCircle();
  const numberOfNominees = activeNominees.length;

  const { tokenRemaining, tokenStarting } = useAllocation(circle.id);
  const percentageTokenRemaining = (tokenRemaining * 100) / tokenStarting;

  const endDateFormat =
    epoch?.endDate.month === epoch?.startDate.month ? 'dd' : 'MMMM dd';

  return (
    <Panel
      css={{
        mb: '$xl',
        fontSize: '$8',
        fontFamily: 'Inter',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Text bold font="inter">
          {epoch.startDate.toFormat('MMMM dd')} -{' '}
          {epoch.endDate.toFormat(endDateFormat)}
        </Text>
      </Box>
      <Box css={{ display: 'flex' }}>
        {circle.hasVouching && (
          <Minicard
            icon={Medal}
            title="Nominations"
            alert={numberOfNominees > 0}
            content={
              numberOfNominees > 0
                ? `${numberOfNominees} nomination${
                    numberOfNominees > 1 ? 's' : ''
                  }`
                : 'None yet. Nominate someone?'
            }
            path={paths.vouching}
            linkLabel="Go to Vouching"
          />
        )}
        <Minicard
          icon={PlusInCircle}
          title="Allocations"
          alert={percentageTokenRemaining > 0}
          content={
            percentageTokenRemaining > 0
              ? `Allocate Your Remaining ${percentageTokenRemaining}%`
              : `No More GIVE Tokens to Allocate`
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
        ml: '$md',
        minWidth: '280px',
        display: 'grid',
        gridTemplateColumns: '$lg 1fr',
        gap: '$sm',
      }}
    >
      <Box css={{ justifySelf: 'center', '> img': { verticalAlign: 'top' } }}>
        <img src={icon} alt="logo" />
      </Box>

      <Box
        css={{
          paddingTop: '$sm',
          color: '$lightText',
          flexGrow: 1,
          display: 'flex',
          gap: '$md',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Text variant="formLabel">{title}</Text>
        <Text bold css={{ fontSize: '$3', color: alert ? 'red' : '$gray400' }}>
          {content}
        </Text>
        <Button outlined size="small" as={NavLink} key={path} to={path}>
          {linkLabel}
        </Button>
      </Box>
    </Panel>
  );
};
