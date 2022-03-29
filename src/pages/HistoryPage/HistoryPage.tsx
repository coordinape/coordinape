import { useState, useMemo } from 'react';

import sortBy from 'lodash/sortBy';
import { styled } from 'stitches.config';

import { ApeAvatar } from 'components';
import { Paginator } from 'components/Paginator';
import { useUserGifts } from 'recoilState/allocation';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Box, Panel, Text, AppLink, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CurrentEpochPanel } from './CurrentEpochPanel';

import { IEpoch, ITokenGift } from 'types';

export const HistoryPage = () => {
  const pageSize = 3;
  const {
    circle,
    myUser,
    circleEpochsStatus: { currentEpoch, nextEpoch, pastEpochs },
  } = useSelectedCircle();

  const { fromUserByEpoch, forUserByEpoch, totalReceivedByEpoch } =
    useUserGifts(myUser.id);

  const [page, setPage] = useState(0);
  const shownPastEpochs = useMemo(
    () =>
      pastEpochs
        .slice()
        .reverse()
        .slice(page * pageSize, (page + 1) * pageSize),
    [page]
  );
  const totalPages = Math.ceil(pastEpochs.length / pageSize);

  if (!currentEpoch && !nextEpoch && pastEpochs.length === 0) {
    return (
      <SingleColumnLayout>
        <p>
          This circle has no epochs yet.{' '}
          {myUser.role === 1 ? (
            <>
              <AppLink to={paths.adminCircles}>Visit the admin page</AppLink> to
              create one.
            </>
          ) : (
            <>Please return once your admin has created one.</>
          )}
        </p>
      </SingleColumnLayout>
    );
  }

  return (
    <Box css={{ maxWidth: '$mediumScreen', ml: 'auto', mr: 'auto', p: '$xl' }}>
      {page === 0 && nextEpoch && (
        <>
          <Header>Next</Header>
          <Panel css={{ mb: '$xl', color: '#717C7F' }}>
            <Text inline>
              <Text inline bold color="gray" font="inter">
                Next Epoch
              </Text>{' '}
              starts in {nextEpoch?.labelUntilStart.toLowerCase()}, on{' '}
              {nextEpoch.startDate.toFormat('LLL d')}
            </Text>
          </Panel>
        </>
      )}
      {page === 0 && currentEpoch && (
        <>
          <Header>Current</Header>
          <CurrentEpochPanel epoch={currentEpoch} />
        </>
      )}
      {pastEpochs.length > 0 && (
        <>
          <Header>Past</Header>
          {shownPastEpochs.map((epoch: IEpoch) => (
            <EpochPanel
              key={epoch.id}
              epoch={epoch}
              received={forUserByEpoch.get(epoch.id) || []}
              sent={fromUserByEpoch.get(epoch.id) || []}
              tokenName={circle.tokenName}
              totalReceived={totalReceivedByEpoch.get(epoch.id) || 0}
              totalAllocated={epoch.totalTokens}
            />
          ))}
          <Paginator pages={totalPages} current={page} onSelect={setPage} />
        </>
      )}
    </Box>
  );
};

type EpochPanelProps = {
  epoch: IEpoch;
  received: ITokenGift[];
  sent: ITokenGift[];
  tokenName: string;
  totalReceived: number;
  totalAllocated: number;
};
const EpochPanel = ({
  epoch,
  received,
  sent,
  tokenName,
  totalReceived,
  totalAllocated,
}: EpochPanelProps) => {
  const [tab, setTab] = useState(0);
  const [shortPanelShow, setshortPanelShow] = useState(true);
  const { startDate, endDate } = epoch;
  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMMM d';

  return (
    <Panel
      css={{
        mb: '$md',
        display: 'grid',
        gridTemplateColumns: '23fr 15fr 62fr',
        gap: '$md',
      }}
    >
      <Box
        css={{
          fontSize: '$8',
          fontFamily: 'Inter',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Text font="inter" inline>
          <Text inline font="inter" css={{ fontWeight: '$semibold' }}>
            {startDate.toFormat('MMMM')}
          </Text>{' '}
          {startDate.toFormat('d')} - {endDate.toFormat(endDateFormat)}
        </Text>
        <button onClick={() => setshortPanelShow(!shortPanelShow)}>
          <Text
            variant="formLabel"
            css={{
              size: '$max',
              fontSize: '$2',
              color: '$green',
              mt: '$xl',
              cursor: 'pointer',
            }}
          >
            {shortPanelShow ? 'Show More' : 'Show Less'}
          </Text>
        </button>
      </Box>
      <Panel nested>
        <Text variant="formLabel">You received</Text>
        <Text bold font="inter" css={{ fontSize: '$6', mb: '$md' }}>
          {totalReceived} {tokenName}
        </Text>
        <Text variant="formLabel">Total Distributed</Text>
        <Text bold font="inter" css={{ fontSize: '$6' }}>
          {totalAllocated} {tokenName}
        </Text>
      </Panel>
      {shortPanelShow ? (
        <Panel
          nested
          css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            color: '$primary',
          }}
        >
          <Box css={{ mr: '$md' }}>
            <Text variant="formLabel">Notes Left</Text>
            <Text bold font="inter" css={{ fontSize: '$6' }}>
              {sent.filter(sent => sent.note).length}
            </Text>
          </Box>
          <Box>
            <Text variant="formLabel">Received</Text>
            <Text bold font="inter" css={{ fontSize: '$6' }}>
              {received.filter(received => received.note).length}
            </Text>
          </Box>
        </Panel>
      ) : (
        <Panel nested>
          <Box css={{ display: 'flex', gap: '$sm', mb: '$xs' }}>
            {['Received', 'Sent'].map((label, index) => (
              <Button
                key={label}
                outlined
                size="small"
                css={{ borderRadius: '$pill' }}
                onClick={() => setTab(index)}
              >
                <Text
                  variant="formLabel"
                  css={{ color: tab === index ? '$primary' : '$gray400' }}
                >
                  {label}
                </Text>
              </Button>
            ))}
          </Box>
          {tab === 0 ? (
            <Notes tokenName={tokenName} data={received} received />
          ) : (
            <Notes tokenName={tokenName} data={sent} />
          )}
        </Panel>
      )}
    </Panel>
  );
};

const Header = styled(Text, {
  mb: '$md',
  fontSize: '$7',
  fontFamily: 'Inter !important',
  color: '$placeholder',
  fontWeight: '$semibold',
});

type NotesProps = {
  tokenName: string;
  data: ITokenGift[];
  received?: boolean;
};

const Notes = ({ data, received, tokenName }: NotesProps) => {
  if (data.length === 0) {
    return (
      <Box css={{ mt: '$md' }}>
        <Text variant="formLabel">
          You did not {received ? 'receive' : 'send'} any notes
        </Text>
      </Box>
    );
  }

  const sorted = sortBy(data, gift => -gift.tokens);

  return (
    <>
      {sorted.map(gift => (
        <Box key={gift.id} css={{ display: 'flex', my: '$sm' }}>
          <Box css={{ mr: '$md' }}>
            <ApeAvatar user={received ? gift.sender : gift.recipient} />
          </Box>
          <Box
            css={!gift.note ? { alignItems: 'center', display: 'flex' } : {}}
          >
            {gift.note && (
              <Text css={{ mb: '$xs', lineHeight: 'normal' }}>{gift.note}</Text>
            )}
            <Box css={{ fontSize: '$3', color: '$green' }}>
              {gift.tokens} {tokenName}{' '}
              {received
                ? `received from ${gift.sender.name}`
                : `sent to ${gift.recipient.name}`}
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};
