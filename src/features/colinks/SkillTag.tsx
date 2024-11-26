import { useNavigate } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { CSS, skillTextStyle } from '../../stitches.config';
import { Flex, Text } from '../../ui';
import { GemCoOutline, Users } from 'icons/__generated';

export const SkillTag = ({
  skill,
  give = false,
  count,
  size = 'medium',
  css,
  active,
}: {
  skill: string;
  give?: boolean;
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
    navigate(coLinksPaths.giveSkill(skill));
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
        maxWidth: '14em',
      }}
    >
      <Text css={{ ...skillTextStyle, flexShrink: 1, textDecoration: 'none' }}>
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
          {give ? (
            <GemCoOutline fa size={size === 'large' ? 'lg' : undefined} />
          ) : (
            <Users size={size === 'large' ? 'lg' : undefined} />
          )}
          {count}
        </Flex>
      )}
    </Text>
  );
};
