import { useState } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CSS } from '@stitches/react';
import { getAuthToken } from 'features/auth/token';
import { useAccount } from 'wagmi';

import { PointsBar } from '../../features/points/PointsBar';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Box, Button, Flex } from 'ui';

import { PartyNav } from './PartyNav';

export const PartyHeader = ({ css }: { css?: CSS }) => {
  return (
    <Flex column css={{ alignItems: 'center', gap: '$md', pt: '$lg', ...css }}>
      <AppLink to={coLinksPaths.giveParty}>
        <GemCoOutline size="2xl" fa />
      </AppLink>
      <PartyNav />
      <MyPartyProfile />
    </Flex>
  );
};

const MyPartyProfile = () => {
  const account = useAccount();
  const walletConnected = !!account.address;

  // TODO: refactor this to better react method
  const [token, setToken] = useState<string | undefined>(getAuthToken(false));

  return (
    <Box css={{ backgroundColor: 'black' }}>
      {walletConnected && token ? (
        <>
          <PointsBar />
          <ConnectButton />
        </>
      ) : (
        <>
          <p>walletConnected: {walletConnected.toString()}</p>
          <p>token: {token?.toString()}</p>
          <Button
            onClick={() => {
              setToken(getAuthToken(false));
            }}
          >
            ReCheck Auth
          </Button>
          <ConnectButton />
        </>
      )}
    </Box>
  );
};
