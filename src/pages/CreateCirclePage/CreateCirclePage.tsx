import { useQuery } from 'react-query';

import { LoadingModal } from 'components';
import useConnectedAddress from 'hooks/useConnectedAddress';

import { CreateCircleForm } from './CreateCircleForm';
import { getCreateCircleData, QUERY_KEY_CREATE_CIRCLE } from './queries';

export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';

export const SummonCirclePage = () => {
  const address = useConnectedAddress();

  const { data } = useQuery(
    [QUERY_KEY_CREATE_CIRCLE, address],
    () => getCreateCircleData(address as string),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );

  if (!data) return <LoadingModal visible />;

  return <CreateCircleForm myAddress={address} source={data} />;
};

export default SummonCirclePage;
