import { useEffect, useState } from 'react';

import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { useQueryClient } from 'react-query';

export const useSoulKeys = ({
  soulKeys,
  address,
  subject,
}: {
  soulKeys: SoulKeys;
  address: string;
  subject: string;
}) => {
  const [balance, setBalance] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const refresh = () => {
    soulKeys
      .sharesBalance(subject, address)
      .then(b => setBalance(b.toNumber()));
    setTimeout(() => {
      queryClient.invalidateQueries(['soulKeys', subject]);
      queryClient.invalidateQueries(['soulKeys', address]);
    }, 2000);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { balance, refresh };
};
