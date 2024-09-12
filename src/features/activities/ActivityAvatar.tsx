import { ComponentProps } from 'react';

import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { coLinksPaths, givePaths } from '../../routes/paths';
import { Avatar, Box } from '../../ui';
import { useIsCoLinksSite } from '../colinks/useIsCoLinksSite';

export const ActivityAvatar = ({
  profile,
  size,
  css,
}: {
  profile: {
    address?: string;
    cosoul?: { id: number };
    name?: string;
    avatar?: string;
  };
  size?: ComponentProps<typeof Avatar>['size'];
  css?: CSS;
}) => {
  const isCoLinksPage = useIsCoLinksSite();

  return (
    <Box
      as={NavLink}
      to={
        isCoLinksPage
          ? coLinksPaths.profilePosts(profile.address || '')
          : givePaths.profile(profile.address || '')
      }
      css={{ textDecoration: 'none' }}
    >
      <Avatar
        css={{ flexShrink: 0, ...css }}
        name={profile.name}
        path={profile.avatar}
        hasCoSoul={!!profile.cosoul}
        size={size}
      />
    </Box>
  );
};
