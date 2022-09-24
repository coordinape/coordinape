import React, { useState } from 'react';

import { FileText, Slash } from '../../icons/__generated';
import { CSS } from '../../stitches.config';
import { Box, Button, Flex, Panel, Text } from '../../ui';

import { AvatarAndName } from './AvatarAndName';
import { ContributorButton } from './ContributorButton';
import { GiveAllocator } from './GiveAllocator';
import { Gift, Member } from './index';

// GiveRow is a row for one member in the give page
export const GiveRow = ({
  member,
  updateTeammate,
  gift,
  adjustGift,
  teamSelection,
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
  teamSelection: boolean;
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

  return (
    <Panel
      nested
      css={{
        ...css,
        padding: 0,
        pr: '$md',
        border: '2px solid transparent',
        cursor: 'pointer',
        background: docExample || selected ? '$highlight' : undefined,
        borderColor: docExample || selected ? '$link' : undefined,
        '&:hover': {
          background: '$highlight',
          borderColor: '$link',
        },
        '@sm': {
          pb: '$sm',
        },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setSelectedMember(member)}
    >
      <Flex
        alignItems="center"
        css={{
          display: 'grid',
          gridTemplateColumns: '2fr 4fr 4fr',
          justifyContent: 'space-between',
          gap: '$lg',
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        <AvatarAndName name={member.name} avatar={member.profile.avatar} />
        <Flex
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'space-between',
            gap: '$lg',
          }}
        >
          <Flex
            css={{
              minWidth: 0,
            }}
            alignItems="center"
          >
            {teamSelection && (hover || member.teammate) && (
              <ContributorButton
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
                    <Text variant="label">
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
          }}
        >
          {!docExample && (
            <Button
              size="small"
              css={{ mr: '$xl', width: '130px' }}
              color={noteComplete ? 'complete' : 'primary'}
              outlined={noteComplete ? false : true}
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
            </Button>
          )}
          <GiveAllocator
            disabled={noGivingAllowed}
            adjustGift={adjustGift}
            gift={gift}
            maxedOut={maxedOut}
            optedOut={member.non_receiver || member.fixed_non_receiver}
          />
        </Flex>
      </Flex>
    </Panel>
  );
};
