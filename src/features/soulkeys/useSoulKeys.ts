import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { useQuery, useQueryClient } from 'react-query';

export const useSoulKeys = ({
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
      const balance = (
        await soulKeys.sharesBalance(subject, address)
      ).toNumber();
      const subjectBalance = (
        await soulKeys.sharesBalance(address, subject)
      ).toNumber();
      return { balance, subjectBalance };
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
