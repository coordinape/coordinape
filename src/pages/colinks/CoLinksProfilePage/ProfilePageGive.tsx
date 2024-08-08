import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';

export const ViewProfilePageGive = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return <>give here</>;
};
