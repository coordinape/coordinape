import { NavLink } from 'react-router-dom';

import { ChevronRight, ChevronDown } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, IconButton, Text } from '../../ui';

import { NavCurrentCircle } from './NavCurrentCircle';

export const NavCircleItem = ({
  currentCircle,
  c,
  org,
}: {
  currentCircle: any;
  c: any;
  org: any;
}) => {
  const isCurrentCircle = currentCircle?.id == c.id;
  const isCircleMember = c.users?.length > 0;
  return (
    <Box key={c.id}>
      {
        <Flex
          as={NavLink}
          to={isCircleMember ? paths.history(c.id) : paths.members(c.id)}
          css={{
            alignItems: 'center',
            mb: '$md',
            textDecoration: 'none',
            borderRadius: '$3',
          }}
        >
          <Avatar
            name={c.name}
            size="small"
            margin="none"
            css={{
              mr: '$sm',
              outline: isCurrentCircle ? '2px solid $link' : undefined,
            }}
            path={c.logo}
          />
          <Text
            semibold={isCurrentCircle}
            css={{
              flexGrow: 1,
              color: isCurrentCircle ? '$text' : '$navLinkText',
            }}
          >
            {c.name}
          </Text>
          <IconButton>
            {isCurrentCircle || org.myCircles.length == 1 ? (
              <ChevronDown />
            ) : (
              <ChevronRight />
            )}
          </IconButton>
        </Flex>
      }
      {(isCurrentCircle || org.myCircles.length == 1) && (
        <NavCurrentCircle key={'currentCircle'} circle={c} />
      )}
    </Box>
  );
};
