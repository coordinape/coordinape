import { ComponentProps } from 'react';

import { useLocation } from 'react-router';
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
  const location = useLocation();

  const soulKey = location.pathname.includes('soulkey');

  return (
    <Box
      as={NavLink}
      to={
        soulKey
          ? paths.coLinksProfile(profile.address || '')
          : paths.profile(profile.address || '')
      }
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
