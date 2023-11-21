import { NavLink } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { Avatar, Link, Text } from '../../ui';

export const CoLinksNameAndAvatar = ({
  avatar,
  name,
  address,
}: {
  avatar?: string; // These being optional is weird
  name?: string;
  address?: string;
}) => {
  return (
    <Link
      as={NavLink}
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '$xs',
        mr: '$xs',
      }}
      to={coLinksPaths.profile(address ?? 'FIXME')}
    >
      <Avatar path={avatar} name={name} size="small" css={{ mr: '$xs' }} />
      <Text semibold>{name}</Text>
    </Link>
  );
};
