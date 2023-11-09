import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Text } from '../../ui';

export const ActivityProfileName = ({
  profile,
}: {
  profile: { address: string; name: string };
}) => {
  const coLink = location.pathname.includes('colink');

  return (
    <Text
      color="heading"
      semibold
      as={NavLink}
      css={{ textDecoration: 'none' }}
      to={
        coLink
          ? paths.coLinksProfile(profile.address || '')
          : paths.profile(profile.address || '')
      }
    >
      {profile.name}
    </Text>
  );
};
