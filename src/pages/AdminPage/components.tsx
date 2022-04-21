import { useEffect, useMemo, useState } from 'react';

import { GearIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from 'stitches.config';

import { NoticeBox } from 'components';
import { USER_ROLE_ADMIN } from 'config/constants';
import { isFeatureEnabled } from 'config/features';
import useMobileDetect from 'hooks/useMobileDetect';
import { PlusCircleIcon } from 'icons';
import { paths } from 'routes/paths';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Tooltip,
  Text,
  Paginator,
} from 'ui';
import * as Table from 'ui/Table/Table';
import { shortenAddress } from 'utils';

import { ICircle, IEpoch, IUser } from 'types';

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

// export const userAvatar = (user: IUser) 

export const renderUserCard = (user: IUser) => {
  return (
    <Flex
      css={{
        flexDirection: 'row',
        margin: '$md',
      }}
    >
      <Avatar path={user.profile?.avatar} name={user.name} />
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

export const TableLink = styled(RouterLink, {
  color: '$lightBlue',
  '&:hover': {
    color: '$darkBlue',
  },
  textDecoration: 'none',
});

export const EpochsTable = ({
  circle,
  epochs,
  perPage = 6,
  downloadCSV,
  setEditEpoch,
  setDeleteEpochDialog,
  setNewEpoch,
}: {
  circle: ICircle;
  epochs: IEpoch[];
  perPage?: number;
  downloadCSV: (epoch: number) => Promise<any>;
  setEditEpoch: (e: IEpoch) => void;
  setDeleteEpochDialog: (e: IEpoch) => void;
  setNewEpoch: (newEpoch: boolean) => void;
}) => {
  const { isMobile } = useMobileDetect();

  const [page, setPage] = useState<number>(1);
  const [view, setView] = useState<IEpoch[]>([]);

  useEffect(() => {
    setView(epochs);
  }, [perPage, epochs]);

  const pagedView = useMemo(
    () =>
      view.slice((page - 1) * perPage, Math.min(page * perPage, view.length)),
    [view, perPage, page]
  );

  const TwoLineCell = styled('div', {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 11,
    lineHeight: 1.5,
    '@xs': {
      height: 'auto',
    },
  });

  const CellTitle = styled('span', {
    fontWeight: '$semibold',
  });

  const CellSubtitle = styled('span', {
    fontWeight: '$normal',
  });

  const downloadCSVButton = (epoch: number) => (
    <TableLink
      to=""
      onClick={() => {
        // use the authed api to download the CSV
        downloadCSV(epoch).then(res => {
          const binaryData = [];
          binaryData.push(res.data);
          const href = window.URL.createObjectURL(
            new Blob(binaryData, { type: 'text/csv' })
          );
          const a = document.createElement('a');
          a.download = `${circle?.protocol.name}-${circle?.name}-epoch-${epoch}.csv`;
          a.href = href;
          a.click();
          a.href = '';
        });
        return false;
      }}
    >
      Export CSV
    </TableLink>
  );

  const epochDetail = (e: IEpoch) => {
    const r =
      e.repeatEnum === 'none'
        ? ''
        : e.repeatEnum === 'weekly'
        ? `${e.startDay} - ${e.endDay}`
        : 'monthly';
    return e.ended
      ? e.labelActivity
      : `${e.calculatedDays} ${e.calculatedDays > 1 ? 'days' : 'day'}${
          e.repeat ? ` repeats ${r}` : ''
        }`;
  };

  // Epoch Columns
  const RenderEpochDetails = (e: IEpoch) => (
    <TwoLineCell>
      <CellTitle>Epoch {e.number}</CellTitle>
      <CellSubtitle>{epochDetail(e)}</CellSubtitle>
    </TwoLineCell>
  );

  const renderActions = (onEdit?: () => void, onDelete?: () => void) => (
    <Flex css={{ justifyContent: 'center' }}>
      {onEdit ? (
        <Button size="small" onClick={onEdit} color="blue">
          Edit
        </Button>
      ) : (
        <Box css={{ width: 30 }} />
      )}

      {onDelete && (
        <>
          <Text color="lightBlue">|</Text>
          <Button size="small" onClick={onDelete} color="blue">
            Delete
          </Button>
        </>
      )}
    </Flex>
  );

  const RenderEpochDates = (e: IEpoch) => (
    <TwoLineCell>
      <CellTitle>
        {e.labelYearEnd} - {e.labelDayRange}
      </CellTitle>
      <CellSubtitle>{e.ended ? e.labelTimeEnd : e.labelTimeStart}</CellSubtitle>
    </TwoLineCell>
  );

  const RenderEpochActions = (e: IEpoch) => {
    if (e.ended) {
      // this epoch is over, so there are no edit/delete actions, only download CSV
      // assert that e.number is non-null
      if (e.number) {
        return (
          <Box css={{ display: 'flex', flexDirection: 'column' }}>
            {downloadCSVButton(e.number)}
            {isFeatureEnabled('vaults') && (
              <TableLink to={paths.vaultDistribute(e.id)}>
                Submit Distribution
              </TableLink>
            )}
          </Box>
        );
      } else {
        // epoch/number is null, so we can't provide a download link
        return <></>;
      }
    } else {
      // epoch still in progress
      return renderActions(
        () => setEditEpoch(e),
        !e.started ? () => setDeleteEpochDialog(e) : undefined
      );
    }
  };

  const renderEmptyEpochsTable = () => {
    return (
      <Flex
        css={{
          height: 238,
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          css={{
            fontSize: '$7',
            my: '$lg',
            fontWeight: '$bold',
            opacity: 0.7,
          }}
        >
          You don’t have any epochs scheduled
        </Text>
        <Button color="red" onClick={() => setNewEpoch(true)}>
          <PlusCircleIcon />
          Create Epoch
        </Button>
      </Flex>
    );
  };
  return (
    <Table.Table>
      <Table.Root>
        {!isMobile && (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell align="left">Epoch Details</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell align="left">Dates</Table.HeaderCell>
              <Table.HeaderCell area="narrow">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )}
        <Table.Body>
          {epochs.length ? (
            isMobile ? (
              pagedView.map(e => {
                return <Table.Row key={e.id}>{renderEpochCard(e)}</Table.Row>;
              })
            ) : (
              pagedView.map(e => {
                return (
                  <Table.Row key={e.id}>
                    <Table.Cell key={`details-${e.id}`} align="left">
                      {RenderEpochDetails(e)}
                    </Table.Cell>

                    <Table.Cell key={`status-${e.id}`}>
                      {RenderEpochStatus(e)}
                    </Table.Cell>

                    <Table.Cell key={`date-${e.id}`} align="left">
                      {RenderEpochDates(e)}
                    </Table.Cell>

                    <Table.Cell key={`actions-${e.id}`}>
                      {RenderEpochActions(e)}
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )
          ) : (
            <Table.Row>
              <Table.Cell key={`empty-epochs-table-view`} colSpan={4}>
                {renderEmptyEpochsTable()}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
      <Paginator
        totalItems={epochs.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </Table.Table>
  );
};
