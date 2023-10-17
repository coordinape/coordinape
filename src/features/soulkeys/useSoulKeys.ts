import { useEffect, useState } from 'react';

import { useQueryClient } from 'react-query';

import { Contracts } from '../cosoul/contracts';

export const useSoulKeys = ({
  contracts,
  address,
  subject,
}: {
  contracts: Contracts;
  address: string;
  subject: string;
}) => {
  const [balance, setBalance] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const refresh = () => {
    contracts.soulKeys
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
