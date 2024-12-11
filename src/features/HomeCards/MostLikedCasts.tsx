import { useQuery } from 'react-query';

import { Activity } from '../activities/useInfiniteActivities';

import { FeaturedCasts } from './FeaturedCasts';

export const MostLikedCasts = () => {
  const { data: activities } = useQuery(
    ['GiveHome', 'mostLikedCasts'],
    async () => {
      const res = await fetch('/api/farcaster/casts/recentlikes');
      const data: { activities: Activity[] } = await res.json();
      return data.activities;
    }
  );

  return <FeaturedCasts title={'Most Liked Casts'} activities={activities} />;
};
