import React, { useEffect, useState } from 'react';

import { useQuery } from 'react-query';

import { ChevronDown, ChevronUp } from '../../icons/__generated';
import { Avatar, Box, Button, Flex, Panel, Text, TextArea } from '../../ui';

import { Contribution } from './Contribution';
import { ContributorButton } from './ContributorButton';
import { GiveAllocator } from './GiveAllocator';
import { Gift, Member } from './index';
import { getContributionsForEpoch } from './queries';
import { SavingIndicator } from './SavingIndicator';

type GiveDrawerProps = {
  member: Member;
  gift: Gift;
  updateNote(gift: Gift): void;
  adjustGift(recipientId: number, amount: number): void;
  maxedOut: boolean;
  start_date: Date;
  end_date: Date;
  selectedMemberIdx: number;
  totalMembers: number;
  nextMember(asc: boolean): void;
  needToSave: boolean | undefined;
  setNeedToSave(save: boolean | undefined): void;
  noGivingAllowed: boolean;
  updateTeammate(id: number, teammate: boolean): void;
};

// GiveDrawer is the focused modal drawer to give/note/view contributions for one member
export const GiveDrawer = ({
  // show,
  member,
  gift,
  updateNote,
  adjustGift,
  maxedOut,
  start_date,
  end_date,
  selectedMemberIdx,
  totalMembers,
  nextMember,
  needToSave,
  setNeedToSave,
  noGivingAllowed,
  updateTeammate,
}: GiveDrawerProps) => {
  // fetch the contributions for this particular member
  const { data: contributions, refetch } = useQuery(
    ['allocate-contributions', member.id],
    () =>
      getContributionsForEpoch({
        circleId: member.circle_id,
        userId: member.id,
        start_date,
        end_date,
      }),
    {
      enabled: !!member,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  // note is the current state of the note
  const [note, setNote] = useState(gift.note);

  // saveTimeout is the timeout handle for the buffered async saving
  const [saveTimeout, setSaveTimeout] =
    useState<ReturnType<typeof setTimeout>>();

  // update the note in the to level page state
  const saveNote = (gift: Gift, note?: string) => {
    updateNote({ ...gift, note: note });
  };

  // noteChanged schedules a save to the underlying state in the parent component, clearing any pending save
  const noteChanged = (newNote: string) => {
    setNote(newNote);
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    // only save every 1s , if user increments or edits note, delay 1s
    setSaveTimeout(setTimeout(() => saveNote({ ...gift }, newNote), 1000));
  };

  useEffect(() => {
    if (member) {
      // on member change reload the contributions
      refetch().then();
      // reset the need to save indicator so it doesnt say 'Changes Saved'
      setNeedToSave(undefined);
    }
  }, [member]);

  useEffect(() => {
    setNote(gift.note);
  }, [gift]);

  const nextPrevCss = {
    color: '$text',
    padding: '0',
    minHeight: '32px',
    height: '32px',
    width: '32px',
    mr: '$sm',
    borderRadius: '$2',
    alignItems: 'center',
    '> svg': {
      mr: 0,
    },
  };

  return (
    <Box key={selectedMemberIdx} css={{ height: '100%', pt: '$md' }}>
      <Flex>
        <Button
          color="white"
          size="large"
          css={nextPrevCss}
          disabled={selectedMemberIdx == 0}
          onClick={() => nextMember(false)}
        >
          <ChevronUp size="lg" />
        </Button>
        <Button
          color="white"
          css={nextPrevCss}
          disabled={selectedMemberIdx == totalMembers - 1}
          onClick={() => nextMember(true)}
        >
          <ChevronDown size="lg" />
        </Button>
      </Flex>
      <Flex
        css={{
          pt: '$xl',
          display: 'grid',
          width: '100%',
          gridTemplateColumns: '1fr',
        }}
      >
        <Flex css={{ flexGrow: 1, minWidth: 0, mb: '$md' }} alignItems="center">
          <Avatar
            size="small"
            name={member.name}
            path={member.profile.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Text ellipsis h3 semibold>
            {selectedMemberIdx}
            {gift.recipient_id}
            {member.name}
          </Text>
        </Flex>
        <Flex
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
          alignItems="center"
        >
          <Flex
            css={{
              justifyContent: 'flex-start',
              mr: '$lg',
              ml: '0',
            }}
          >
            <ContributorButton
              member={member}
              updateTeammate={updateTeammate}
            />
          </Flex>
          <Flex css={{ justifyContent: 'flex-end' }}>
            <Box>
              <GiveAllocator
                disabled={noGivingAllowed}
                adjustGift={adjustGift}
                gift={gift}
                inPanel={true}
                maxedOut={maxedOut}
                optedOut={member.non_receiver || member.fixed_non_receiver}
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Box css={{ mt: '$xl' }}>
        <Box>
          <Text inline semibold size="large" css={{ mr: '$xs' }}>
            Leave a Note
          </Text>
          {/*<ApeInfoTooltip>*/}
          {/*  Want to leave better feedback? Check out Coordinape’s Guide to*/}
          {/*  Giving Feedback in Web3*/}
          {/*</ApeInfoTooltip>*/}
        </Box>
        <TextArea
          css={{
            backgroundColor: 'white',
            width: '100%',
            mt: '$xs',
            mb: '$md',
          }}
          value={note}
          onChange={e => noteChanged(e.target.value)}
          placeholder="Say thanks or give constructive feedback."
        />
        <Flex css={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <SavingIndicator needToSave={needToSave} css={{ mr: '$md' }} />
        </Flex>
      </Box>

      <Box
        css={{
          borderTop: '0.5px solid $secondaryText',
          mt: '$lg',
          pt: '$lg',
        }}
      >
        {member.bio && (
          <Box>
            <Text semibold size="large">
              Epoch Statement
            </Text>
            <Box css={{ mt: '$sm', pb: '$lg' }}>
              <Panel nested css={{ mb: '$md' }}>
                <Text p>{member.bio}</Text>
              </Panel>
            </Box>
          </Box>
        )}
        <Text semibold size="large">
          Contributions
        </Text>
        <Box css={{ pb: '$lg', mt: '$sm' }}>
          {!contributions && (
            // TODO: Better loading indicator here -g
            <Box>Loading...</Box>
          )}
          {contributions &&
            (contributions.length == 0 ? (
              <>
                <Box>
                  <Text inline color="neutral">
                    <Text semibold inline color="neutral">
                      {member.name}{' '}
                    </Text>
                    has no contributions recorded for this epoch
                  </Text>
                </Box>

                <Panel info css={{ mt: '$md' }}>
                  <Text p>
                    Contributions are coming soon! Members will be able to share
                    automatic contributions from integrated apps and journal
                    contributions as they happen.
                  </Text>
                </Panel>
              </>
            ) : (
              contributions.map(c => (
                <Contribution key={c.id} contribution={c} />
              ))
            ))}
        </Box>
      </Box>
    </Box>
  );
};
