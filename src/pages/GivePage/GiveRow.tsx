import React, { useEffect, useRef, useState } from 'react';

import { CSS } from '../../stitches.config';
import { useContributions } from 'hooks/useContributions';
import { AlertTriangle, Check } from 'icons/__generated';
import { Box, Flex, MarkdownPreview, Panel, Text } from 'ui';

import { AvatarAndName } from './AvatarAndName';
import { ContributorButton } from './ContributorButton';
import { GiveAllocator } from './GiveAllocator';
import { GiveRowGrid } from './GiveRowGrid';
import { Gift, Member } from './index';

// GiveRow is a row for one member in the give page
export const GiveRow = ({
  member,
  updateTeammate,
  gift,
  adjustGift,
  maxedOut,
  setSelectedMember,
  noGivingAllowed,
  docExample,
  css,
  selected,
  gridView,
  startDate,
  endDate,
}: {
  member: Member;
  updateTeammate(id: number, teammate: boolean): Promise<void>;
  adjustGift(recipientId: number, amount: number): void;
  gift: Gift;
  maxedOut: boolean;
  setSelectedMember(member: Member): void;
  noGivingAllowed: boolean;
  docExample?: boolean;
  css?: CSS;
  selected: boolean;
  gridView: boolean;
  startDate?: Date;
  endDate?: Date;
}) => {
  const integrationContributions = useContributions({
    address: member.profile.address || '',
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    circleId: member.circle_id,
    mock: false,
  });

  const contributionsCount =
    (integrationContributions?.length || 0) +
    (member.contributions_aggregate?.aggregate?.count || 0);

  return (
    <GiveRowComponent
      gift={gift}
      member={member}
      updateTeammate={updateTeammate}
      adjustGift={adjustGift}
      maxedOut={maxedOut}
      noGivingAllowed={noGivingAllowed}
      setSelectedMember={setSelectedMember}
      selected={selected}
      gridView={gridView}
      contributionsCount={contributionsCount}
      docExample={docExample}
      css={css}
    />
  );
};

const MemberActivity = ({
  member,
  contributionsCount,
}: {
  member: Member;
  contributionsCount: number;
}) => {
  return (
    <>
      {(member.pending_sent_gifts.length > 0 || contributionsCount > 0) && (
        <Flex css={{ gap: '$md' }}>
          {member.pending_sent_gifts.length > 0 && (
            <Text variant="label">
              <Check />
              Allocated
            </Text>
          )}
          {contributionsCount > 0 && (
            <Text variant="label">
              {contributionsCount} Contribution
              {contributionsCount == 1 ? '' : 's'}
            </Text>
          )}
        </Flex>
      )}
    </>
  );
};

const GiveRowComponent = ({
  member,
  updateTeammate,
  gift,
  adjustGift,
  maxedOut,
  setSelectedMember,
  noGivingAllowed,
  docExample,
  css,
  selected,
  gridView,
  contributionsCount,
}: {
  member: Member;
  updateTeammate(id: number, teammate: boolean): Promise<void>;
  adjustGift(recipientId: number, amount: number): void;
  gift: Gift;
  maxedOut: boolean;
  setSelectedMember(member: Member): void;
  noGivingAllowed: boolean;
  docExample?: boolean;
  css?: CSS;
  selected: boolean;
  gridView: boolean;
  contributionsCount: number;
}) => {
  // hover indicates that the row is currently hovered; this is needed to show/hide buttons and change their style
  const [hover, setHover] = useState(docExample);

  // noteComplete indicates that this member has a note
  const noteComplete = gift.note && gift.note.length > 0;
  const newRef = useRef<HTMLDivElement>(null);
  const [lastSelected, setLastSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selected) {
      setLastSelected(true);
    } else {
      if (lastSelected) {
        newRef?.current?.focus();
      }
      setLastSelected(false);
    }
  }, [selected, lastSelected]);
  return (
    <Box
      data-testid="give-row"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setSelectedMember(member)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedMember(member);
          e.preventDefault();
        }
      }}
      color="transparent"
      css={{
        p: 0,
        borderRadius: '$3',
        '&:focus-within': {
          button: {
            visibility: 'visible',
          },
        },
      }}
      ref={newRef}
    >
      <GiveRowGrid
        gridView={gridView}
        selected={(selected || docExample) ?? false}
        css={css}
      >
        <Panel
          css={{
            p: gridView ? '$md' : '0',
            background: 'transparent',
            alignItems: 'center',
            display: 'grid',
            gridTemplateColumns: gridView ? '1fr' : '1fr 1.5fr',
            justifyContent: 'space-between',
            gap: gridView ? '$md' : '$lg',
            minHeight: 'calc($2xl + $xs)',
            '@md': { alignItems: 'flex-start' },
            '@sm': {
              gridTemplateColumns: '1fr',
              justifyItems: 'center',
              gap: 0,
            },
          }}
        >
          <Flex
            css={{
              justifyContent: 'space-between',
              '@md': {
                flexDirection: 'column',
                gap: '$sm',
                my: '$sm',
              },
              '@sm': {
                div: {
                  justifyContent: 'center',
                },
              },
            }}
          >
            <AvatarAndName
              name={member.profile.name}
              avatar={member.profile.avatar}
              hasCoSoul={!!member.profile.cosoul}
            />
            {!gridView && !docExample && (
              <MemberActivity
                member={member}
                contributionsCount={contributionsCount}
              />
            )}
          </Flex>
          <Flex
            alignItems="center"
            css={{
              justifyContent: 'flex-end',
              flexDirection: gridView ? 'column' : 'row',
              minWidth: 0,
              gap: gridView ? '$md' : '$xl',
              '@sm': {
                flexDirection: 'column-reverse',
                justifyItems: 'center',
                mt: '$md',
                gap: '$md',
              },
            }}
          >
            <Flex
              css={{
                gap: gridView ? '$sm' : '$xl',
                width: '100%',
                flexDirection: gridView ? 'row-reverse' : 'row',
                justifyContent: gridView ? 'flex-end' : 'space-around',
                '@sm': {
                  justifyContent: 'space-around',
                  width: 'auto',
                  gap: '$sm',
                },
              }}
            >
              <ContributorButton
                css={{
                  '&:hover': { transition: 'visibility 0.1s ease-in' },
                  visibility: hover || member.teammate ? 'visible' : 'hidden',
                }}
                member={member}
                updateTeammate={updateTeammate}
              />
              {!docExample && (
                <Text
                  tag
                  css={{
                    width: '8.5rem',
                    '@sm': {
                      width: 'auto',
                      mr: 0,
                      minWidth: 0,
                      px: '$sm',
                    },
                  }}
                  color={noteComplete ? 'complete' : 'neutral'}
                >
                  {noteComplete ? (
                    <>
                      <Check /> Note Complete
                    </>
                  ) : (
                    <>
                      <AlertTriangle /> Empty Note
                    </>
                  )}
                </Text>
              )}
            </Flex>
            <GiveAllocator
              css={{
                input: {
                  backgroundColor: '$formInputBorderlessBright !important',
                },
              }}
              disabled={noGivingAllowed}
              adjustGift={adjustGift}
              gift={gift}
              maxedOut={maxedOut}
              optedOut={member.non_receiver || member.fixed_non_receiver}
            />
          </Flex>
        </Panel>
        {gridView && (
          <Flex column css={{ pt: '$md', gap: '$md' }}>
            <Flex
              column
              css={{ gap: '$md', height: 'calc($2xl * 3)', overflow: 'hidden' }}
            >
              {member.bio && (
                <Flex
                  column
                  className="epochStatementWrapper"
                  css={{
                    position: 'relative',
                    height: '100%',
                    // gradient overlaying overflowing links
                    '&::after': {
                      content: '',
                      position: 'absolute',
                      background: 'linear-gradient(transparent, $surface)',
                      width: '100%',
                      height: '80px',
                      bottom: 0,
                      left: 0,
                      pointerEvents: 'none',
                      zIndex: 2,
                    },
                  }}
                >
                  <Text
                    inline
                    semibold
                    size="large"
                    css={{ color: '$headingText' }}
                  >
                    Epoch Statement
                  </Text>
                  <MarkdownPreview render source={member.bio} />
                </Flex>
              )}
            </Flex>

            {!docExample && (
              <Flex
                css={{
                  height: '$md',
                  pt: '$md',
                  borderTop: '1px solid $border',
                  justifyContent: 'space-between',
                }}
              >
                <MemberActivity
                  member={member}
                  contributionsCount={contributionsCount}
                />

                <Text size="small" color="secondary" semibold>
                  View
                </Text>
              </Flex>
            )}
          </Flex>
        )}
      </GiveRowGrid>
    </Box>
  );
};
