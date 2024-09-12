import { useParams } from 'react-router-dom';

import { Box } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ProfileHeader } from './ProfileHeader';
import { ProfilePageReputationContents } from './ProfilePageReputationContents';

export const ViewProfilePageReputation = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return (
    <SingleColumnLayout>
      <ProfileHeader targetAddress={address} />
      <ProfilePageReputationContents targetAddress={address} />
    </SingleColumnLayout>
  );
};
