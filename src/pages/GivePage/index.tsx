import React, { useEffect, useRef, useState } from 'react';

import { Helmet } from 'react-helmet';
import { useQuery, useQueryClient } from 'react-query';

import { Awaited } from '../../../api-lib/ts4.5shim';
import { LoadingModal } from '../../components';
import { useApeSnackbar } from '../../hooks';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { client } from '../../lib/gql/client';
import { epochTimeUpcoming } from '../../lib/time';
import { useSelectedCircle } from '../../recoilState';
import { IEpoch, IMyUser } from '../../types';
import { Box, Button, Flex, Modal, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import { getPendingGiftsFrom } from '../AllocationPage/queries';

import { GiveDrawer } from './GiveDrawer';
import { GiveRow } from './GiveRow';
import { MyGiveRow } from './MyGiveRow';
import { getMembersWithContributions, PotentialTeammate } from './queries';
import { SavingIndicator } from './SavingIndicator';

export type Gift = Awaited<ReturnType<typeof getPendingGiftsFrom>>[number];

// the amount of time to wait for inactivity to save
const SAVE_BUFFER_PERIOD = 1000;

const GivePage = () => {
  const address = useConnectedAddress();
  const {
    circle: selectedCircle,
    myUser,
    circleEpochsStatus: { currentEpoch, nextEpoch },
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
  const [needToSave, setNeedToSave] = useState<boolean | undefined>(undefined);

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
        currentEpoch.startDate.toJSDate(),
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
    // save on nav?
    if (needToSave) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      saveGifts().then();
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
    if (!selectedCircle.team_selection) {
      // cannot update teammate status because team_selection is not allowed on this circle
      return;
    }
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
    try {
      await client.mutate({
        updateAllocations: [
          {
            payload: {
              circle_id: selectedCircle.id,
              allocations: Object.values(giftsRef.current).map(g => ({
                ...g,
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
      setNeedToSave(false);
    }
  };

  // adjustGift adjusts a gift by an amount if it is allowed wrt the max give, then schedules saving
  const adjustGift = (recipientId: number, amount: number) => {
    const updated = false;
    setGifts(prevState => {
      // check if this takes us over the limit before updating
      const newGifts = { ...prevState };
      const gift = newGifts[recipientId];
      newGifts[recipientId] = {
        note: gift?.note ?? '',
        tokens: (gift?.tokens ?? 0) + amount,
        recipient_id: recipientId,
      };
      const afterUpdateTotal = Object.values(newGifts).reduce(
        (total, g) => total + g.tokens,
        0
      );

      if (afterUpdateTotal > myUser.starting_tokens) {
        // too much , so we can't update!
        return prevState;
      }

      setNeedToSave(true);
      scheduleSave();
      return newGifts;
    });

    return updated;
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
    scheduleSave();
  };

  // saveTimeout is the handle to the scheduled save in progress
  const [saveTimeout, setSaveTimeout] =
    useState<ReturnType<typeof setTimeout>>();

  // scheduleSave clears any existing pending save and schedules a new one
  const scheduleSave = () => {
    // we need to save, lets do it
    // if we have a timer, lets cancel it and reschedule, keep pushing it out if the user is active?
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    // only save every 1s , if user increments or edits note, delay 1s
    setSaveTimeout(setTimeout(saveGifts, SAVE_BUFFER_PERIOD));
  };

  // build the actual members list by combining allUsers, pendingGiftsFrom and startingTeammates
  useEffect(() => {
    if (allUsers && startingTeammates && pendingGiftsFrom) {
      const newMembers: Member[] = allUsers.map(u => ({
        ...u,
        give: pendingGiftsFrom.find(g => g.recipient_id == u.id)?.tokens ?? 0,
        note: pendingGiftsFrom.find(g => g.recipient_id == u.id)?.note,
        teammate: !selectedCircle.team_selection
          ? true
          : startingTeammates.find(t => t.id == u.id) !== undefined,
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
      Object.values(gifts).reduce((total, g) => total + g.tokens, 0)
    );
  }, [gifts]);

  // Return here if we don't have the data so that the actual page component can be simpler
  // this means we are planning to show members but we don't have what we need yet
  // if !currentEpoch then there is a simple render that doesn't need this stuff
  if (currentEpoch && (!data || !pendingGiftsFrom)) {
    return <LoadingModal visible={true} />;
  }

  return (
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
          needToSave={needToSave}
          setNeedToSave={setNeedToSave}
          teamSelection={selectedCircle.team_selection}
          totalGiveUsed={totalGiveUsed}
          myUser={myUser}
          maxedOut={totalGiveUsed >= myUser.starting_tokens}
          currentEpoch={currentEpoch}
        />
      )}
    </SingleColumnLayout>
  );
};

export default GivePage;

type AllocateContentsProps = {
  members: Member[];
  updateTeammate(id: number, teammate: boolean): Promise<void>;
  gifts: Record<string, Gift>;
  updateNote(gift: Gift): void;
  adjustGift(recipientId: number, amount: number): void;
  needToSave: boolean | undefined;
  setNeedToSave(save: boolean | undefined): void;
  teamSelection: boolean;
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
  needToSave,
  setNeedToSave,
  teamSelection,
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

  // membersToIterate is initialized as a snapshot of filteredMembers when the drawer is brought up on
  // first set of selectedMemberIdx to non-zero
  const [membersToIterate, setMembersToIterate] = useState<Member[]>([]);

  // filteredMembers is the list of all members filtered down by various criteria, which is currently limited to
  // onlyCollaborator or all members
  const filteredMembers = members
    .filter(m => (onlyCollaborators ? m.teammate : true))
    .sort((a, b) => a.name.localeCompare(b.name));

  // noGivingAllowed is true if the current user is not allowed to give or has 0 tokens
  const noGivingAllowed = myUser.non_giver || myUser.starting_tokens === 0;

  // exampleHelpMember is an example member that is used for help when there are no collaborators and the user
  // chooses the onlyCollaborators view
  const exampleHelpMember: Member = {
    id: -300,
    fixed_non_receiver: true,
    non_receiver: true,
    teammate: false,
    circle_id: -1,
    contributions_aggregate: {
      aggregate: {
        count: 9,
      },
    },
    name: 'Friendo',
    profile: {
      id: -301,
    },
  };

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

      // also need to patch it up in the membersToIterate list so we have updated collaborator state etc
      const mtoi = [...membersToIterate];
      for (let i = 0; i < mtoi.length; i++) {
        if (mtoi[i].id === selectedMember.id) {
          mtoi[i] = members.find(m => selectedMember.id === m.id) ?? mtoi[i];
        }
      }
      setMembersToIterate(mtoi);
    }
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

  // distributeEvenly distributes among collaborators
  const distributeEvenly = () => {
    const targets = members
      .filter(m => m.teammate)
      .filter(m => !m.fixed_non_receiver && !m.non_receiver);
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
        `${perTarget} ${myUser.circle.tokenName} distributed to each of ${targets.length} eligible collaborators`
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
              gap: '$lg',
              '@sm': { gridTemplateColumns: '1fr' },
            }}
          >
            <Flex css={{ flexGrow: 1 }} alignItems="center">
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
                css={{ ml: '$md' }}
                onClick={e => {
                  (e.target as HTMLButtonElement).blur();
                  distributeEvenly();
                }}
              >
                Distribute Evenly
              </Button>
              <Flex
                css={{
                  ml: '$md',
                  alignItems: 'center',
                }}
              >
                <SavingIndicator needToSave={needToSave} />
              </Flex>
            </Flex>
            <Flex css={{ flexShrink: 0, justifyContent: 'flex-end' }}>
              {teamSelection && (
                <Flex>
                  <Button
                    css={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
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
                    }}
                    color={onlyCollaborators ? 'white' : 'primary'}
                    onClick={() => setOnlyCollaborators(false)}
                  >
                    All Members
                  </Button>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Panel>
      </Box>

      <Panel css={{ gap: '$md' }}>
        <MyGiveRow myUser={myUser} />
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
                teamSelection={teamSelection}
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

      {filteredMembers.length == 0 && (
        <Box>
          <Flex css={{ justifyContent: 'center', py: '$3xl' }}>
            <Text
              inline
              css={{ textAlign: 'center' }}
              color="secondary"
              h3
              semibold
            >
              {onlyCollaborators
                ? "You don't have any collaborators yet."
                : 'No members in this circle.'}
            </Text>
          </Flex>
          <Flex css={{ justifyContent: 'center' }}>
            <Box
              css={{
                position: 'relative',
                width: '80%',
                '@md': {
                  width: '90%',
                },
              }}
            >
              <Box css={{ zIndex: 1, width: '100%' }}>
                {/* this is an example for documentation not a real allocation row*/}
                <GiveRow
                  member={exampleHelpMember}
                  updateTeammate={async () => {}}
                  adjustGift={() => {}}
                  gift={{
                    tokens: 0,
                    recipient_id: -300,
                  }}
                  teamSelection={true}
                  maxedOut={false}
                  setSelectedMember={() => {}}
                  noGivingAllowed={true}
                  docExample={true}
                  selected={false}
                />
                <Flex css={{ justifyContent: 'center', pt: '$lg' }}>
                  <Text css={{ width: '15em' }}>
                    To add collaborators select a member and add them as a
                    collaborator.
                  </Text>
                </Flex>
              </Box>
              <Box
                css={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  zIndex: 2,
                }}
              ></Box>
            </Box>
          </Flex>
        </Box>
      )}

      <Modal
        css={{
          paddingBottom: 0,
          paddingLeft: '$lg',
          paddingRight: '$lg',
          paddingTop: 0,
          overflowY: 'scroll',
        }}
        onClose={() => setSelectedMemberIdx(-1)}
        drawer
        open={selectedMemberIdx != -1}
      >
        {selectedMember && currentEpoch && (
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
            needToSave={needToSave}
            setNeedToSave={setNeedToSave}
            noGivingAllowed={noGivingAllowed}
            updateTeammate={updateTeammate}
            teamSelection={teamSelection}
          />
        )}
      </Modal>
    </Box>
  );
};

export type Member = PotentialTeammate & {
  teammate: boolean;
};
