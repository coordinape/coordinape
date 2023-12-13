import assert from 'assert';

import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
import { useQuery, useQueryClient } from 'react-query';

import { QUERY_KEY_COLINKS_NAV } from './useCoLinksNavQuery';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const useCoLinks = ({
  contract,
  address,
  target,
}: {
  contract?: CoLinks;
  address: string;
  target: string;
}) => {
  const { data: balances, refetch } = useQuery(
    [QUERY_KEY_COLINKS, address, target],
    async () => {
      assert(contract);
      // your balance of them
      const balance = (await contract.linkBalance(target, address)).toNumber();
      // their balance of you
      const targetBalance = (
        await contract.linkBalance(address, target)
      ).toNumber();
      const supply = (await contract.linkSupply(target)).toNumber();
      const superFriend = targetBalance > 0 && balance > 0;
      return { balance, targetBalance, supply, superFriend };
    },
    {
      enabled: !!contract,
    }
  );

  const queryClient = useQueryClient();
  const refresh = () => {
    refetch();
    setTimeout(() => {
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, target]);
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, address]);
      // this is for the wizard, prove we bought our own key
      queryClient.invalidateQueries([QUERY_KEY_COLINKS_NAV]);
    }, 2000);
  };

  return { ...balances, refresh };
};
