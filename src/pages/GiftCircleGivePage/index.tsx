import assert from 'assert';
import { useCallback, useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from 'features/auth';
import { MyUser, useLoginData } from 'features/auth/useLoginData';
import { EpochEndingNotification } from 'features/nav/EpochEndingNotification';
import { updateCircle, updateUser } from 'lib/gql/mutations';
import { isUserAdmin, isUserCoordinape } from 'lib/users';
import debounce from 'lodash-es/debounce';
import maxBy from 'lodash-es/maxBy';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as z from 'zod';

import { Awaited } from '../../../api-lib/ts4.5shim';
import { LoadingModal } from '../../components';
import { useToast } from '../../hooks';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { client } from '../../lib/gql/client';
import { epochTimeUpcoming } from '../../lib/time';
import { SingleColumnLayout } from '../../ui/layouts';
import { FormInputField } from 'components';
import HintBanner from 'components/HintBanner';
import { useContributions } from 'hooks/useContributions';
import { ArrowDown, ArrowUp, Edit3, Grid, Menu } from 'icons/__generated';
import { QUERY_KEY_RECEIVE_INFO } from 'pages/HistoryPage/useReceiveInfo';
import { useCircleIdParam } from 'routes/hooks';
import {
  Box,
  Button,
  ContentHeader,
  Flex,
  Link,
  MarkdownPreview,
  Modal,
  Select,
  Text,
} from 'ui';
import { SaveState, SavingIndicator } from 'ui/SavingIndicator';

import { EpochStatementDrawer } from './EpochStatementDrawer';
import { GiveDrawer } from './GiveDrawer';
import { GiveRow } from './GiveRow';
import { MyGiveRow } from './MyGiveRow';
import {
  getMembersWithContributions,
  getPendingGiftsFrom,
  initialQuery,
  PotentialTeammate,
  QUERY_KEY_GIVE_PAGE,
} from './queries';

export type Gift = Awaited<ReturnType<typeof getPendingGiftsFrom>>[number];

export type ImprovedEpoch = NonNullable<
  Awaited<ReturnType<typeof initialQuery>>
>['epochs'][0] & {
  startDate: DateTime;
  endDate: DateTime;
};

// the amount of time to wait for inactivity to save
const schema = z.object({
  alloc_text: z
    .string()
    .max(500)
    .refine(val => val.trim().length >= 1, {
      message: 'Please write something.',
    }),
});
type allocationTextSchema = z.infer<typeof schema>;
const SAVE_BUFFER_PERIOD = 1000;

const GiftCircleGivePage = () => {
  const circleId = useCircleIdParam();
  const { data: circle } = useQuery(
    [QUERY_KEY_GIVE_PAGE, circleId],
    () => initialQuery(circleId),
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const profile = useLoginData();
  if (!circle || !profile) return <LoadingModal visible note="GivePage" />;

  const myUser = profile.users.find(u => u.circle_id === circle.id);
  assert(myUser);

  return <GivePageInner {...{ circle, myUser }} />;
};

// using inner/outer components here to avoid excessive null-checking
const GivePageInner = ({
  circle,
  myUser,
}: {
  circle: NonNullable<Awaited<ReturnType<typeof initialQuery>>>;
  myUser: MyUser;
}) => {
  const address = useConnectedAddress();
  const profileId = useAuthStore(state => state.profileId);

  const now = DateTime.utc();
  const improvedEpochs = circle.epochs.map(epoch => ({
    ...epoch,
    startDate: DateTime.fromISO(epoch.start_date),
    endDate: DateTime.fromISO(epoch.end_date),
  }));
  const currentEpoch = improvedEpochs.find(
    e => e.startDate < now && e.endDate > now
  );
  const nextEpoch = improvedEpochs.find(e => e.startDate > now);
  const pastEpochs = improvedEpochs.filter(e => e.endDate < now);
  const previousEpoch = maxBy(pastEpochs, 'endDate');

  const contributionRangeStartDate =
    previousEpoch?.endDate.toJSDate() ?? new Date(0);

  const { showError } = useToast();

  // members is the circle members that may be filtered down for the list view
  const [members, setMembers] = useState<Member[]>([]);

  // totalGiveUsed is the amount of give used by the current user
  const [totalGiveUsed, setTotalGiveUsed] = useState<number>(0);
  const [editAllocHelpText, setEditAllocHelpText] = useState(false);
  const [gridView, setGridView] = useState(false);

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
    ['teammates', circle.id],
    () => {
      if (!currentEpoch) {
        return undefined;
      }
      return getMembersWithContributions(
        circle.id,
        profileId as number,
        contributionRangeStartDate,
        currentEpoch.endDate.toJSDate()
      );
    },
    {
      enabled: !!(circle.id && profileId && currentEpoch),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const myIntegrationContributions = useContributions({
    address: address || '',
    startDate: contributionRangeStartDate.toISOString(),
    endDate: currentEpoch?.endDate.toJSDate().toISOString(),
    circleId: circle.id,
    mock: false,
  });

  // fetch the existing pendingGifts from the backend
  //TODO: (cs) set better refetch options rather than stale infinity
  const { data: pendingGiftsFrom, refetch: refetchGifts } = useQuery(
    ['pending-gifts', circle.id],
    () => getPendingGiftsFrom(circle.id, address as string),
    {
      enabled: !!(circle.id && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const [allocText, setAllocText] = useState<string | undefined>();

  useEffect(() => {
    // This forces the re-load when GivePage is visited.
    // We aren't reloading when transitioning from map->allocate, for example.
    if (pendingGiftsFrom) refetchGifts();
    if (data) refetchMembers();
  }, [location]);

  // allUsers is all available users while startingTeammates are those who are already marked as teammates in backend
  const { allUsers, startingTeammates } = data ?? {
    allUsers: undefined,
    startingTeammates: undefined,
  };

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
      await client.mutate(
        {
          updateTeammates: [
            { payload: { circle_id: circle.id, teammates: newTeammates } },
            { __typename: true },
          ],
        },
        { operationName: 'updateTeammate' }
      );
      await queryClient.invalidateQueries(['teammates', circle.id]);
    } catch (e) {
      showError(e);
    }
  };

  // saveGifts is run asynchronously to save the gifts to the backend
  const saveGifts = async () => {
    // update all the pending gifts
    setSaveState('saving');
    try {
      await client.mutate(
        {
          updateAllocations: [
            {
              payload: {
                circle_id: circle.id,
                allocations: Object.values(giftsRef.current).map(g => ({
                  ...g,
                  tokens: g.tokens ?? 0,
                  // note is required in the db schema
                  note: g.note ?? '',
                })),
              },
            },
            { __typename: true },
          ],
        },
        { operationName: 'saveGifts' }
      );
      setSaveState(prevState => {
        // this is to check if someone scheduled dirty changes while we were saving
        if (prevState == 'scheduled') {
          // need to reschedule, this triggers the useEffect that will reschedule
          return 'buffering';
        }
        return 'saved';
      });
    } catch (e) {
      setSaveState('error');
      showError(e);
    }
  };
  const { control: allocationTextControl, handleSubmit } =
    useForm<allocationTextSchema>({
      resolver: zodResolver(schema),
      mode: 'all',
    });

  const onSubmit: SubmitHandler<allocationTextSchema> = async data => {
    try {
      await updateCircle({ circle_id: circle.id, alloc_text: data.alloc_text });
      setAllocText(data.alloc_text);
    } catch (e) {
      showError(e);
      console.warn(e);
    }
    setEditAllocHelpText(false);
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
        // too much, so we can't update!
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
    if (allUsers && startingTeammates) {
      const newMembers: Member[] = allUsers.map(u => ({
        ...u,
        teammate: startingTeammates.find(t => t.id == u.id) !== undefined,
        activity:
          (u.contributions_aggregate.aggregate?.count || 0) +
          u.pending_sent_gifts.length,
      }));

      setMembers(newMembers);
    }
  }, [startingTeammates, allUsers]);

  useEffect(() => {
    if (!pendingGiftsFrom) return;

    // set default donation to Coordinape to 1% (rounded down)
    if (pendingGiftsFrom.length === 0) {
      const grantee = allUsers?.find(isUserCoordinape);
      if (grantee)
        setGifts({
          [grantee.id]: {
            note: '',
            recipient_id: grantee.id,
            tokens: Math.floor(myUser.starting_tokens / 100),
          },
        });

      return;
    }

    // load previously-saved allocations
    setGifts(
      pendingGiftsFrom.reduce<typeof gifts>((map, g) => {
        map[g.recipient_id] = g;
        return map;
      }, {})
    );
  }, [pendingGiftsFrom, allUsers]);

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
      <SingleColumnLayout>
        <Helmet>
          <title>Give - {circle.name} - Coordinape</title>
        </Helmet>
        <ContentHeader>
          <Flex column css={{ gap: '$sm', width: '100%' }}>
            <Flex
              css={{
                gap: '$sm',
                alignItems: 'center',
                '@sm': { flexDirection: 'column' },
              }}
            >
              <Text h1 semibold inline>
                Allocations
              </Text>
              {currentEpoch && (
                <>
                  <Text inline h1 normal css={{ mr: '$xs' }}>
                    {currentEpoch.startDate.toFormat('MMM d')} -{' '}
                    {currentEpoch.endDate.toFormat(
                      currentEpoch.endDate.month ===
                        currentEpoch.startDate.month
                        ? 'd'
                        : 'MMM d'
                    )}
                  </Text>
                  <EpochEndingNotification
                    circleId={circle.id}
                    css={{ gap: '$sm' }}
                    message="Allocations Due"
                    showCountdown
                  />
                </>
              )}
            </Flex>
            {!editAllocHelpText ? (
              <Flex column>
                <MarkdownPreview
                  render
                  source={
                    allocText ??
                    circle?.alloc_text ??
                    'Reward & thank your teammates for their contributions'
                  }
                  css={{ minHeight: '0', cursor: 'auto' }}
                />
                {isUserAdmin(myUser) && (
                  <Link
                    href="#"
                    iconLink
                    onClick={() => {
                      setEditAllocHelpText(true);
                    }}
                    css={{ whiteSpace: 'nowrap' }}
                  >
                    <Edit3 />
                    Edit
                  </Link>
                )}
              </Flex>
            ) : (
              <Flex column css={{ width: '100%' }}>
                <Box css={{ position: 'relative', width: '100%' }}>
                  <FormInputField
                    name="alloc_text"
                    id="finish_work"
                    control={allocationTextControl}
                    defaultValue={circle?.alloc_text}
                    label="Allocation Help Text"
                    placeholder="Default: 'Reward & thank your teammates for their contributions'"
                    infoTooltip="Change the text that contributors see on this page."
                    showFieldErrors
                    textArea
                    css={{
                      width: '100%',
                    }}
                  />
                  <Text
                    inline
                    size="small"
                    color="secondary"
                    css={{ position: 'absolute', right: '$sm', bottom: '$sm' }}
                  >
                    Markdown Supported
                  </Text>
                </Box>
                <Flex css={{ gap: '$sm', mt: '$md' }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                      setEditAllocHelpText(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex css={{ '@sm': { display: 'none' } }}>
            <Button
              css={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                flexGrow: '1',
                fontWeight: gridView ? 'normal' : 'bold',
              }}
              color="neutral"
              outlined={gridView}
              onClick={() => setGridView(false)}
            >
              <Menu />
              Row
            </Button>
            <Button
              css={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                flexGrow: '1',
                fontWeight: gridView ? 'bold' : 'normal',
              }}
              color="neutral"
              outlined={!gridView}
              onClick={() => setGridView(true)}
            >
              <Grid />
              Card
            </Button>
          </Flex>
        </ContentHeader>
        {!currentEpoch && (
          <HintBanner>
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
          </HintBanner>
        )}
        {data && pendingGiftsFrom && (
          <AllocateContents
            maxedOut={totalGiveUsed >= myUser.starting_tokens}
            retrySave={saveGifts}
            previousEpochEndDate={previousEpoch?.endDate}
            allowDistributeEvenly={circle.allow_distribute_evenly}
            tokenName={circle.token_name}
            intContributionsCount={myIntegrationContributions?.length ?? 0}
            circleId={circle.id}
            {...{
              adjustGift,
              currentEpoch,
              gifts,
              gridView,
              members,
              myUser,
              saveState,
              setNeedToSave,
              totalGiveUsed,
              updateNote,
              updateTeammate,
            }}
          />
        )}
      </SingleColumnLayout>
    </Box>
  );
};

export default GiftCircleGivePage;

type AllocateContentsProps = {
  adjustGift(recipientId: number, amount: number): void;
  allowDistributeEvenly?: boolean;
  circleId: number;
  currentEpoch?: ImprovedEpoch;
  gifts: Record<string, Gift>;
  gridView: boolean;
  intContributionsCount: number;
  maxedOut: boolean;
  members: Member[];
  myUser: MyUser;
  previousEpochEndDate?: DateTime;
  retrySave: () => void;
  saveState: SaveState;
  setNeedToSave(save: boolean | undefined): void;
  tokenName: string;
  totalGiveUsed: number;
  updateNote(gift: Gift): void;
  updateTeammate(id: number, teammate: boolean): Promise<void>;
};

const AllocateContents = ({
  adjustGift,
  allowDistributeEvenly,
  circleId,
  currentEpoch,
  gifts,
  gridView,
  intContributionsCount,
  maxedOut,
  members,
  myUser,
  previousEpochEndDate,
  retrySave,
  saveState,
  setNeedToSave,
  tokenName,
  totalGiveUsed,
  updateNote,
  updateTeammate,
}: AllocateContentsProps) => {
  const { showError, showDefault } = useToast();
  const contributionRangeStartDate =
    previousEpochEndDate?.toJSDate() ?? new Date(0);

  // onlyCollaborators is set to true if the view should be filtered to only include collaborators
  // collaborator is the new replacement term for teammate
  const [onlyCollaborators, setOnlyCollaborators] = useState(false);
  const [onlyActiveMembers, setOnlyActiveMembers] = useState(false);

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

  const [sortMethod, setSortMethod] = useState<'Name' | 'Activity'>('Name');
  const [sortDesc, setSortDesc] = useState(true);

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

          if (data?.UserResponse) {
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
    .filter(m =>
      onlyActiveMembers
        ? (m.contributions_aggregate.aggregate &&
            m.contributions_aggregate.aggregate.count > 0) ||
          m.pending_sent_gifts.length > 0
        : true
    )
    .filter(m => (onlyCollaborators ? m.teammate : true))
    .sort((a, b) =>
      sortMethod === 'Name'
        ? a.profile.name.localeCompare(b.profile.name)
        : b.activity - a.activity
    );

  if (!sortDesc) {
    filteredMembers.reverse();
  }

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
    contributions_aggregate: { aggregate: { count: 9 } },
    profile: {
      id: -301,
      name: 'Friendo',
      address: '0x23f24381cf8518c4fafdaeeac5c0f7c92b7ae678',
    },
    pending_sent_gifts: [{ id: 1 }],
    activity: 10,
  };

  // This is to snapshot the filteredMembers into memberstoIterate so that when the drawer is up
  // we have a stable list of members to iterate, regardless of modifications (like toggling contribution)
  // that may move a member in/out of the list of filtered members.
  useEffect(() => {
    if (selectedMemberIdx == -1) {
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
      showDefault(
        `${perTarget} ${tokenName} distributed to each of ${targets.length} eligible members`
      );
    } else {
      showError(`Not enough ${tokenName} remaining to distribute evenly`);
    }
  };

  const closeDrawer = () => {
    setSelectedMemberIdx(-1);
    setSelectedMember(undefined);
  };

  return (
    <Box
      css={{
        position: 'relative',
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
          '@sm': {
            background: '$background',
            pt: '$sm',
            boxShadow: '$shadowBottom',
            top: '-3px',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        }}
      >
        <Box css={{ mb: '$lg' }}>
          <Flex
            alignItems="center"
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              justifyContent: 'space-between',
              '@sm': { gridTemplateColumns: '1fr', gap: '$md' },
            }}
          >
            <Flex
              css={{
                flexGrow: 1,
                flexWrap: 'wrap',
                gap: '$sm',
                '@sm': { flexDirection: 'column' },
              }}
              alignItems="center"
            >
              <Box>
                {noGivingAllowed ? (
                  <Text color="neutral" size="large" semibold>
                    You have no GIVE to allocate
                  </Text>
                ) : (
                  <Text color="cta" size="large" semibold>
                    {totalGiveUsed} of {myUser.starting_tokens} {tokenName}
                  </Text>
                )}
              </Box>
              {allowDistributeEvenly && (
                <Button
                  size="medium"
                  color="primary"
                  disabled={maxedOut || noGivingAllowed}
                  onClick={e => {
                    (e.target as HTMLButtonElement).blur();
                    distributeEvenly();
                  }}
                >
                  Distribute Evenly
                </Button>
              )}
              <Flex alignItems="center" css={{ '@sm': { mb: '$sm' } }}>
                <SavingIndicator saveState={saveState} retry={retrySave} />
              </Flex>
            </Flex>
            <Flex
              css={{
                flexShrink: 0,
                justifyContent: 'flex-end',
                gap: '$md',
                '@sm': {
                  flexDirection: 'column',
                  alignItems: 'center',
                },
              }}
            >
              <Flex css={{ gap: '$xs' }}>
                <Button
                  color="link"
                  css={{
                    color: '$secondaryText !important',
                    textDecoration: 'none',
                  }}
                  onClick={() => setSortDesc(prev => !prev)}
                >
                  {sortDesc ? <ArrowDown /> : <ArrowUp />}
                  <Text variant="label" css={{ pr: '$xs' }}>
                    Sort by
                  </Text>
                </Button>
                <Select
                  placeholder="Sort"
                  options={[
                    { label: 'Name', value: 'Name' },
                    { label: 'Active', value: 'Activity' },
                  ]}
                  css={{ button: { py: 'inherit', borderRadius: '$4' } }}
                  value={sortMethod}
                  onValueChange={value =>
                    setSortMethod(value === 'Activity' ? 'Activity' : 'Name')
                  }
                />
              </Flex>
              <Flex css={{ '@sm': { flexGrow: '1', width: '100%' } }}>
                <Button
                  css={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    fontWeight: onlyActiveMembers ? 'bold' : 'normal',
                    '@sm': { borderTopLeftRadius: 0, py: 'calc($sm + $xs)' },
                    flexGrow: '1',
                  }}
                  color="neutral"
                  outlined={!onlyActiveMembers}
                  onClick={() => {
                    setOnlyActiveMembers(true);
                    setOnlyCollaborators(false);
                  }}
                >
                  Active
                </Button>
                <Button
                  css={{
                    borderRadius: 0,
                    borderLeft: 'none',
                    borderRight: 'none',
                    fontWeight: onlyCollaborators ? 'bold' : 'normal',
                    '@sm': { borderTopLeftRadius: 0, py: 'calc($sm + $xs)' },
                    flexGrow: '1',
                  }}
                  color="neutral"
                  outlined={!onlyCollaborators}
                  onClick={() => {
                    setOnlyActiveMembers(false);
                    setOnlyCollaborators(true);
                  }}
                >
                  Collaborators
                </Button>
                <Button
                  css={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    fontWeight:
                      onlyCollaborators || onlyActiveMembers
                        ? 'normal'
                        : 'bold',
                    '@sm': { borderTopRightRadius: 0, py: 'calc($sm + $xs)' },
                    flexGrow: '1',
                  }}
                  color="neutral"
                  outlined={onlyCollaborators || onlyActiveMembers}
                  onClick={() => {
                    setOnlyActiveMembers(false);
                    setOnlyCollaborators(false);
                  }}
                >
                  All Members
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <MyGiveRow
        statementCompelete={statement.length > 0 ? true : false}
        openEpochStatement={() => setSelectedMember(myMember)}
        contributionCount={
          intContributionsCount +
          (myMember?.contributions_aggregate?.aggregate?.count ?? 0)
        }
        selected={
          selectedMember !== undefined && selectedMember.id === myUser.id
        }
        {...{
          isNonReceiverMutationLoading,
          myUser,
          optOutOpen,
          setOptOutOpen,
          tokenName,
          updateNonReceiver,
          userIsOptedOut,
        }}
      />
      <Box
        css={{
          gap: '$md',
          mt: '$md',
          display: 'grid',
          background: 'transparent',
          p: 0,
          gridTemplateColumns: gridView ? '1fr 1fr 1fr 1fr' : '1fr',
          '@lg': { gridTemplateColumns: gridView ? '1fr 1fr 1fr' : '1fr' },
          '@md': { gridTemplateColumns: gridView ? '1fr 1fr' : '1fr' },
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        {filteredMembers.length > 0 &&
          filteredMembers.map(member => {
            return (
              <GiveRow
                gift={
                  gifts[member.id] || { tokens: 0, recipient_id: member.id }
                }
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
                gridView={gridView}
                startDate={contributionRangeStartDate}
                endDate={currentEpoch?.endDate.toJSDate()}
              />
            );
          })}
      </Box>

      {filteredMembers.length == 0 && (
        <Box>
          <Flex css={{ justifyContent: 'center', py: '$3xl' }}>
            <Text
              inline
              css={{ textAlign: 'center' }}
              color="secondary"
              large
              semibold
            >
              {onlyCollaborators
                ? "You don't have any collaborators yet."
                : onlyActiveMembers
                  ? 'No members have allocated or made contributions.'
                  : 'No members in this circle.'}
            </Text>
          </Flex>
          <Flex css={{ justifyContent: 'center' }}>
            <Box
              css={{
                position: 'relative',
                width: '80%',
                '@md': { width: '90%' },
              }}
            >
              <Box css={{ zIndex: 1, width: '100%' }}>
                {/* this is an example for documentation not a real allocation row*/}
                <GiveRow
                  member={exampleHelpMember}
                  updateTeammate={async () => {}}
                  adjustGift={() => {}}
                  gift={{ tokens: 0, recipient_id: -300 }}
                  maxedOut={false}
                  setSelectedMember={() => {}}
                  noGivingAllowed={true}
                  docExample={true}
                  selected={false}
                  gridView={false}
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
        onOpenChange={closeDrawer}
        showClose={false}
        drawer
        open={
          selectedMemberIdx != -1 ||
          (myMember !== undefined && selectedMember === myMember)
        }
      >
        {selectedMember && selectedMember === myMember && currentEpoch && (
          <EpochStatementDrawer
            start_date={contributionRangeStartDate}
            end_date={currentEpoch.endDate.toJSDate()}
            member={myMember}
            {...{
              circleId,
              closeDrawer,
              isNonReceiverMutationLoading,
              myUser,
              setOptOutOpen,
              setStatement,
              statement,
              tokenName,
              updateNonReceiver,
              userIsOptedOut,
            }}
          />
        )}
        {selectedMember && selectedMember !== myMember && currentEpoch && (
          <GiveDrawer
            {...{
              adjustGift,
              circleId,
              closeDrawer,
              maxedOut,
              nextMember,
              noGivingAllowed,
              saveState,
              selectedMemberIdx,
              setNeedToSave,
              updateNote,
              updateTeammate,
            }}
            totalMembers={membersToIterate.length}
            member={selectedMember}
            gift={
              gifts[selectedMember.id] ?? {
                tokens: 0,
                recipient_id: selectedMember.id,
              }
            }
            start_date={contributionRangeStartDate}
            end_date={currentEpoch.endDate.toJSDate()}
          />
        )}
      </Modal>
    </Box>
  );
};

export type Member = PotentialTeammate & {
  teammate: boolean;
  activity: number;
};
