import { useParams } from 'react-router-dom';

import { Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileCards } from './ProfileCards';
import { ProfileHeader } from './ProfileHeader';
import { ProfilePagePostsContents } from './ProfilePagePostsContents';

export const ViewProfilePagePosts = () => {
  const { address } = useParams();

  if (!address) {
    return <Flex>address query param required</Flex>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <Flex css={{ gap: '$xl', justifyContent: 'space-between' }}>
        <Flex
          css={{
            flexGrow: 1,
            width: '100%',
          }}
        >
          <ProfilePagePostsContents targetAddress={address} />
        </Flex>
        <ProfileCards targetAddress={address} />
      </Flex>
    </SingleColumnLayout>
  );
};
