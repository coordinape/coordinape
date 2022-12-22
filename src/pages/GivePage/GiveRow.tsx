import React, { useEffect, useRef, useState } from 'react';

import { CSS } from '../../stitches.config';
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
          nested={gridView}
          css={{
            p: gridView ? '$md' : 0,
            background: gridView ? '$white' : 'transparent',
            alignItems: 'center',
            display: 'grid',
            gridTemplateColumns: gridView ? '1fr' : '2fr 4fr 4fr',
            justifyContent: 'space-between',
            gap: gridView ? '$md' : '$lg',
            minHeight: 'calc($2xl + $xs)',
            '@sm': {
              gridTemplateColumns: '1fr',
              justifyItems: 'center',
              gap: 0,
            },
          }}
        >
          <AvatarAndName
            name={member.profile.name ?? member.name}
            avatar={member.profile.avatar}
          />
          {!gridView && !docExample && (
            <Flex>
              {member.contributions_aggregate?.aggregate &&
                member.contributions_aggregate?.aggregate.count > 0 && (
                  <Text
                    variant="label"
                    css={{
                      '@sm': {
                        mt: '$md',
                      },
                    }}
                  >
                    {member.contributions_aggregate.aggregate.count}{' '}
                    Contribution
                    {member.contributions_aggregate.aggregate.count == 1
                      ? ''
                      : 's'}
                  </Text>
                )}
            </Flex>
          )}
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
                justifyContent: gridView ? 'flex-end' : 'space-between',
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
                  color={noteComplete ? 'complete' : 'primary'}
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
                <>
                  <Text
                    inline
                    semibold
                    size="large"
                    css={{ color: '$headingText' }}
                  >
                    Epoch Statement
                  </Text>
                  <MarkdownPreview render source={member.bio} />
                </>
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
                {member.contributions_aggregate?.aggregate &&
                  member.contributions_aggregate?.aggregate.count > 0 && (
                    <>
                      <Text variant="label">
                        {member.contributions_aggregate.aggregate.count}{' '}
                        Contribution
                        {member.contributions_aggregate.aggregate.count == 1
                          ? ''
                          : 's'}
                      </Text>
                      <Text size="small" color="secondary" semibold>
                        View
                      </Text>
                    </>
                  )}
              </Flex>
            )}
          </Flex>
        )}
      </GiveRowGrid>
    </Box>
  );
};
