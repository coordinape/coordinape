import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { useQuery, useQueryClient } from 'react-query';

export const useCoLinks = ({
  soulKeys,
  address,
  subject,
}: {
  soulKeys: SoulKeys;
  address: string;
  subject: string;
}) => {
  const { data: balances, refetch } = useQuery(
    ['soulKeys', address],
    async () => {
      // your balance of them
      const balance = (
        await soulKeys.sharesBalance(subject, address)
      ).toNumber();
      // their balance of you
      const subjectBalance = (
        await soulKeys.sharesBalance(address, subject)
      ).toNumber();
      const supply = (await soulKeys.sharesSupply(subject)).toNumber();
      const superFriend = subjectBalance > 0 && balance > 0;
      return { balance, subjectBalance, supply, superFriend };
    }
  );

  const queryClient = useQueryClient();
  const refresh = () => {
    refetch();
    setTimeout(() => {
      queryClient.invalidateQueries(['soulKeys', subject]);
      queryClient.invalidateQueries(['soulKeys', address]);
    }, 2000);
  };

  return { ...balances, refresh };
};
