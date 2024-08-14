import { useParams } from 'react-router-dom';

import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileHeader } from './ProfileHeader';
import { ProfilePageNetworkContents } from './ProfilePageNetworkContents';

export const ViewProfilePageNetwork = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }

  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <ProfilePageNetworkContents targetAddress={address} />
    </SingleColumnLayout>
  );
};
