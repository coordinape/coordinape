import { ComponentProps } from 'react';

import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Box } from '../../ui';
import { useIsCoLinksPage } from '../colinks/useIsCoLinksPage';

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
  const { isCoLinksPage } = useIsCoLinksPage();

  return (
    <Box
      as={NavLink}
      to={
        isCoLinksPage
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
