import { useParams } from 'react-router-dom';

import { Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileCards } from './ProfileCards';
import { ProfileHeader } from './ProfileHeader';
import {
  ProfilePageGiveContents,
  profileMainColumnWidth,
} from './ProfilePageGiveContents';

export const ViewProfilePageGive = () => {
  const { address } = useParams();

  if (!address) {
    return <Flex>address query param required</Flex>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <Flex css={{ gap: '$md' }}>
        <Flex css={{ width: '100%', maxWidth: profileMainColumnWidth }}>
          <ProfilePageGiveContents targetAddress={address} />
        </Flex>
        <ProfileCards targetAddress={address} />
      </Flex>
    </SingleColumnLayout>
  );
};
