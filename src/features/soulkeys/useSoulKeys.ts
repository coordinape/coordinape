import { useEffect, useState } from 'react';

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

  const refresh = () => {
    contracts.soulKeys
      .sharesBalance(subject, address)
      .then(b => setBalance(b.toNumber()));
  };

  useEffect(() => {
    refresh();
  }, []);

  return { balance, refresh };
};
