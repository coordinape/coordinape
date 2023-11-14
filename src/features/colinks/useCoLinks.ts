import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
import { useQuery, useQueryClient } from 'react-query';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';

export const useCoLinks = ({
  contract,
  address,
  subject,
}: {
  contract: CoLinks;
  address: string;
  subject: string;
}) => {
  const { data: balances, refetch } = useQuery(
    [QUERY_KEY_COLINKS, address, subject],
    async () => {
      // your balance of them
      const balance = (await contract.linkBalance(subject, address)).toNumber();
      // their balance of you
      const subjectBalance = (
        await contract.linkBalance(address, subject)
      ).toNumber();
      const supply = (await contract.linkSupply(subject)).toNumber();
      const superFriend = subjectBalance > 0 && balance > 0;
      return { balance, subjectBalance, supply, superFriend };
    }
  );

  const queryClient = useQueryClient();
  const refresh = () => {
    refetch();
    setTimeout(() => {
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, subject]);
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, address]);
    }, 2000);
  };

  return { ...balances, refresh };
};
