import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Text } from '../../ui';

export const ActivityProfileName = ({
  profile,
}: {
  profile: { address: string; name: string };
}) => {
  return (
    <Text
      variant="label"
      as={NavLink}
      css={{ textDecoration: 'none' }}
      to={paths.profile(profile.address)}
    >
      {profile.name}
    </Text>
  );
};
