import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';

import { useContributions } from 'hooks/useContributions';
import {
  ChevronDown,
  ChevronsRight,
  ChevronUp,
  Edit,
  DeworkColor,
  WonderColor,
} from 'icons/__generated';
import { Avatar, Box, Button, Flex, Text, TextArea, MarkdownPreview } from 'ui';
import { SaveState, SavingIndicator } from 'ui/SavingIndicator';

import { Contribution } from './Contribution';
import { ContributorButton } from './ContributorButton';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from './EpochStatementDrawer';
import { GiveAllocator } from './GiveAllocator';
import { Gift, Member } from './index';
import { getContributionsForEpoch } from './queries';

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
  saveState: SaveState;
  setNeedToSave(save: boolean): void;
  noGivingAllowed: boolean;
  updateTeammate(id: number, teammate: boolean): void;
  closeDrawer: () => void;
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
  saveState,
  setNeedToSave,
  noGivingAllowed,
  updateTeammate,
  closeDrawer,
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
    <Box key={selectedMemberIdx} css={{ height: '100%' }}>
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
            color="white"
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
            name={member.profile.name ?? member.name}
            path={member.profile.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Text ellipsis h3 semibold>
            {member.profile.name ?? member.name}
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
          <Flex css={{ justifyContent: 'flex-end' }}>
            <SavingIndicator
              css={{ mr: '$md' }}
              saveState={saveState}
              retry={() => {
                saveNote({ ...gift }, note);
              }}
            />
            <Flex css={{ '*': { minWidth: 0 } }}>
              <GiveAllocator
                disabled={noGivingAllowed}
                adjustGift={adjustGift}
                gift={gift}
                inPanel={true}
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
          {/*<ApeInfoTooltip>*/}
          {/*  Want to leave better feedback? Check out Coordinape’s Guide to*/}
          {/*  Giving Feedback in Web3*/}
          {/*</ApeInfoTooltip>*/}
        </Box>
        {showMarkdown ? (
          <Box
            tabIndex={0}
            css={{ borderRadius: '$3' }}
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
                backgroundColor: 'white',
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
            <Edit />
            Next
          </Button>
        </Flex>
      </Box>

      <Flex
        column
        css={{
          borderTop: '0.5px solid $secondaryText',
          mt: '$lg',
          pt: '$lg',
          gap: '$md',
        }}
      >
        {member.bio && (
          <Box>
            <Text semibold size="large">
              Epoch Statement
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
          <Box css={{ p: '$md $sm' }}>
            {!contributions && (
              // TODO: Better loading indicator here -g
              <Box>Loading...</Box>
            )}
            {contributions &&
              (contributions.length === 0 &&
              (!integrationContributions ||
                integrationContributions?.length === 0) ? (
                <>
                  <Box>
                    <Text inline color="neutral">
                      <Text semibold inline color="neutral">
                        {member.profile.name ?? member.name}{' '}
                      </Text>
                      has no contributions recorded for this epoch
                    </Text>
                  </Box>
                </>
              ) : (
                contributions.map(c => (
                  <Contribution key={c.id} contribution={c} />
                ))
              ))}
            {integrationContributions &&
              integrationContributions.length > 0 &&
              integrationContributions.map(c => (
                <Box
                  key={c.link}
                  css={{
                    p: '$md $sm',
                    borderBottom: '1px solid $border',
                  }}
                >
                  <Text
                    ellipsis
                    css={{
                      cursor: 'default',
                      backgroundColor: 'rgb(225 229 232) !important',
                      borderColor: '$borderMedium !important',
                      boxShadow: '$shadow1',
                      border: '1px solid transparent',
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
        </Flex>
      </Flex>
    </Box>
  );
};
