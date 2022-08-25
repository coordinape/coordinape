import React from 'react';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { useMyProfile } from '../../recoilState';
import { paths } from '../../routes/paths';
import { AppLink, Box, Button, Panel, Text } from '../../ui';
import CircleWithLogo from '../../ui/CircleWithLogo';
import { Flex } from '../../ui/Flex/Flex';

import CenteredBox from './CenteredBox';

export const AddressIsNotMember = ({
  tokenJoinInfo,
}: {
  tokenJoinInfo: TokenJoinInfo;
}) => {
  const { address, myUsers } = useMyProfile();

  const bigText = {
    fontWeight: '$semibold',
    mb: '$sm',
    color: '$headingText',
    fontSize: '$large',
  };

  return (
    <CenteredBox>
      <Box>
        <Box
          css={{
            ...bigText,
            fontSize: '$h2',
            fontWeight: '$bold',
            mb: '$lg',
          }}
        >
          You&apos;re not a member of {tokenJoinInfo.circle.name}
        </Box>

        <Box css={{ my: '$lg' }}>
          <Text p as="p">
            If you believe this is an error, check that you have signed in with
            the correct address or contact the Circle Administrator for further
            instructions. You are currently logged in as {address}.
          </Text>
        </Box>

        {myUsers.length > 0 && (
          <>
            <Box css={{ ...bigText, textAlign: 'left', mb: '$lg' }}>
              You are a member of these other circles
            </Box>
            {myUsers.map(u => (
              <AppLink key={u.id} to={paths.history(u.circle_id)}>
                <Panel
                  nested
                  css={{
                    border: '1px solid white',
                    mb: '$md',
                    cursor: 'pointer',
                    '&:hover': {
                      border: '1px solid $primary',
                    },
                  }}
                >
                  <CircleWithLogo
                    logo={u.circle.logo}
                    name={u.circle.name}
                    orgLogo={u.circle.protocol.logo}
                    orgName={u.circle.protocol.name}
                  />
                </Panel>
              </AppLink>
            ))}
          </>
        )}

        {myUsers.length == 0 && (
          <Box css={{ ...bigText, textAlign: 'center', mb: '$lg' }}>
            You aren&apos;t a member of any circles
          </Box>
        )}

        <Flex css={{ justifyContent: 'center', mt: '$xl' }}>
          <Box>
            <AppLink to={paths.profile('me')}>
              <Button color="primary" outlined inline>
                Complete Your Profile
              </Button>
            </AppLink>
          </Box>
        </Flex>
      </Box>
    </CenteredBox>
  );
};
