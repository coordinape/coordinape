import { useState } from 'react';

import { WizardInstructions } from 'features/colinks/wizard/WizardInstructions';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';
import { zoomBackground } from 'keyframes';
import { NavLink } from 'react-router-dom';

import { GlobalUi } from '../../../components/GlobalUi';
import { isFeatureEnabled } from '../../../config/features';
import { useAuthStateMachine } from '../../../features/auth/RequireAuth';
import { RedeemInviteCode } from '../../../features/invites/RedeemInviteCode';
import useConnectedAddress from '../../../hooks/useConnectedAddress';
import useProfileId from '../../../hooks/useProfileId';
import { coLinksPaths } from '../../../routes/paths';
import { Button, Flex, Text } from '../../../ui';
import { shortenAddressWithFrontLength } from '../../../utils';

export const WizardStart = () => {
  // need to call this so address gets conditionally loaded
  useAuthStateMachine(false, true);

  const profileId = useProfileId();
  // address will be available if we are logged in, otherwise undefined
  const address = useConnectedAddress();

  const [redeemedInviteCode, setRedeemedInviteCode] = useState(false);

  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  const isLoggedIn = !!profileId;

  return (
    <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
      <Flex column css={{ height: '100vh', width: '100%' }}>
        <GlobalUi />
        <WizardInstructions>
          <Flex column css={{ gap: '$md' }}>
            <Text h2>Let&apos;s adventure to get connected</Text>
            <Text>
              CoLinks is a network of professionals and friends in the web3
              ecosystem.
            </Text>
            {isLoggedIn ? (
              <Flex column css={{ gap: '$md', width: '100%' }}>
                <Flex column css={{ alignSelf: 'flex-start' }}>
                  <Text variant="label" css={{ mb: '$xs' }}>
                    Connected with Wallet
                  </Text>
                  <Text
                    tag
                    color="neutral"
                    css={{
                      width: '100%',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                    }}
                  >
                    {address && shortenAddressWithFrontLength(address, 6)}
                  </Text>
                </Flex>

                <RedeemInviteCode
                  setRedeemedInviteCode={setRedeemedInviteCode}
                />
                {redeemedInviteCode && (
                  <Button
                    as={NavLink}
                    to={coLinksPaths.wizard}
                    color="cta"
                    size="large"
                    css={{ mt: '$sm', width: '100%' }}
                  >
                    {`Let's Go`}
                  </Button>
                )}
              </Flex>
            ) : (
              <>
                <Text>
                  First things first... Let&apos;s connect your wallet.
                </Text>
                <Button
                  as={NavLink}
                  to={coLinksPaths.wizard}
                  color="cta"
                  size="large"
                  css={{ mt: '$sm', width: '100%' }}
                >
                  Connect to Join CoLinks
                </Button>
              </>
            )}
          </Flex>
        </WizardInstructions>
      </Flex>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, rgb(18 19 21) 0%, #7D3B7B 58%, #3F4F7B 83%, #7AA0B8 100%)',
        }}
      />
      <Flex
        css={{
          ...fullScreenStyles,
          animation: `${zoomBackground} 30s infinite ease-in-out`,
          animationDirection: 'alternate',
          backgroundImage: "url('/imgs/background/colink-start.jpg')",
        }}
      />
    </Flex>
  );
};
