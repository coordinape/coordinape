import React, { useCallback, useEffect, useRef, useState } from 'react';

import { updateUser } from 'lib/gql/mutations';
import debounce from 'lodash/debounce';
import { Helmet } from 'react-helmet';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Awaited } from '../../../api-lib/ts4.5shim';
import { LoadingModal, QUERY_KEY_RECEIVE_INFO } from '../../components';
import { useApeSnackbar } from '../../hooks';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { client } from '../../lib/gql/client';
import { epochTimeUpcoming } from '../../lib/time';
import { useSelectedCircle } from '../../recoilState';
import { paths } from '../../routes/paths';
import { IEpoch, IMyUser } from '../../types';
import { Box, Button, Flex, Modal, Panel, Text, Link } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import { getPendingGiftsFrom } from '../AllocationPage/queries';

import { EpochStatementDrawer } from './EpochStatementDrawer';
import { GiveDrawer } from './GiveDrawer';
import { GiveRow } from './GiveRow';
import { MyGiveRow } from './MyGiveRow';
import { getMembersWithContributions, PotentialTeammate } from './queries';
import { SaveState, SavingIndicator } from './SavingIndicator';

export type Gift = Awaited<ReturnType<typeof getPendingGiftsFrom>>[number];

// the amount of time to wait for inactivity to save
const SAVE_BUFFER_PERIOD = 1000;

const GivePage = () => {
  const address = useConnectedAddress();
  const {
    circle: selectedCircle,
    myUser,
    circleEpochsStatus: { currentEpoch, nextEpoch, previousEpoch },
  } = useSelectedCircle();
  const { showError } = useApeSnackbar();

  // members is the circle members that may be filtered down for the list view
  const [members, setMembers] = useState<Member[]>([]);

  // totalGiveUsed is the amount of give used by the current user
  const [totalGiveUsed, setTotalGiveUsed] = useState<number>(0);

  // queryClient is the react-query client, for invalidation purposes
  const queryClient = useQueryClient();

  // gifts is the mapping of userId->Gift that holds the allocations and notes from the current member
  // this is initialized from pendingGifts but then is modified in memory and asynchronously saved to the backend
  const [gifts, setGifts] = useState<{ [key: number]: Gift }>({});

  // This is necessary since saveGifts is fired from a setTimeout and we don't want to snapshot gifts when
  // the closure is created
  const giftsRef = useRef<{ [key: number]: Gift }>({});
  giftsRef.current = gifts;

  // needToSave indicates that there are dirty state changes (notes, allocations) that need to be saved to the backend
  const [saveState, setSaveState] = useState<SaveState>('stable');

  // fetch the available members (w/ contribution aggregate count) and the list of teammates
  const { data, refetch: refetchMembers } = useQuery(
    ['teammates', selectedCircle.id],
    () => {
      if (!currentEpoch) {
        return undefined;
      }
      return getMembersWithContributions(
        selectedCircle.id,
        address as string,
        previousEpoch?.endDate.toJSDate() || new Date(0),
        currentEpoch.endDate.toJSDate()
      );
    },
    {
      enabled: !!(selectedCircle.id && address && currentEpoch),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  // fetch the existing pendingGifts from the backend
  const { data: pendingGiftsFrom, refetch: refetchGifts } = useQuery(
    ['pending-gifts', selectedCircle.id],
    () => getPendingGiftsFrom(selectedCircle.id, address as string),
    {
      enabled: !!(selectedCircle.id && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    // This forces the re-load when GivePage is visited.
    // We aren't reloading when transitioning from map->allocate, for example.
    if (pendingGiftsFrom) {
      refetchGifts().then();
    }
    if (data) {
      refetchMembers().then();
    }
  }, [location]);

  // allUsers is all available users while startingTeammates are those who are already marked as teammates in backend
  const { allUsers, startingTeammates } = data
    ? data
    : { allUsers: undefined, startingTeammates: undefined };

  // updateTeammate updates the teammate flag of a given member
  // this currently relies on a bulk operation so we have to build the whole teammate list
  // this could be improved by adding a new action for flipping one teammate
  const updateTeammate = async (id: number, teammate: boolean) => {
    if (!startingTeammates) {
      // not ready to do this yet
      return;
    }

    const newTeammates = startingTeammates
      // strip this teammate if !teammate
      .filter(t => (t.id == id ? teammate : true))
      .map(t => t.id);

    if (teammate && newTeammates.find(t => t == id) == undefined) {
      // add the new one if its not in there and teammate is set to true
      newTeammates.push(id);
    }

    try {
      // Save this and update the members collection
      await client.mutate({
        updateTeammates: [
          {
            payload: {
              circle_id: selectedCircle.id,
              teammates: newTeammates,
            },
          },
          {
            __typename: true,
          },
        ],
      });
      await queryClient.invalidateQueries(['teammates', selectedCircle.id]);
    } catch (e) {
      showError(e);
    }
  };

  // saveGifts is run asynchronously to save the gifts to the backend
  const saveGifts = async () => {
    // update all the pending gifts
    setSaveState('saving');
    try {
      await client.mutate({
        updateAllocations: [
          {
            payload: {
              circle_id: selectedCircle.id,
              allocations: Object.values(giftsRef.current).map(g => ({
                ...g,
                tokens: g.tokens ?? 0,
                // note is required in the db schema
                note: g.note ?? '',
              })),
            },
          },
          {
            __typename: true,
          },
        ],
      });
    } catch (e) {
      showError(e);
    } finally {
      // errors don't cause us to retry save, this is an area for improvement later,
      // https://github.com/coordinape/coordinape/issues/1400 -g
      setSaveState(prevState => {
        // this is to check if someone scheduled dirty changes while we were saving
        if (prevState == 'scheduled') {
          // need to reschedule, this triggers the useEffect that will reschedule
          return 'buffering';
        }
        return 'saved';
      });
      // Do we need to try again? Error? Something happened while we were saving
    }
  };

  // adjustGift adjusts a gift by an amount if it is allowed wrt the max give, then schedules saving
  const adjustGift = (recipientId: number, amount: number | null) => {
    setGifts(prevState => {
      // check if this takes us over the limit before updating
      const newGifts = { ...prevState };
      const gift = newGifts[recipientId];
      newGifts[recipientId] = {
        note: gift?.note ?? '',
        tokens: amount !== null ? (gift?.tokens ?? 0) + amount : undefined,
        recipient_id: recipientId,
      };

      const afterUpdateTotal = Object.values(newGifts).reduce(
        (total, g) => total + (g.tokens ?? 0),
        0
      );

      if (afterUpdateTotal > myUser.starting_tokens) {
        // too much , so we can't update!
        return prevState;
      }

      return newGifts;
    });
    setNeedToSave(true);
  };

  // updateNote updates the note of a gift and then schedules saving
  const updateNote = (gift: Gift) => {
    setGifts(prevState => {
      // check if this takes us over the limit before updating
      const newGifts = { ...prevState };
      const oldGift = newGifts[gift.recipient_id];
      newGifts[gift.recipient_id] = {
        note: gift?.note ?? '',
        tokens: oldGift?.tokens ?? 0,
        recipient_id: gift.recipient_id,
      };
      return newGifts;
    });

    setNeedToSave(true);
  };

  const setNeedToSave = (save: boolean) => {
    if (save) {
      setSaveState((prevState: SaveState) => {
        // if we are already scheduled, or are currently saving, set to scheduled
        // in the case of already saving, this  causes us to reschedule at the end of the save
        if (prevState == 'scheduled' || prevState == 'saving') {
          return 'scheduled';
        }
        // if we aren't actively saving or already scheduled, move to buffering
        // this triggers a once and only once scheduling
        return 'buffering';
      });
    } else {
      setSaveState('stable');
    }
  };

  useEffect(() => {
    // once we become buffering, we need to schedule
    // this protection of state change in useEffect allows us to fire this only once
    // so requests don't stack up
    if (saveState == 'buffering') {
      setSaveState('scheduled');
      scheduleSave();
    }
  }, [saveState]);

  // only save every 1s , if user increments or edits note, delay 1s
  // this is actually protected by the SaveState state machine and this debounce might not be necessary
  const scheduleSave = useCallback(debounce(saveGifts, SAVE_BUFFER_PERIOD), [
    saveGifts,
  ]);

  // build the actual members list by combining allUsers, pendingGiftsFrom and startingTeammates
  useEffect(() => {
    if (allUsers && startingTeammates && pendingGiftsFrom) {
      const newMembers: Member[] = allUsers.map(u => ({
        ...u,
        give: pendingGiftsFrom.find(g => g.recipient_id == u.id)?.tokens ?? 0,
        note: pendingGiftsFrom.find(g => g.recipient_id == u.id)?.note,
        teammate: startingTeammates.find(t => t.id == u.id) !== undefined,
      }));

      // if we don't have any local gifts yet, initialize them from the pending gifts
      setGifts(prevState =>
        Object.keys(prevState).length > 0
          ? prevState
          : pendingGiftsFrom.reduce<typeof gifts>((map, g) => {
              map[g.recipient_id] = g;
              return map;
            }, {})
      );
      setMembers(newMembers);
    }
  }, [startingTeammates, allUsers, pendingGiftsFrom, selectedCircle]);

  // update the total give used whenever the gifts change
  useEffect(() => {
    setTotalGiveUsed(
      Object.values(gifts).reduce((total, g) => total + (g.tokens ?? 0), 0)
    );
  }, [gifts]);

  // Return here if we don't have the data so that the actual page component can be simpler
  // this means we are planning to show members but we don't have what we need yet
  // if !currentEpoch then there is a simple render that doesn't need this stuff
  if (currentEpoch && (!data || !pendingGiftsFrom)) {
    return <LoadingModal visible={true} />;
  }

  return (
    <Box css={{ width: '100%' }}>
      <Flex
        css={{ background: '$info', justifyContent: 'center', py: '$md' }}
        alignItems="center"
      >
        <Text>Not ready for the new GIVE experience?</Text>
        <Button
          as={Link}
          href={paths.allocation(selectedCircle.id)}
          outlined
          color="primary"
          css={{ ml: '$md' }}
        >
          Go Back
        </Button>
      </Flex>
      <SingleColumnLayout>
        <Helmet>
          <title>Give - {selectedCircle.name} - Coordinape</title>
        </Helmet>
        <Box>
          <Box css={{ mb: '$md' }}>
            <Text h1 semibold inline>
              GIVE
            </Text>
            {currentEpoch && (
              <Text inline h1 normal css={{ ml: '$md' }}>
                Epoch {currentEpoch.number}:{' '}
                {currentEpoch.startDate.toFormat('MMM d')} -{' '}
                {currentEpoch.endDate.toFormat(
                  currentEpoch.endDate.month === currentEpoch.startDate.month
                    ? 'd'
                    : 'MMM d'
                )}
              </Text>
            )}
          </Box>
          <Text css={{ mb: '$md' }}>
            Reward &amp; thank your teammates for their contributions
          </Text>
        </Box>
        {!currentEpoch && (
          <Panel>
            <Text semibold inline>
              Allocations happen during active epochs.{' '}
              {nextEpoch ? (
                <Text inline>
                  Allocation begins in {epochTimeUpcoming(nextEpoch.startDate)}.
                  {nextEpoch.repeat === 1
                    ? ' (repeats weekly)'
                    : nextEpoch.repeat === 2
                    ? ' (repeats monthly)'
                    : ''}
                </Text>
              ) : (
                <Text inline>No upcoming epochs scheduled.</Text>
              )}
            </Text>
          </Panel>
        )}
        {data && pendingGiftsFrom && (
          <AllocateContents
            members={members}
            updateTeammate={updateTeammate}
            gifts={gifts}
            updateNote={updateNote}
            adjustGift={adjustGift}
            saveState={saveState}
            setNeedToSave={setNeedToSave}
            totalGiveUsed={totalGiveUsed}
            myUser={myUser}
            maxedOut={totalGiveUsed >= myUser.starting_tokens}
            currentEpoch={currentEpoch}
          />
        )}
      </SingleColumnLayout>
    </Box>
  );
};

export default GivePage;

type AllocateContentsProps = {
  members: Member[];
  updateTeammate(id: number, teammate: boolean): Promise<void>;
  gifts: Record<string, Gift>;
  updateNote(gift: Gift): void;
  adjustGift(recipientId: number, amount: number): void;
  saveState: SaveState;
  setNeedToSave(save: boolean | undefined): void;
  totalGiveUsed: number;
  myUser: IMyUser;
  maxedOut: boolean;
  currentEpoch?: IEpoch;
};

const AllocateContents = ({
  members,
  updateTeammate,
  gifts,
  updateNote,
  adjustGift,
  saveState,
  setNeedToSave,
  totalGiveUsed,
  myUser,
  maxedOut,
  currentEpoch,
}: AllocateContentsProps) => {
  const { showError, showInfo } = useApeSnackbar();

  // onlyCollaborators is set to true if the view should be filtered to only include collaborators
  // collaborator is the new replacement term for teammate
  const [onlyCollaborators, setOnlyCollaborators] = useState(false);

  // selectedMemberIdx is the user that is currently selected - that is, shown in the drawer
  // this is an index into a snapshot of filteredMembers (membersToIterate)
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(-1);

  // selectedMember is the member that is currently selected, the entry corresponding to membersToIterate[selectedMemberIdx]
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(
    undefined
  );

  // myMember is the current users member in this circle, used for contributionCount
  const myMember = members.find(m => m.id == myUser.id);
  // needed to decouple this piece of state from the hard page reloads tied to
  // fetching the manifest.
  const [userIsOptedOut, setUserIsOptedOut] = useState(myUser.non_receiver);

  const queryClient = useQueryClient();

  const { mutate: updateNonReceiver, isLoading: isNonReceiverMutationLoading } =
    useMutation(
      async (nonReceiver: boolean) =>
        updateUser({
          non_receiver: nonReceiver,
          circle_id: myMember?.circle_id,
        }),
      {
        onSuccess: data => {
          queryClient.invalidateQueries(QUERY_KEY_RECEIVE_INFO);

          if (data) {
            setUserIsOptedOut(data.UserResponse.non_receiver);
          }
        },
        onError: e => {
          console.error(e);
          showError(e);
        },
      }
    );
  // Controls the warning modal for when the user is opting out and
  // already has GIVE allocated to them. This is lifted up here because
  // the opt-out buttons also exist in th EpochStatementDrawer
  const [optOutOpen, setOptOutOpen] = useState(false);

  // track epoch statements between drawer openings
  const [statement, setStatement] = useState(myMember?.bio || '');

  // membersToIterate is initialized as a snapshot of filteredMembers when the drawer is brought up on
  // first set of selectedMemberIdx to non-zero
  const [membersToIterate, setMembersToIterate] = useState<Member[]>([]);

  // filteredMembers is the list of all members filtered down by various criteria, which is currently limited to
  // onlyCollaborator or all members
  const filteredMembers = members
    .filter(m => m.id != myUser.id)
    .filter(m => (onlyCollaborators ? m.teammate : true))
    .sort((a, b) => a.name.localeCompare(b.name));

  // noGivingAllowed is true if the current user is not allowed to give or has 0 tokens
  const noGivingAllowed = myUser.non_giver || myUser.starting_tokens === 0;

  // This is to snapshot the filteredMembers into memberstoIterate so that when the drawer is up
  // we have a stable list of members to iterate, regardless of modifications (like toggling contribution)
  // that may move a member in/out of the list of filtered members.
  useEffect(() => {
    if (selectedMemberIdx == -1) {
      // clean up
      setSelectedMember(undefined);
      setMembersToIterate([]);
    } else if (membersToIterate.length == 0) {
      // we aren't iterating yet, let's snapshot the current filteredMembers so the iteration is nice and predictable
      const mtoi = [...filteredMembers];
      setMembersToIterate(mtoi);
      setSelectedMember(mtoi[selectedMemberIdx]);
    } else {
      // drawer is already open, we are already iterating, just choose the right one
      const m = membersToIterate[selectedMemberIdx];
      setSelectedMember(m);
    }
  }, [selectedMemberIdx]);

  // if the members list changes (e.g. a contributor is removed), we need to update the selectedMember object
  // so that it is reflected in the drawer
  useEffect(() => {
    if (selectedMember) {
      // need to update the selected member object
      setSelectedMember(
        members.find(m => {
          return selectedMember.id === m.id;
        })
      );

      // need to patch up members in the iterate list so we have updated collaborator state etc
      const mtoi = [...membersToIterate];
      for (let i = 0; i < mtoi.length; i++) {
        mtoi[i] = members.find(m => mtoi[i].id === m.id) ?? mtoi[i];
      }
      setMembersToIterate(mtoi);
    }
    if (myMember) setStatement(myMember.bio || '');
  }, [members]);

  // move to the next member in the snapshotted membersToIterate. used by the drawer
  const nextMember = (asc: boolean) => {
    if (asc) {
      setSelectedMemberIdx(prevState => {
        if (prevState < membersToIterate.length - 1) {
          return prevState + 1;
        } else {
          return prevState;
        }
      });
    } else {
      setSelectedMemberIdx(prevState => {
        if (prevState > 0) {
          return prevState - 1;
        } else {
          return prevState;
        }
      });
    }
  };

  // distributeEvenly distributes among currently visible members (filteredMembers) that are available to receive GIVE
  const distributeEvenly = () => {
    const targets = filteredMembers.filter(
      m => !m.fixed_non_receiver && !m.non_receiver
    );
    const remaining = myUser.starting_tokens - totalGiveUsed;
    const perTarget =
      targets.length == 0 ? 0 : Math.floor(remaining / targets.length);
    if (targets.length == 0) {
      showError("You don't have any eligible collaborators to distribute to");
    } else if (perTarget > 0) {
      for (const t of targets) {
        adjustGift(t.id, perTarget);
      }
      showInfo(
        `${perTarget} ${myUser.circle.tokenName} distributed to each of ${targets.length} eligible members`
      );
    } else {
      showError(
        `Not enough ${myUser.circle.tokenName} remaining to distribute evenly`
      );
    }
  };

  return (
    <Box
      css={{
        position: 'relative',
        marginTop: '-$2xl',
        pt: '$2xl',
        pb: '$3xl' /* to make room for help button overlap in bottom right -g */,
      }}
    >
      <Box
        css={{
          display: 'block',
          position: 'sticky',
          top: 0,
          background: '$background',
          zIndex: 3,
          mb: '$md',
          borderRadius: '$3',
          '@sm': { boxShadow: '$shadowBottom' },
        }}
      >
        <Panel
          css={{
            py: '$md',
          }}
        >
          <Flex
            alignItems="center"
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              justifyContent: 'space-between',
              '@sm': { gridTemplateColumns: '1fr' },
            }}
          >
            <Flex
              css={{
                flexGrow: 1,
                gap: '$md',
                '@sm': { flexDirection: 'column', gap: '$sm' },
              }}
              alignItems="center"
            >
              <Box>
                {noGivingAllowed ? (
                  <Text color="neutral" size="large" semibold>
                    You have no GIVE to allocate
                  </Text>
                ) : (
                  <Text color="complete" size="large" semibold>
                    {totalGiveUsed} of {myUser.starting_tokens}{' '}
                    {myUser.circle.tokenName ? myUser.circle.tokenName : 'GIVE'}
                  </Text>
                )}
              </Box>
              <Button
                size="medium"
                color="primary"
                outlined
                disabled={maxedOut || noGivingAllowed}
                onClick={e => {
                  (e.target as HTMLButtonElement).blur();
                  distributeEvenly();
                }}
              >
                Distribute Evenly
              </Button>
              <Flex
                css={{
                  alignItems: 'center',
                  '@sm': { mb: '$sm' },
                }}
              >
                <SavingIndicator saveState={saveState} />
              </Flex>
            </Flex>
            <Flex
              css={{
                flexShrink: 0,
                justifyContent: 'flex-end',
              }}
            >
              <Flex
                css={{
                  '@sm': {
                    flexGrow: '1',
                    mx: '-$md',
                    mb: '-$md',
                  },
                }}
              >
                <Button
                  css={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    '@sm': { borderTopLeftRadius: 0, py: 'calc($sm + $xs)' },
                    flexGrow: '1',
                  }}
                  color={onlyCollaborators ? 'primary' : 'white'}
                  onClick={() => setOnlyCollaborators(true)}
                >
                  Collaborators
                </Button>
                <Button
                  css={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    '@sm': { borderTopRightRadius: 0, py: 'calc($sm + $xs)' },
                    flexGrow: '1',
                  }}
                  color={onlyCollaborators ? 'white' : 'primary'}
                  onClick={() => setOnlyCollaborators(false)}
                >
                  All Members
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Panel>
      </Box>
      <MyGiveRow
        statementCompelete={statement.length > 0 ? true : false}
        optOutOpen={optOutOpen}
        setOptOutOpen={setOptOutOpen}
        userIsOptedOut={userIsOptedOut}
        updateNonReceiver={updateNonReceiver}
        isNonReceiverMutationLoading={isNonReceiverMutationLoading}
        myUser={myUser}
        openEpochStatement={() => setSelectedMember(myMember)}
        contributionCount={
          myMember?.contributions_aggregate?.aggregate?.count ?? 0
        }
      />
      <Panel css={{ gap: '$md', mt: '$md' }}>
        {filteredMembers.length > 0 &&
          filteredMembers.map(member => {
            let gift = gifts[member.id];
            if (!gift) {
              gift = {
                tokens: 0,
                recipient_id: member.id,
              };
            }
            return (
              <GiveRow
                gift={gift}
                key={member.id}
                member={member}
                updateTeammate={updateTeammate}
                adjustGift={adjustGift}
                maxedOut={maxedOut}
                noGivingAllowed={noGivingAllowed}
                setSelectedMember={m =>
                  setSelectedMemberIdx(
                    filteredMembers.findIndex(member => member.id == m.id)
                  )
                }
                selected={
                  selectedMember !== undefined &&
                  selectedMember.id === member.id
                }
              />
            );
          })}
      </Panel>

      {}
      <Modal
        css={{
          paddingBottom: 0,
          paddingLeft: '$lg',
          paddingRight: '$lg',
          paddingTop: 0,
          overflowY: 'scroll',
        }}
        onOpenChange={() => {
          setSelectedMemberIdx(-1);
          setSelectedMember(undefined);
        }}
        drawer
        open={
          selectedMemberIdx != -1 ||
          (myMember !== undefined && selectedMember === myMember)
        }
      >
        {selectedMember && selectedMember === myMember && currentEpoch && (
          <>
            <EpochStatementDrawer
              myUser={myUser}
              member={myMember}
              setOptOutOpen={setOptOutOpen}
              userIsOptedOut={userIsOptedOut}
              updateNonReceiver={updateNonReceiver}
              isNonReceiverMutationLoading={isNonReceiverMutationLoading}
              start_date={currentEpoch.startDate.toJSDate()}
              end_date={currentEpoch.endDate.toJSDate()}
              statement={statement}
              setStatement={setStatement}
            />
          </>
        )}
        {selectedMember && selectedMember !== myMember && currentEpoch && (
          <GiveDrawer
            nextMember={nextMember}
            selectedMemberIdx={selectedMemberIdx}
            totalMembers={membersToIterate.length}
            member={selectedMember}
            updateNote={updateNote}
            adjustGift={adjustGift}
            gift={
              gifts[selectedMember.id] ?? {
                tokens: 0,
                recipient_id: selectedMember.id,
              }
            }
            maxedOut={maxedOut}
            start_date={currentEpoch.startDate.toJSDate()}
            end_date={currentEpoch.endDate.toJSDate()}
            saveState={saveState}
            setNeedToSave={setNeedToSave}
            noGivingAllowed={noGivingAllowed}
            updateTeammate={updateTeammate}
          />
        )}
      </Modal>
    </Box>
  );
};

export type Member = PotentialTeammate & {
  teammate: boolean;
};
