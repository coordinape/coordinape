import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Box } from '../../ui';

export const ActivityAvatar = ({
  profile,
}: {
  profile: { address: string; name: string; avatar?: string };
}) => {
  return (
    <Box as={NavLink} to={paths.profile(profile.address)}>
      <Avatar
        css={{ flexShrink: 0 }}
        name={profile.name}
        path={profile.avatar}
      />
    </Box>
  );
};
