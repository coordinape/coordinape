import { useQuery } from 'react-query';

import { useAuthStore } from '../../features/auth';
import { LoadingModal } from 'components';

import { CreateCircleForm } from './CreateCircleForm';
import { getCreateCircleData, QUERY_KEY_CREATE_CIRCLE } from './queries';

export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';

export const SummonCirclePage = () => {
  const profileId = useAuthStore(state => state.profileId);

  const { data, isLoading, isRefetching, isError } = useQuery(
    [QUERY_KEY_CREATE_CIRCLE, profileId],
    () => getCreateCircleData(profileId as number),
    {
      enabled: !!profileId,
      refetchOnWindowFocus: false,
    }
  );

  if (!data || isLoading || isRefetching || isError)
    return <LoadingModal visible />;

  return <CreateCircleForm profileId={profileId} source={data} />;
};

export default SummonCirclePage;
