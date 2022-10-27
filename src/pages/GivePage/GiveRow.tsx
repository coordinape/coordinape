import React, { useEffect, useRef, useState } from 'react';

import { FileText, Slash } from '../../icons/__generated';
import { CSS } from '../../stitches.config';
import { Button, Box, Flex, Text } from '../../ui';
import useMobileDetect from 'hooks/useMobileDetect';

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
}) => {
  // hover indicates that the row is currently hovered; this is needed to show/hide buttons and change their style
  const [hover, setHover] = useState(docExample);

  // noteComplete indicates that this member has a note
  const noteComplete = gift.note && gift.note.length > 0;
  const { isMobile } = useMobileDetect();
  const newRef = useRef<HTMLButtonElement>(null);
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
    <Button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setSelectedMember(member)}
      color="transparent"
      css={{ p: 0 }}
      ref={newRef}
    >
      <GiveRowGrid selected={(selected || docExample) ?? false} css={css}>
        <AvatarAndName name={member.name} avatar={member.profile.avatar} />
        <Flex
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'space-between',
            gap: '$lg',
            '@sm': {
              gridTemplateColumns: '1fr',
              gap: 0,
              justifyItems: 'center',
              mt: '$md',
            },
          }}
        >
          <Flex
            css={{
              minWidth: 0,
            }}
            alignItems="center"
          >
            {!isMobile && (
              <ContributorButton
                css={{
                  '&:hover': { transition: 'visibility 0.1s ease-in' },
                  visibility: hover || member.teammate ? 'visible' : 'hidden',
                }}
                member={member}
                updateTeammate={updateTeammate}
              />
            )}
          </Flex>
          {!docExample && (
            <Flex
              css={{
                minWidth: 0,
              }}
              alignItems="center"
            >
              <Box>
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
              </Box>
            </Flex>
          )}
        </Flex>
        <Flex
          alignItems="center"
          css={{
            justifyContent: 'flex-end',
            minWidth: 0,
            '@sm': {
              flexDirection: 'column-reverse',
              justifyItems: 'center',
              mt: '$md',
              gap: '$md',
            },
          }}
        >
          <Flex css={{ gap: '$sm' }}>
            {isMobile && (
              <ContributorButton
                css={{
                  '&:hover': { transition: 'visibility 0.1s ease-in' },
                  visibility: hover || member.teammate ? 'visible' : 'hidden',
                }}
                member={member}
                updateTeammate={updateTeammate}
              />
            )}
            {!docExample && (
              <Text
                tag
                css={{
                  mr: '$xl',
                  minWidth: '130px',
                  '@sm': {
                    mr: 0,
                    minWidth: 0,
                    px: '$sm',
                  },
                }}
                color={noteComplete ? 'complete' : 'primary'}
              >
                {noteComplete ? (
                  <>
                    <FileText /> Note Complete
                  </>
                ) : (
                  <>
                    <Slash /> No Feedback
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
      </GiveRowGrid>
    </Button>
  );
};
