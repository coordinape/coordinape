import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';

import { ProfileHeader } from './ProfileHeader';

export const ViewProfilePageReputation = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return (
    <>
      <ProfileHeader targetAddress={address} />
      rep spider here
    </>
  );
};
