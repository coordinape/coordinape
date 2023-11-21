import { NavLink } from 'react-router-dom';

import { coLinksPaths, givePaths } from '../../routes/paths';
import { Text } from '../../ui';
import { useIsCoLinksPage } from '../colinks/useIsCoLinksPage';

export const ActivityProfileName = ({
  profile,
}: {
  profile: { address: string; name: string };
}) => {
  const { isCoLinksPage } = useIsCoLinksPage();

  return (
    <Text
      color="heading"
      semibold
      as={NavLink}
      css={{ textDecoration: 'none' }}
      to={
        isCoLinksPage
          ? coLinksPaths.profile(profile.address || '')
          : givePaths.profile(profile.address || '')
      }
    >
      {profile.name}
    </Text>
  );
};
