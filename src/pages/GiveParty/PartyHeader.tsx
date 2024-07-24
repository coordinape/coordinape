import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CSS } from '@stitches/react';
import { useAccount } from 'wagmi';

import { PointsBar } from '../../features/points/PointsBar';
import useProfileId from '../../hooks/useProfileId';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Box, Flex } from 'ui';

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
  const profileId = useProfileId(false);

  return (
    <Box css={{ backgroundColor: 'black' }}>
      <p>account: {account.address}</p>
      {walletConnected && profileId ? (
        <>
          <PointsBar />
          <ConnectButton />
        </>
      ) : (
        <>
          <p>walletConnected: {walletConnected.toString()}</p>
          <p>profileId: {profileId}</p>
          <ConnectButton />
        </>
      )}
    </Box>
  );
};
