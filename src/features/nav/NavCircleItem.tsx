import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, Text } from '../../ui';

import { NavCurrentCircle } from './NavCurrentCircle';

export const NavCircleItem = ({
  currentCircle,
  circle,
  org,
  onClick,
}: {
  currentCircle: any;
  circle: any;
  org: any;
  onClick?: () => void;
}) => {
  const isCurrentCircle = currentCircle?.id == circle.id;
  return (
    <Box key={circle.id} onClick={onClick}>
      {
        <Flex
          as={NavLink}
          to={paths.circle(circle.id)}
          css={{
            alignItems: 'center',
            mb: '$md',
            textDecoration: 'none',
            borderRadius: '$3',
          }}
        >
          <Avatar
            name={circle.name}
            size="small"
            margin="none"
            css={{
              mr: '$sm',
              outline: isCurrentCircle ? '2px solid $link' : undefined,
            }}
            path={circle.logo}
          />
          <Text
            semibold={isCurrentCircle}
            css={{
              flexGrow: 1,
              color: isCurrentCircle ? '$text' : '$navLinkText',
            }}
          >
            {circle.name}
          </Text>
        </Flex>
      }
      {(isCurrentCircle || org.myCircles.length == 1) && (
        <NavCurrentCircle circle={circle} />
      )}
    </Box>
  );
};
