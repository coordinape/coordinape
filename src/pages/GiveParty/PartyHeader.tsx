import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CSS } from '@stitches/react';
import { useAccount } from 'wagmi';

import { PointsBar } from '../../features/points/PointsBar';
import useProfileId from '../../hooks/useProfileId';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Flex } from 'ui';

import { PartyNav } from './PartyNav';
import { profileColumnWidth } from './PartyProfile';

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
    <Flex column css={{ maxWidth: profileColumnWidth, gap: '$sm' }}>
      {walletConnected && profileId ? (
        <>
          <Flex
            css={{
              '>div': {
                flexDirection: 'column',
                gap: '$sm !important',
                button: {
                  borderRadius: '$3 !important',
                  fontSize: '$small !important',
                  '>div': {
                    borderRadius: '$3 !important',
                  },
                  'svg title+path': {
                    fill: 'transparent',
                  },
                },
              },
            }}
          >
            <ConnectButton />
          </Flex>
          <PointsBar forceTheme="dark" />
        </>
      ) : (
        <>
          <p>walletConnected: {walletConnected.toString()}</p>
          <p>profileId: {profileId}</p>
          <ConnectButton />
        </>
      )}
    </Flex>
  );
};
