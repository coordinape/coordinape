import { useParams } from 'react-router-dom';

import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileHeader } from './ProfileHeader';
import { ProfilePagePostsContents } from './ProfilePagePostsContents';

export const ViewProfilePagePosts = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <ProfilePagePostsContents targetAddress={address} />
    </SingleColumnLayout>
  );
};
