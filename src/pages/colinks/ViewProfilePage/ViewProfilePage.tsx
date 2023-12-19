import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';

import { ViewProfilePageContents } from './ViewProfilePageContents';

export const ViewProfilePage = () => {
  const { address } = useParams();

  // eslint-disable-next-line no-console
  console.log('HEY U GUYS');
  if (!address) {
    return <Box>address query param required</Box>;
  }
  return <ViewProfilePageContents targetAddress={address} />;
};
