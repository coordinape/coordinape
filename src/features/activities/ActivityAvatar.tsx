import { ComponentProps } from 'react';

import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Box } from '../../ui';

export const ActivityAvatar = ({
  profile,
  size,
}: {
  profile: {
    address?: string;
    cosoul?: { id: number };
    name: string;
    avatar?: string;
  };
  size?: ComponentProps<typeof Avatar>['size'];
}) => {
  return (
    <Box
      as={NavLink}
      to={paths.profile(profile.address || '')}
      css={{ textDecoration: 'none' }}
    >
      <Avatar
        css={{ flexShrink: 0 }}
        name={profile.name}
        path={profile.avatar}
        hasCoSoul={!!profile.cosoul}
        size={size}
      />
    </Box>
  );
};
