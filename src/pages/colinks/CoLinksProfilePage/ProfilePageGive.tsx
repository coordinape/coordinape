import { useParams } from 'react-router-dom';

import { Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileCards } from './ProfileCards';
import { ProfileHeader } from './ProfileHeader';
import { ProfilePageGiveContents } from './ProfilePageGiveContents';

export const ViewProfilePageGive = () => {
  const { address } = useParams();

  if (!address) {
    return <Flex>address query param required</Flex>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <Flex
        css={{
          gap: '$xl',
          justifyContent: 'space-between',
          '@sm': { flexDirection: 'column' },
        }}
      >
        <Flex css={{ width: '100%' }}>
          <ProfilePageGiveContents targetAddress={address} />
        </Flex>
        <ProfileCards targetAddress={address} forceDisplay />
      </Flex>
    </SingleColumnLayout>
  );
};
