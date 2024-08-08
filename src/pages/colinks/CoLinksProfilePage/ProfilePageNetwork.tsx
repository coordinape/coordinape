import { useParams } from 'react-router-dom';

import { ProfileNetwork } from 'pages/GiveParty/ProfileNetwork';
import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileHeader } from './ProfileHeader';

export const ViewProfilePageNetwork = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }

  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <ProfileNetwork targetAddress={address} />
    </SingleColumnLayout>
  );
};
