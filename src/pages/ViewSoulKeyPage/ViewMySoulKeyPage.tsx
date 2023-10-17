import { useLoginData } from '../../features/auth';
import { Box } from '../../ui';

import { ViewSoulKeyPageContents } from './ViewSoulKeyPageContents';

const ViewMySoulKeyPage = () => {
  const profile = useLoginData();
  const address = profile?.address;

  if (!address) {
    return <Box>Must be logged in to use Soul Keys</Box>;
  }
  return <ViewSoulKeyPageContents subjectAddress={address} />;
};

export default ViewMySoulKeyPage;
