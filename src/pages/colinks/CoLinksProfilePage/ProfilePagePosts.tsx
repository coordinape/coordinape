import { useParams } from 'react-router-dom';

import { Box } from '../../../ui';

import { ProfilePagePostsContents } from './ProfilePagePostsContents';

export const ViewProfilePagePosts = () => {
  const { address } = useParams();

  if (!address) {
    return <Box>address query param required</Box>;
  }
  return (
    <>
      <ProfilePagePostsContents targetAddress={address} />
      add post form
    </>
  );
};
