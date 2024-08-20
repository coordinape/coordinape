import { useParams } from 'react-router-dom';

import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileCards } from './ProfileCards';
import { ProfileHeader } from './ProfileHeader';

export const ViewProfilePageOverview = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <ProfileCards targetAddress={address} forceDisplay />
    </SingleColumnLayout>
  );
};
