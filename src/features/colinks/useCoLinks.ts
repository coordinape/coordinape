import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
import { useQuery, useQueryClient } from 'react-query';

import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const useCoLinks = ({
  contract,
  address,
  target,
}: {
  contract: CoLinks;
  address: string;
  target: string;
}) => {
  const { data: balances, refetch } = useQuery(
    [QUERY_KEY_COLINKS, address, target],
    async () => {
      // your balance of them
      const balance = (await contract.linkBalance(target, address)).toNumber();
      // their balance of you
      const targetBalance = (
        await contract.linkBalance(address, target)
      ).toNumber();
      const supply = (await contract.linkSupply(target)).toNumber();
      const superFriend = targetBalance > 0 && balance > 0;
      return { balance, targetBalance, supply, superFriend };
    }
  );

  const queryClient = useQueryClient();
  const refresh = () => {
    refetch();
    setTimeout(() => {
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, target]);
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, address]);
    }, 2000);
  };

  return { ...balances, refresh };
};
