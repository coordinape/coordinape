import { useState } from 'react';

import { uuidv4 } from 'common-lib/uuid';
import { useMutation } from 'react-query';

import { client } from '../../../lib/gql/client';
import useProfileId from 'hooks/useProfileId';
import { Box, Button, Flex, Text } from 'ui';

import { QRCode } from './QRCode';

export const AuthDeviceForm = () => {
  const profileId = useProfileId(true);

  const [token, setToken] = useState<string | undefined>(undefined);

  const { mutate: generateToken } = useMutation(
    async () => {
      return await client.mutate(
        {
          update_profiles_private: [
            {
              where: { id: { _eq: profileId } },
              _set: { device_login_token: uuidv4() },
            },
            {
              returning: {
                id: true,
                device_login_token: true,
              },
            },
          ],
        },
        {
          operationName: 'settingsProfiles__create_device_login_token',
        }
      );
    },
    {
      onSuccess: data => {
        setToken(
          data?.update_profiles_private?.returning[0]?.device_login_token
        );
      },
    }
  );

  return (
    <Box css={{}}>
      <Flex
        column
        css={{
          gap: '$lg',
          justifyContent: 'center',
        }}
      >
        <Text h1 semibold>
          Log In on Another Device
        </Text>
        <Text>
          Connect another device without needing your wallet. Scan a QR code to
          authenticate a second device. You&apos;ll still need a wallet
          connection to buy and sell links.
        </Text>
        <Text>
          Anyone who sees this QR code can access your account. Look behind you.
        </Text>

        <Flex
          column
          css={{
            width: '400px',
            margin: 'auto',
            gap: '$md',
            mt: '$lg',
            position: 'relative',
          }}
        >
          <Box
            css={{
              filter: token ? undefined : 'blur(9px)',
              opacity: token ? 1 : 0.8,
              transition: 'filter 0.5s, opacity 0.5s',
            }}
          >
            {token ? (
              <QRCode token={token} />
            ) : (
              <QRCode token={'placeholder'} />
            )}
          </Box>
          {!token && (
            <Button
              css={{
                position: 'absolute',
                width: '80%',
                top: '130px',
                ml: '10%',
              }}
              size={'large'}
              color={'cta'}
              onClick={() => generateToken()}
            >
              Reveal
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
