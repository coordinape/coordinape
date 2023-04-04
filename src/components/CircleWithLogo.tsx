import React from 'react';

import { Avatar } from '../ui/Avatar/Avatar';
import { Box, Flex, Text } from 'ui';

const CircleWithLogo = ({
  logo,
  name,
  orgName,
  orgLogo,
  admins,
}: {
  logo?: string;
  name: string;
  orgLogo?: string;
  orgName: string;
  admins?: { name: string; avatar?: string }[];
}) => {
  return (
    <Flex alignItems="center" css={{ textAlign: 'left' }}>
      <Avatar
        name={name}
        size="large"
        margin="none"
        css={{ flexShrink: 0 }}
        path={logo}
      />
      <Box css={{ ml: '$lg', flexGrow: 1 }}>
        <Flex alignItems="center">
          <Avatar
            name={orgName}
            size="xs"
            margin="none"
            css={{ mr: '$sm' }}
            path={orgLogo}
          />
          <Text variant="label">{orgName}</Text>
        </Flex>
        <Box css={{ mt: '$sm', pb: '7px' }}>
          <Box
            // color={'default'}
            css={{
              display: 'block',
              lineHeight: '$none',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: '',
              color: '$text',
              fontWeight: '$semibold',
            }}
          >
            {name}
          </Box>
        </Box>
      </Box>
      {admins && admins.length > 0 && <Admins {...{ admins }} />}
    </Flex>
  );
};

export const Admins = ({
  admins,
}: {
  admins: { name: string; avatar?: string }[];
}) => {
  return (
    <Box>
      <Box css={{ mb: '$xs' }}>
        <Text variant="label" css={{ justifyContent: 'center' }}>
          Admins
        </Text>
      </Box>
      <Flex>
        {admins.map(u => {
          return (
            <Box key={u.name} css={{ textAlign: 'center', width: '$3xl' }}>
              <Avatar
                name={u.name}
                size="small"
                margin="none"
                path={u.avatar}
              />
              <Box
                css={{
                  maxWidth: '$3xl',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Text size={'small'} inline>
                  {u.name}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default CircleWithLogo;
