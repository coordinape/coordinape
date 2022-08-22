import assert from 'assert';
import { useMemo } from 'react';

import { useQuery } from 'react-query';

import { getCircleSettings } from 'pages/CircleAdminPage/getCircleSettings';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';

import { TopLevelLinks } from './TopLevelLinks';

// this has to be split out into its own component so it can suspend
export const CircleNav = () => {
  const { myUser, circleId, circle: initialData } = useSelectedCircle();

  const { data: circle } = useQuery(
    ['circleSettings', circleId],
    () => getCircleSettings(circleId),
    {
      initialData,
      enabled: !!circleId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const links: [string, string, string[]?][] = useMemo(() => {
    assert(circleId);
    const l: [string, string, string[]?][] = [
      [
        paths.allocation(circleId),
        'Allocate',
        [paths.epoch(circleId), paths.team(circleId), paths.give(circleId)],
      ],
      [paths.map(circleId), 'Map'],
    ];

    if (circle?.hasVouching) l.push([paths.vouching(circleId), 'Vouching']);
    if (myUser.isCircleAdmin) {
      l.push([paths.members(circleId), 'Admin']);
    }

    return l;
  }, [circleId, circle?.hasVouching]);

  return <TopLevelLinks links={links} css={{ mr: '$xs' }} />;
};
