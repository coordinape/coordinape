import assert from 'assert';

import { useQuery } from 'react-query';

import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';
import { AppLink, Button } from 'ui';

import { getClaims } from './queries';

export default function ClaimsNavButton() {
  const address = useConnectedAddress();
  const contracts = useContracts();
  const profile = useMyProfile();

  const { data: claims } = useQuery(
    ['claims', profile.id],
    () => {
      assert(contracts);
      return getClaims(profile.id, contracts);
    },
    {
      enabled: !!(contracts && address),
      retry: false,
    }
  );
  const unclaimed = claims?.filter(c => !c.txHash);

  return (unclaimed?.length || 0) > 0 ? (
    <AppLink to="/claims">
      <Button color="complete">Claim Allocations</Button>
    </AppLink>
  ) : (
    <></>
  );
}
