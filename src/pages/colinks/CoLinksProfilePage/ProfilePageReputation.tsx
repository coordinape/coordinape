import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';

export const ViewProfilePageReputation = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return <>rep spider here</>;
};
