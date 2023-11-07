import { useLoginData } from '../../../features/auth';
import { Box } from '../../../ui';

import { ViewProfilePageContents } from './ViewProfilePageContents';

const ViewMyProfilePage = () => {
  const profile = useLoginData();
  const address = profile?.address;

  if (!address) {
    return <Box>Must be logged in to use Soul Keys</Box>;
  }
  return <ViewProfilePageContents targetAddress={address} />;
};

export default ViewMyProfilePage;
