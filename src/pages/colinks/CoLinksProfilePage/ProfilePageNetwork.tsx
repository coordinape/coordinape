import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';

import { ProfileHeader } from './ProfileHeader';

export const ViewProfilePageNetwork = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }

  return (
    <>
      <ProfileHeader targetAddress={address} />
      network here!
    </>
  );
};
