import { Dispatch, SetStateAction } from 'react';

import { useConnect, useAccount } from 'wagmi';

import { Button } from 'ui';

export const ConnectButton = ({
  setOpenModal,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  return (
    <Button
      onClick={async () => {
        await connect({ connector: connectors[1] });
        if (isConnected) setOpenModal(true);
      }}
    >
      Bridge
    </Button>
  );
};
