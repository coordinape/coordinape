import React, { useEffect, useState } from 'react';

import isEqual from 'lodash/isEqual';
import { useQuery } from 'react-query';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { LoadingModal } from '../../components';
import { useDeepChangeEffect } from '../../hooks';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { rUsersMap, useSelectedCircle } from '../../recoilState';
import {
  NO_TEAM_STEPS,
  STEP_ALLOCATION,
  STEP_MY_EPOCH,
  STEP_MY_TEAM,
  STEPS,
} from '../../routes/allocation';
import { IAllocationStep, ISimpleGift, ISimpleGiftUser } from '../../types';
import { Box } from '../../ui/Box/Box';
import {
  getCircleSettings,
  QUERY_KEY_CIRCLE_SETTINGS,
} from 'pages/CircleAdminPage/getCircleSettings';

import AllocationEpoch from './AllocationEpoch';
import AllocationGive from './AllocationGive';
import { AllocationStepper } from './AllocationStepper';
import AllocationTeam from './AllocationTeam';
import { calculateGifts } from './calculations';
import {
  getPendingGiftsFrom,
  getTeammates,
  PendingGift,
  PotentialTeammate,
  Teammate,
} from './queries';

const AllocationPage = () => {
  const address = useConnectedAddress();
  const { circle: initialData, circleId } = useSelectedCircle();

  /* Make sure the teammates are loaded */
  const { data, refetch: refetchTeammates } = useQuery(
    ['teammates', circleId],
    () => getTeammates(circleId, address as string),
    {
      enabled: !!(circleId && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
  const {
    isLoading,
    isIdle,
    isError,
    isRefetching,
    error,
    data: selectedCircle,
  } = useQuery(
    [QUERY_KEY_CIRCLE_SETTINGS, circleId],
    () => getCircleSettings(circleId),
    {
      // the query will not be executed untill circleId exists
      enabled: !!circleId,
      initialData,
      //minmize background refetch
      refetchOnWindowFocus: false,

      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );
  // Make sure the pendingGifts are loaded
  const { data: pendingGiftsFrom, refetch: refetchGifts } = useQuery(
    ['pending-gifts', circleId],
    () => getPendingGiftsFrom(circleId, address as string),
    {
      enabled: !!(circleId && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    // We aren't reloading when transitioning from map->allocate, for example.
    // This forces the re-load when AllocatePage is visited.
    if (pendingGiftsFrom) {
      refetchGifts().then();
    }
    if (data) {
      refetchTeammates().then();
    }
  }, [location]);

  /* Return here if we don't have the data so that the actual page component can be simpler */
  if (!data || !pendingGiftsFrom) {
    return <LoadingModal visible={true} />;
  }

  const { allUsers, startingTeammates } = data;

  if (isLoading || isIdle || isRefetching) return <LoadingModal visible />;
  if (isError) {
    if (error instanceof Error) {
      console.warn(error);
    }
  }

  return (
    <AllocationContents
      startingTeammates={
        selectedCircle?.team_selection ? startingTeammates : allUsers
      }
      allUsers={allUsers}
      pendingGiftsFrom={pendingGiftsFrom}
      teamSelection={selectedCircle?.team_selection}
    />
  );
};

type AllocationContentsProps = {
  startingTeammates: Teammate[];
  allUsers: PotentialTeammate[];
  pendingGiftsFrom: PendingGift[];
  teamSelection?: boolean;
};
const AllocationContents = ({
  startingTeammates,
  allUsers,
  pendingGiftsFrom,
  teamSelection,
}: AllocationContentsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    circleId,
    myUser: selectedMyUser,
    circleEpochsStatus: { epochIsActive },
  } = useSelectedCircle();

  const usersMap = useRecoilValue(rUsersMap);

  /* Teammates Stuff */
  const [localTeammates, setLocalTeammates] =
    useState<Teammate[]>(startingTeammates);
  const [teammatesChanged, setTeammatesChanged] = useState<boolean>(false);
  /* ----- */

  /* Allocation Stuff */
  const [localGifts, setLocalGifts] = useState<ISimpleGift[]>([]);
  const givePerUser = new Map<number, ISimpleGift>(
    localGifts.map(g => [g.user.id, g])
  );
  /* ----- */

  /* Connected between teammates / allocate */
  const updateLocalGifts = (
    newTeammates: ISimpleGiftUser[],
    newGifts?: ISimpleGift[]
  ) => {
    setLocalGifts(calculateGifts(newTeammates, newGifts));
  };
  /* ----- */

  /* Navigation stuff */
  const [activeStep, setActiveStep] = React.useState(0);
  const getHandleStep = (step: IAllocationStep) => () => {
    navigate(step.pathFn(circleId));
    setActiveStep(step.key);
  };

  const allSteps = !teamSelection ? NO_TEAM_STEPS : STEPS;
  const [completedSteps, setCompletedSteps] = useState<
    Set<IAllocationStep> | undefined
  >(undefined);

  useEffect(() => {
    const exactStep = allSteps.find(({ pathFn }) =>
      matchPath(pathFn(circleId), location.pathname)
    );
    if (exactStep === undefined && completedSteps !== undefined) {
      if (!completedSteps.has(STEP_MY_EPOCH)) {
        navigate(STEP_MY_EPOCH.pathFn(circleId));
      } else if (!epochIsActive) {
        if (teamSelection) {
          navigate(STEP_MY_TEAM.pathFn(circleId));
        }
      } else {
        navigate(STEP_ALLOCATION.pathFn(circleId));
      }
    } else if (exactStep !== undefined) {
      setActiveStep(exactStep.key);
    }
  }, [location, completedSteps]);

  useEffect(() => {
    if (selectedMyUser === undefined) {
      setCompletedSteps(new Set());
      return;
    }
    const cSteps = new Set<IAllocationStep>();
    if (!selectedMyUser.epoch_first_visit) {
      cSteps.add(STEP_MY_EPOCH);
    }
    if (
      !selectedMyUser.epoch_first_visit &&
      startingTeammates &&
      startingTeammates.length > 0
    ) {
      cSteps.add(STEP_MY_TEAM);
    }
    if (pendingGiftsFrom.length > 0) {
      cSteps.add(STEP_ALLOCATION);
    }
    setCompletedSteps(cSteps);
  }, [selectedMyUser, pendingGiftsFrom, startingTeammates]);
  /* ----- */

  /* Side effects from changing data */
  useDeepChangeEffect(() => {
    // not confident about this
    const tm = startingTeammates ?? [];
    setLocalTeammates(tm);
    updateLocalGifts(tm);
  }, [selectedMyUser.teammates]);

  useDeepChangeEffect(() => {
    const newGifts: ISimpleGift[] = [];
    for (const g of pendingGiftsFrom) {
      const u: ISimpleGiftUser | undefined = usersMap.get(g.recipient_id);
      if (!u) {
        console.warn('gift has no user dude???', usersMap.get(g.recipient_id));
        continue;
      }
      newGifts.push({
        user: u,
        tokens: g.tokens ?? 0,
        note: g.note,
      });
    }
    updateLocalGifts(localTeammates, newGifts);
  }, [localTeammates, pendingGiftsFrom]);

  useEffect(() => {
    setTeammatesChanged(
      !isEqual(
        localTeammates.map(u => u.id),
        startingTeammates?.map(u => u.id)
      )
    );
  }, [startingTeammates, localTeammates]);

  useEffect(() => {
    if (localTeammates) {
      updateLocalGifts(localTeammates);
    }
  }, [localTeammates]);
  /* ----- */

  return (
    <Box
      css={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <AllocationStepper
        allSteps={allSteps}
        activeStep={activeStep}
        completedSteps={completedSteps}
        getHandleStep={getHandleStep}
        teamSelection={teamSelection}
      />
      <Box
        css={{
          flex: 1,
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'center',
          overflow: 'auto',
          width: '100%',
        }}
      >
        {selectedMyUser && activeStep === 0 && (
          <>
            <AllocationEpoch
              getHandleStep={getHandleStep}
              setActiveStep={setActiveStep}
            />
          </>
        )}

        {selectedMyUser && activeStep === 1 && (
          <AllocationTeam
            allUsers={allUsers}
            onContinue={getHandleStep(STEP_ALLOCATION)}
            changed={teammatesChanged}
            localTeammates={localTeammates}
            setLocalTeammates={setLocalTeammates}
            givePerUser={givePerUser}
            setActiveStep={setActiveStep}
          />
        )}

        {epochIsActive && activeStep === 2 && (
          <>
            <AllocationGive
              localGifts={localGifts}
              givePerUser={givePerUser}
              setLocalGifts={setLocalGifts}
              pendingGiftsFrom={pendingGiftsFrom}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AllocationPage;
