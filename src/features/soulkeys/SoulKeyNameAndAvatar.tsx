import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Link, Text } from '../../ui';

export const SoulKeyNameAndAvatar = ({
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
      to={paths.soulKey(address ?? 'FIXME')}
    >
      <Avatar path={avatar} name={name} size="small" />
      <Text>{name}</Text>
    </Link>
  );
};
