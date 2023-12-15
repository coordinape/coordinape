import { useNavigate } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Flex, Text } from '../../ui';
import { Users } from 'icons/__generated';

export const SkillTag = ({
  skill,
  count,
  size = 'medium',
  css,
  active,
}: {
  skill: string;
  count?: number;
  // size?: ComponentProps<typeof Text>['size'];
  size?: 'large' | 'medium' | 'small';
  css?: CSS;
  active?: boolean;
}) => {
  const navigate = useNavigate();
  const onClickSkillHandler = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate(coLinksPaths.exploreSkill(skill));
  };
  return (
    <Text
      onClick={active ? undefined : onClickSkillHandler}
      size={size === 'large' ? 'large' : size === 'small' ? 'xs' : undefined}
      key={skill}
      tag
      color={'complete'}
      css={{
        ...css,
        p: size === 'large' ? '$md $sm' : undefined,
        opacity: active ? undefined : '0.7',
        textDecoration: 'none',
        justifyContent: 'space-between',
        '&:hover': { opacity: 1 },
        cursor: active ? 'auto' : 'pointer',
      }}
    >
      <Text semibold ellipsis css={{ flexShrink: 1, textDecoration: 'none' }}>
        {skill}
      </Text>
      {count && (
        <Flex
          css={{
            alignItems: 'center',
            gap: '$xs',
            'svg *': {
              stroke: '$complete',
            },
          }}
        >
          <Users size={size === 'large' ? 'lg' : undefined} />
          {count}
        </Flex>
      )}
    </Text>
  );
};
