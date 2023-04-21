import { useEffect, useState } from 'react';

import { ActivityList } from 'features/activities/ActivityList';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContributions } from 'hooks/useContributions';
import {
  ChevronDown,
  ChevronsRight,
  ChevronUp,
  DeworkColor,
  WonderColor,
} from 'icons/__generated';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  TextArea,
  MarkdownPreview,
  Panel,
} from 'ui';
import { SaveState, SavingIndicator } from 'ui/SavingIndicator';

import { ContributorButton } from './ContributorButton';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from './EpochStatementDrawer';
import { GiveAllocator } from './GiveAllocator';
import { Gift, Member } from './index';
import { getContributionsForEpoch } from './queries';

type GiveDrawerProps = {
  adjustGift(recipientId: number, amount: number): void;
  circleId: number;
  closeDrawer: () => void;
  end_date: Date;
  gift: Gift;
  maxedOut: boolean;
  member: Member;
  nextMember(asc: boolean): void;
  noGivingAllowed: boolean;
  saveState: SaveState;
  selectedMemberIdx: number;
  setNeedToSave(save: boolean): void;
  start_date: Date;
  totalMembers: number;
  updateNote(gift: Gift): void;
  updateTeammate(id: number, teammate: boolean): void;
};
const contributionIcon = (source: string) => {
  switch (source) {
    case 'wonder':
      return <WonderColor css={{ mr: '$md' }} />;
    default:
      return <DeworkColor css={{ mr: '$md' }} />;
  }
};
// GiveDrawer is the focused modal drawer to give/note/view contributions for one member
export const GiveDrawer = ({
  adjustGift,
  circleId,
  closeDrawer,
  end_date,
  gift,
  maxedOut,
  member,
  nextMember,
  noGivingAllowed,
  saveState,
  selectedMemberIdx,
  setNeedToSave,
  start_date,
  totalMembers,
  updateNote,
  updateTeammate,
}: GiveDrawerProps) => {
  // fetch the contributions for this particular member
  const { data: contributions, refetch } = useQuery(
    [QUERY_KEY_ALLOCATE_CONTRIBUTIONS, member.id],
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
  const integrationContributions = useContributions({
    address: member.address || '',
    startDate: start_date.toISOString(),
    endDate: end_date.toISOString(),
    circleId,
    mock: false,
  });

  const [showMarkdown, setShowMarkDown] = useState<boolean>(true);

  // note is the current state of the note
  const [note, setNote] = useState(gift.note);

  // update the note in the to level page state
  const saveNote = (gift: Gift, note?: string) => {
    updateNote({ ...gift, note: note });
  };

  // noteChanged schedules a save to the underlying state in the parent component, clearing any pending save
  const noteChanged = (newNote: string) => {
    setNote(newNote);
    saveNote({ ...gift }, newNote);
  };

  useEffect(() => {
    if (member) {
      // on member change reload the contributions
      refetch().then();
      // reset the need to save indicator so it doesnt say 'Changes Saved' when
      // it has already moved to 'Saved'.
      if (saveState == 'saved') {
        setNeedToSave(false);
      }
    }

    if (showMarkdown && (!note || note.length === 0)) {
      setShowMarkDown(false);
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
    <Panel ghost key={selectedMemberIdx} css={{ height: '100%' }}>
      <Flex
        css={{
          justifyContent: 'space-between',
        }}
      >
        <Flex>
          <Button
            onClick={() => {
              closeDrawer();
            }}
            color="textOnly"
            noPadding
            css={{ mr: '$lg' }}
          >
            <ChevronsRight size="lg" />
          </Button>
          <Button
            color="dim"
            css={nextPrevCss}
            disabled={selectedMemberIdx == 0}
            onClick={() => nextMember(false)}
          >
            <ChevronUp size="lg" />
          </Button>
          <Button
            color="dim"
            css={nextPrevCss}
            disabled={selectedMemberIdx == totalMembers - 1}
            onClick={() => nextMember(true)}
          >
            <ChevronDown size="lg" />
          </Button>
        </Flex>
        <ContributorButton member={member} updateTeammate={updateTeammate} />
      </Flex>
      <Flex
        css={{
          pt: '$xl',
          gap: '$md',
          '@sm': {
            flexDirection: 'column',
          },
        }}
      >
        <Flex
          css={{
            flexGrow: 1,
            minWidth: 0,
          }}
          alignItems="center"
        >
          <Avatar
            size="small"
            name={member.profile.name}
            path={member.profile.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Text ellipsis large semibold>
            {member.profile.name}
          </Text>
        </Flex>
        <Flex
          css={{
            justifyContent: 'space-between',
            gap: '$md',
            '@sm': {
              flexDirection: 'column-reverse',
              alignItems: 'flex-start',
            },
          }}
          alignItems="center"
        >
          <Flex
            css={{
              justifyContent: 'flex-end',
              gap: '$md',
              '@sm': { flexDirection: 'row-reverse' },
            }}
          >
            <SavingIndicator
              css={{ mr: '$md' }}
              saveState={saveState}
              retry={() => {
                saveNote({ ...gift }, note);
              }}
            />
            <Flex>
              <GiveAllocator
                small
                disabled={noGivingAllowed}
                adjustGift={adjustGift}
                gift={gift}
                maxedOut={maxedOut}
                optedOut={member.non_receiver || member.fixed_non_receiver}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Box css={{ mt: '$xl' }}>
        <Box>
          <Text inline semibold size="large" css={{ mr: '$xs' }}>
            Leave a Note
          </Text>
          {/*<InfoTooltip>*/}
          {/*  Want to leave better feedback? Check out Coordinape&apos;s Guide to*/}
          {/*  Giving Feedback in Web3 */}
          {/*</InfoTooltip>*/}
        </Box>
        {showMarkdown ? (
          <Box
            tabIndex={0}
            css={{ borderRadius: '$3', mt: '$sm' }}
            onClick={() => {
              setShowMarkDown(false);
            }}
            onKeyDown={e => {
              e.stopPropagation();
              if (e.key === 'Enter' || e.key === ' ') {
                setShowMarkDown(false);
              }
            }}
          >
            <MarkdownPreview source={note} />
          </Box>
        ) : (
          <Box css={{ position: 'relative' }}>
            <TextArea
              data-testid="note"
              autoSize
              css={{
                width: '100%',
                mt: '$xs',
                mb: '$md',
                pb: '$xl',
                fontSize: '$medium',
                resize: 'vertical',
                minHeight: 'calc($2xl * 2)',
              }}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
              value={note ?? ''}
              onChange={e => noteChanged(e.target.value)}
              onBlur={() => {
                if (note && note?.length > 0) setShowMarkDown(true);
              }}
              onFocus={e => {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                );
              }}
              placeholder="Say thanks or give constructive feedback."
            />
            <Text
              inline
              size="small"
              color="secondary"
              css={{
                position: 'absolute',
                right: '$sm',
                bottom: '$sm',
              }}
            >
              Markdown Supported
            </Text>
          </Box>
        )}

        <Flex css={{ justifyContent: 'flex-end', mt: '$md' }}>
          <Button
            color="primary"
            disabled={selectedMemberIdx == totalMembers - 1}
            onClick={() => nextMember(true)}
            // adding onMouseDown because the onBlur event on the markdown-ready textarea was preventing onClick
            onMouseDown={() => nextMember(true)}
          >
            Next
          </Button>
        </Flex>
      </Box>

      <Flex
        column
        css={{
          borderTop: '1px solid $border',
          mt: '$lg',
          pt: '$lg',
          gap: '$md',
        }}
      >
        {member.bio && (
          <Box>
            <Text semibold size="large">
              {member.profile.name === 'Coordinape'
                ? 'Why Give?'
                : 'Epoch Statement'}
            </Text>
            <Box
              css={{
                mb: '$xs',
                p: '$md $sm',
                borderBottom: '1px solid $border',
              }}
            >
              <MarkdownPreview display source={member.bio} />
            </Box>
          </Box>
        )}
        <Flex column>
          <Text semibold size="large">
            Contributions
          </Text>
          <Box css={{ p: '$md 0' }}>
            {!contributions && <LoadingIndicator />}
            {contributions &&
              (contributions.length === 0 &&
              (!integrationContributions ||
                integrationContributions?.length === 0) ? (
                <>
                  <Box>
                    <Text inline color="neutral">
                      <Text semibold inline color="neutral">
                        {member.profile.name}{' '}
                      </Text>
                      has no contributions recorded for this epoch
                    </Text>
                  </Box>
                </>
              ) : (
                <ActivityList
                  drawer
                  queryKey={['give-contributions', member.profile.id]}
                  where={{
                    _and: [
                      { action: { _eq: 'contributions_insert' } },
                      { actor_profile_id: { _eq: member.profile.id } },
                      { circle_id: { _eq: member.circle_id } },
                      { created_at: { _gt: start_date.toISOString() } },
                    ],
                  }}
                />
              ))}
            <Box css={{ mt: '-$md' }}>
              {integrationContributions &&
                integrationContributions.length > 0 &&
                integrationContributions.map(c => (
                  <Box key={c.link} css={{ pb: '$md' }}>
                    <Text
                      ellipsis
                      css={{
                        cursor: 'default',
                        backgroundColor: '$dim',
                        minHeight: 0,
                        borderRadius: '$1',
                        p: '$md',
                      }}
                    >
                      {contributionIcon(c.source)}
                      {c.title}
                    </Text>
                  </Box>
                ))}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Panel>
  );
};
