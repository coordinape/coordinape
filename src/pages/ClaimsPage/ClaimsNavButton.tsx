import assert from 'assert';

import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';
import { Button } from 'ui';

import { getClaims } from './queries';

export default function ClaimsNavButton() {
  const address = useConnectedAddress();
  const contracts = useContracts();
  const profile = useMyProfile();
  const navigate = useNavigate();

  assert(address || contracts);

  const { data: claims } = useQuery(
    ['claims', profile.id],
    () => getClaims(profile.id),
    {
      enabled: !!(contracts && address),
      retry: false,
    }
  );
  const unclaimed = claims?.filter(c => !c.txHash);

  return unclaimed && unclaimed.length > 0 ? (
    <Button onClick={() => navigate('claims')} color="complete">
      Claim Allocations
    </Button>
  ) : (
    <></>
  );
}
