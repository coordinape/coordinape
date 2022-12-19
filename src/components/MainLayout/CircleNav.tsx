import assert from 'assert';
import { useMemo } from 'react';

import { useQuery } from 'react-query';

import {
  getCircleSettings,
  QUERY_KEY_CIRCLE_SETTINGS,
} from 'pages/CircleAdminPage/getCircleSettings';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';

import { useShowGiveInfoQuery } from './getShowGiveInfo';
import { TopLevelLinks } from './TopLevelLinks';

// this has to be split out into its own component so it can suspend
export const CircleNav = () => {
  const { myUser, circleId, circle: initialData } = useSelectedCircle();

  const { data: circle } = useQuery(
    [QUERY_KEY_CIRCLE_SETTINGS, circleId],
    () => getCircleSettings(circleId),
    {
      initialData,
      enabled: !!circleId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const showGiveInfoQuery = useShowGiveInfoQuery(circleId);

  const links: [string, string, string[]?][] = useMemo(() => {
    assert(circleId);
    const l: [string, string, string[]?][] = [
      [paths.contributions(circleId), 'Contributions'],
      [
        paths.givebeta(circleId),
        'Allocate',
        [paths.epoch(circleId), paths.team(circleId), paths.give(circleId)],
      ],
      [paths.members(circleId), 'Members'],
      [paths.map(circleId), 'Map'],
    ];
    if (myUser.isCircleAdmin) l.push([paths.circleAdmin(circleId), 'Admin']);

    return l;
  }, [circleId, circle?.hasVouching, showGiveInfoQuery.data?.showGiveInfo]);

  return <TopLevelLinks links={links} css={{ mr: '$xs' }} />;
};
