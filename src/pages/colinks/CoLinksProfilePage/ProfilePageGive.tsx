import { useParams } from 'react-router-dom';

import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileHeader } from './ProfileHeader';
import { ProfilePageGiveContents } from './ProfilePageGiveContents';

export const ViewProfilePageGive = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <ProfilePageGiveContents targetAddress={address} />
    </SingleColumnLayout>
  );
};
