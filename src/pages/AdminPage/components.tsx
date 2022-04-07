import { GearIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { styled } from 'stitches.config';

import { NoticeBox } from 'components';
import { USER_ROLE_ADMIN } from 'config/constants';
import { Avatar, Box, Button, Flex, IconButton, Link, Tooltip, Text } from 'ui';
import { shortenAddress } from 'utils';

import { IEpoch, IUser } from 'types';

// TODO: these variants of text could be moved to ui/Text,
//       waiting for universal definitions for these variants.
const HeaderText = styled(Text, {
  fontSize: '$7',
  fontWeight: '$normal',
  color: '$primary',
  flexGrow: 1,
});

const Title = styled(Text, {
  fontSize: '$4',
  fontWeight: '$medium',
  color: '$primary',
  flexGrow: 1,
});

const Subtitle = styled(Text, {
  fontSize: '$3',
  fontWeight: '$light',
  color: '$primary',
});

const LightText = styled(Text, {
  fontSize: '$3',
  fontWeight: '$normal',
  color: '$lightText',
});

export const SettingsIconButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <IconButton size="md" onClick={onClick}>
      <GearIcon />
    </IconButton>
  );
};

export const CreateEpochButton = ({
  onClick,
  inline,
}: {
  inline?: boolean;
  onClick: () => void;
}) => {
  return (
    <Button color="red" size={inline ? 'inline' : 'small'} onClick={onClick}>
      Create Epoch
      <Tooltip
        title="Create Epoch"
        content={
          <>
            An Epoch is a period of time where circle members contribute value &
            allocate GIVE tokens to one another.
            <Link
              css={{ color: 'Blue' }}
              rel="noreferrer"
              target="_blank"
              href=""
            >
              Learn More
            </Link>
          </>
        }
      >
        <InfoCircledIcon />
      </Tooltip>
    </Button>
  );
};

export const AddContributorButton = ({
  onClick,
  inline,
}: {
  inline?: boolean;
  onClick: () => void;
}) => {
  return (
    <Button color="red" size={inline ? 'inline' : 'small'} onClick={onClick}>
      Add Contributor
      <Tooltip
        title="Add Contributor"
        content={
          <>
            A member of a circle that can receive GIVE or kudos for
            contributions performed.{' '}
            <Link
              css={{ color: 'Blue' }}
              rel="noreferrer"
              target="_blank"
              href="https://docs.coordinape.com/welcome/how_to_use_coordinape#my-epoch"
            >
              Learn More
            </Link>
          </>
        }
      >
        <InfoCircledIcon />
      </Tooltip>
    </Button>
  );
};

export const UsersTableHeader = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'auto',
        my: '$md',
      }}
    >
      <HeaderText>Users</HeaderText>
      <AddContributorButton inline onClick={onClick} />
    </Box>
  );
};

export const EpochsTableHeader = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'auto',
        my: '$md',
      }}
    >
      <HeaderText>Epochs</HeaderText>
      <CreateEpochButton inline onClick={onClick} />
    </Box>
  );
};

const RenderEpochDates = (e: IEpoch) => (
  <Flex
    css={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '$sm',
    }}
  >
    <LightText>
      {e.labelYearEnd} - {e.labelDayRange}
    </LightText>
    <LightText>{e.ended ? e.labelTimeEnd : e.labelTimeStart}</LightText>
  </Flex>
);

const renderEpochDuration = (e: IEpoch) => {
  const repeats =
    e.repeatEnum == 'none' ? "doesn't repeat" : `repeats ${e.repeatEnum}`;
  return `${e.calculatedDays} days, ${repeats}`;
};

export const RenderEpochStatus = (e: IEpoch) =>
  e.ended ? (
    <NoticeBox variant="error">Complete</NoticeBox>
  ) : e.started ? (
    <NoticeBox variant="success">Current</NoticeBox>
  ) : (
    <NoticeBox variant="warning">Upcoming</NoticeBox>
  );

export const renderEpochCard = (e: IEpoch) => {
  return (
    <Flex
      css={{
        flexDirection: 'column',
        width: 'auto',
        margin: '$md',
      }}
    >
      <Flex
        css={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Title>Epoch {e.number}</Title>
        {RenderEpochStatus(e)}
      </Flex>
      <Subtitle>{renderEpochDuration(e)}</Subtitle>
      {RenderEpochDates(e)}
    </Flex>
  );
};

export const renderUserCard = (user: IUser) => {
  return (
    <Flex
      css={{
        flexDirection: 'row',
        margin: '$md',
      }}
    >
      <Avatar user={user} />
      <Flex
        css={{
          flexDirection: 'column',
          flexGrow: 1,
          width: 'auto',
          ml: '$md',
        }}
      >
        <Title>{user.name}</Title>
        <Flex
          css={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Subtitle>{shortenAddress(user.address)}</Subtitle>
          <LightText>
            {user.role === USER_ROLE_ADMIN
              ? 'Admin'
              : `${!user.non_giver ? '✅' : '❌'} GIVE`}
          </LightText>
        </Flex>
      </Flex>
    </Flex>
  );
};
