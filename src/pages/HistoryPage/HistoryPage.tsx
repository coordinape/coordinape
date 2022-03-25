import React, { useState, useMemo } from 'react';

import times from 'lodash/times';
import { NavLink } from 'react-router-dom';
import { styled, CSS } from 'stitches.config';

import { ApeAvatar } from 'components';
import { useAllocation, useAllocationController } from 'hooks';
import { useUserGifts } from 'recoilState/allocation';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Box, Button, Panel, Text, Link, AppLink } from 'ui';
import Medal from 'ui/icons/Medal.svg';
import PlusInCircle from 'ui/icons/PlusInCircle.svg';
import { SingleColumnLayout } from 'ui/layouts';

import { IEpoch, ITokenGift } from 'types';

export const HistoryPage = () => {
  const pageSize = 3;
  const {
    circle,
    myUser,
    circleEpochsStatus: { currentEpoch, nextEpoch, pastEpochs },
    activeNominees,
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
  const numberOfNominees = activeNominees.length;

  useAllocationController(circle.id);
  const { tokenRemaining, tokenStarting } = useAllocation(circle.id);
  const percentageTokenRemaining = (tokenRemaining * 100) / tokenStarting;

  const currentEndDateFormat =
    currentEpoch?.endDate.month === currentEpoch?.startDate.month
      ? 'dd'
      : 'MMMM dd';

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
            <Text>
              <Text inline bold color={'gray'} font={'inter'}>
                Next Epoch
              </Text>
              &nbsp;starts in {nextEpoch?.labelUntilStart.toLowerCase()},{' '}
              {nextEpoch.startDate.toFormat('LLL d, yyyy')}
            </Text>
          </Panel>
        </>
      )}
      {page === 0 && currentEpoch && (
        <>
          <Header>Current</Header>
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
              <Text bold font={'inter'}>
                {currentEpoch.startDate.toFormat('MMMM dd')} -{' '}
                {currentEpoch.endDate.toFormat(currentEndDateFormat)}
              </Text>
            </Box>
            <Box css={{ display: 'flex' }}>
              <Minicard
                icon={Medal}
                title={`Nomination`}
                left={numberOfNominees > 0}
                content={
                  numberOfNominees > 0
                    ? `${numberOfNominees} nomination${
                        numberOfNominees > 1 ? 's' : ''
                      }`
                    : 'No nominations'
                }
                linkpaths={paths.vouching}
                linkLabel="Go Vouching"
              />
              <Minicard
                icon={PlusInCircle}
                title={`Allocation`}
                left={percentageTokenRemaining > 0}
                content={
                  percentageTokenRemaining > 0
                    ? `Allocate Your Remaining ${percentageTokenRemaining}%`
                    : `No More GIVE Tokens to Allocate`
                }
                linkpaths={paths.allocation}
                linkLabel="Allocate to Teammates"
              />
            </Box>
          </Panel>
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
  const endDateFormat = endDate.month === startDate.month ? 'dd' : 'MMMM dd';
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
        <Text bold font={'inter'}>
          {startDate.toFormat('MMMM dd')} - {endDate.toFormat(endDateFormat)}
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
        <Text bold font={'inter'} css={{ fontSize: '$6', mb: '$md' }}>
          {totalReceived} {tokenName}
        </Text>
        <Text variant="formLabel">Total Distributed</Text>
        <Text bold font={'inter'} css={{ fontSize: '$6' }}>
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
            <Text
              bold
              font={'inter'}
              css={{
                fontSize: '$6',
              }}
            >
              {sent.filter(sent => sent.note).length}
            </Text>
          </Box>
          <Box>
            <Text variant="formLabel">Received</Text>
            <Text
              bold
              font={'inter'}
              css={{
                fontSize: '$6',
              }}
            >
              {received.filter(received => received.note).length}
            </Text>
          </Box>
        </Panel>
      ) : (
        <Panel nested>
          <Box
            css={{
              display: 'flex',
              gap: '$sm',
            }}
          >
            <Text
              variant="formLabel"
              css={{
                color: tab === 0 ? '$primary' : '$gray400',
                cursor: 'pointer',
                border: '1px solid $primary',
                padding: '$sm',
                borderRadius: '$pill',
              }}
              onClick={() => setTab(0)}
            >
              Received
            </Text>
            <Text
              variant="formLabel"
              css={{
                color: tab === 1 ? '$primary' : '$gray400',
                cursor: 'pointer',
                border: '1px solid $primary',
                padding: '$sm',
                borderRadius: '$pill',
              }}
              onClick={() => setTab(1)}
            >
              Sent
            </Text>
          </Box>
          {tab === 0 ? (
            <GiftsData data={received} dataRef={'Received'} />
          ) : (
            <GiftsData data={sent} dataRef={'Sent'} />
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

type PaginatorProps = {
  css?: CSS;
  pages: number;
  current: number;
  onSelect: (page: number) => void;
};
const Paginator = ({ css, pages, current, onSelect }: PaginatorProps) => {
  return (
    <Box
      css={{
        display: 'flex',
        height: '$xl',
        gap: '$sm',
        justifyContent: 'flex-end',
        '> *': {
          width: '$xl',
          height: '$xl !important',
          fontFamily: 'Inter',
          fontSize: '$4',
          fontWeight: '$normal',
          padding: 0,
          backgroundColor: 'white',
          color: '$primary',
        },
        ...css,
      }}
    >
      <Button
        color="transparent"
        disabled={current === 0}
        onClick={() => onSelect(current - 1)}
      >
        &#60;
      </Button>
      {times(pages, (n: number) => (
        <Button
          color="transparent"
          css={
            n !== current
              ? {}
              : {
                  borderRadius: '$1',
                  backgroundColor: '$teal !important',
                  color: 'white !important',
                }
          }
          onClick={() => onSelect(n)}
        >
          {n + 1}
        </Button>
      ))}
      <Button
        color="transparent"
        disabled={current === pages - 1}
        onClick={() => onSelect(current + 1)}
      >
        &#62;
      </Button>
    </Box>
  );
};

type MinicardProps = {
  icon?: any;
  title?: string;
  content: any;
  left?: boolean;
  linkpaths: string;
  linkLabel: string;
};

const Minicard = ({
  icon,
  title,
  content,
  left,
  linkpaths,
  linkLabel,
}: MinicardProps) => {
  const colorText = left ? 'red' : '$gray400';
  return (
    <Panel nested css={{ ml: '$md', minWidth: '280px' }}>
      <Box
        css={{
          color: '$gray400',
          display: 'flex',
          mb: '$sm',
          alignItems: 'center',
        }}
      >
        <img src={icon} alt="logo" />
        <Text variant="formLabel" css={{ ml: '$xs', mb: 0 }}>
          {title}
        </Text>
      </Box>
      <Text
        bold
        css={{
          fontSize: '$3',
          mb: '$md',
          color: colorText,
          opacity: 0.5,
          ml: '$lg',
        }}
      >
        {content}
      </Text>
      <Link
        as={NavLink}
        key={linkpaths}
        to={linkpaths}
        css={{
          size: '$max',
          ml: '$lg',
        }}
      >
        <Text
          bold
          css={{
            p: '$xs',
            fontSize: '$3',
            border: 'solid 1px $border',
            borderRadius: '$3',
          }}
        >
          {linkLabel}
        </Text>
      </Link>
    </Panel>
  );
};

type GiftsDataProps = {
  data: any;
  dataRef: string;
};

const GiftsData = ({ data, dataRef }: GiftsDataProps) => {
  const receivedGifts =
    data.length > 0 ? (
      data.map((gift: any) => (
        <Box key={gift.id} css={{ display: 'flex', my: '$sm' }}>
          <Box css={{ mr: '$md' }}>
            <ApeAvatar user={gift.sender} />
          </Box>
          <Box css={{ alignItems: 'center', display: 'flex' }}>
            {gift.note && (
              <Text css={{ mb: '$xs', lineHeight: 'normal' }}>{gift.note}</Text>
            )}
            <Box css={{ fontSize: '$3', color: '$green' }}>
              {gift.tokens} {gift.tokenName}{' '}
              {dataRef === 'Received'
                ? `received from ${gift.sender.name}`
                : `sent to ${gift.recipient.name}`}
            </Box>
          </Box>
        </Box>
      ))
    ) : (
      <Box css={{ mt: '$md' }}>
        <Text variant="formLabel">You did not {dataRef} any notes</Text>
      </Box>
    );

  return receivedGifts;
};
