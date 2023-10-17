import { useParams } from 'react-router-dom';

import { Box } from '../../ui';

import { ViewSoulKeyPageContents } from './ViewSoulKeyPageContents';

export const ViewSoulKeyPage = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return <ViewSoulKeyPageContents subjectAddress={address} />;
};
