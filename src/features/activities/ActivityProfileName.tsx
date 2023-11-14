import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
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
          ? paths.coLinksProfile(profile.address || '')
          : paths.profile(profile.address || '')
      }
    >
      {profile.name}
    </Text>
  );
};
