import { uuidv4 } from 'common-lib/uuid';
import { useMutation } from 'react-query';

import { client } from '../../../lib/gql/client';
import { ConfirmationModal } from 'components/ConfirmationModal';
import useProfileId from 'hooks/useProfileId';
import { Button, Flex, Text } from 'ui';

import { QRCode } from './QRCode';

export const AuthDeviceForm = () => {
  const profileId = useProfileId(true);

  const { mutate: generateToken, data: tokenData } = useMutation(async () => {
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
  });

  const device_token: string | undefined =
    tokenData?.update_profiles_private?.returning[0]?.device_login_token;

  return (
    <>
      <Flex
        column
        css={{
          mb: '$md',
          '>*': { borderBottom: '1px solid $borderDim' },
        }}
      ></Flex>
      <Text css={{ mb: '$md' }}>
        Authenticate a mobile device to use CoSoul on the go without the need
        for a wallet. You&apos;ll still need a wallet connection to buy and sell
        links.
      </Text>
      <Flex>
        {device_token ? (
          <QRCode token={device_token} />
        ) : (
          <ConfirmationModal
            trigger={
              <Button color="cta">Authenticate non-wallet device</Button>
            }
            action={() => generateToken()}
            description="Anyone who sees this QR code can access your account. Are you sure you want to proceed?"
            yesText="Yes, reveal it!"
          />
        )}
      </Flex>
    </>
  );
};
