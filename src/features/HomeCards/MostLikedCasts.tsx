import { useQuery } from 'react-query';

import { anonClient } from '../../lib/anongql/anonClient';
import { fetchCasts } from '../activities/cast';

import { FeaturedCasts } from './FeaturedCasts';

export const MostLikedCasts = () => {
  const { data: casts } = useQuery(['mostLikedCasts'], async () => {
    // TODO: some api call
    const { enriched_casts } = await anonClient.query(
      {
        enriched_casts: [{ limit: 1 }, { id: true }],
      },
      {
        operationName: 'mostLikedCasts',
      }
    );
    const casts = await fetchCasts(enriched_casts.map((c: any) => c.id));
    return casts;
  });

  return <FeaturedCasts title={'Most Liked Casts'} casts={casts} />;
};
