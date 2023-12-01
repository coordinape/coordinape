import { NavLink } from 'react-router-dom';

import { User } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Flex, Text } from '../../ui';

export const SkillTag = ({
  skill,
  count,
  large,
  css,
  active,
}: {
  skill: string;
  count?: number;
  // size?: ComponentProps<typeof Text>['size'];
  large?: boolean;
  css?: CSS;
  active?: boolean;
}) => {
  const asTo = active
    ? {}
    : {
        as: NavLink,
        to: coLinksPaths.explore2 + '?skill=' + encodeURIComponent(skill),
      };
  return (
    <Text
      {...asTo}
      size={large ? 'large' : undefined}
      key={skill}
      tag
      color={'secondary'}
      // ellipsis
      css={{
        ...css,
        p: large ? '$md $sm' : undefined,
        opacity: active ? undefined : '0.7',
        textDecoration: 'none',
        justifyContent: 'space-between',
        '&:hover': { opacity: 1 },
      }}
    >
      <Text semibold ellipsis css={{ flexShrink: 1 }}>
        {skill}
      </Text>
      {count && (
        <Flex css={{ alignItems: 'center', gap: '$xs' }}>
          <User size={large ? 'lg' : undefined} />
          {count}
        </Flex>
      )}
    </Text>
  );
};
