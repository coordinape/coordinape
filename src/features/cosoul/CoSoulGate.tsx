import { NavLink } from 'react-router-dom';

import { Button, Flex } from '../../ui';

import { Contracts } from './contracts';
import { useCoSoulToken } from './useCoSoulToken';

type Props = {
  children: (tokenId: number) => React.ReactNode;
  contracts: Contracts;
  address: string;
  message?: string;
};

export const CoSoulGate: React.FC<Props> = ({
  children,
  contracts,
  address,
  message,
}) => {
  const { tokenId } = useCoSoulToken({ contracts, address });
  if (!tokenId) {
    // show the mint button
    return (
      <Flex>
        <Button as={NavLink} to="/cosoul/mint" color="cta" size="large">
          Mint a CoSoul {message}
        </Button>
      </Flex>
    );
  }

  return <>{children(tokenId)}</>;
};
