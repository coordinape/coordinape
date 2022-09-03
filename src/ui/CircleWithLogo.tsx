import React from 'react';

import { getCircleAvatar } from '../utils/domain';

import { Avatar } from './Avatar/Avatar';
import { Box } from './Box/Box';
import { Flex } from './Flex/Flex';
import { Text } from './Text/Text';

const CircleWithLogo = ({
  logo,
  name,
  orgLogo,
  orgName,
  admins,
}: {
  logo?: string;
  name: string;
  orgLogo?: string;
  orgName: string;
  admins?: { name: string; avatar?: string }[];
}) => {
  return (
    <Flex css={{ alignItems: 'center', textAlign: 'left' }}>
      <Avatar
        name={name}
        size="xl"
        margin="none"
        css={{ flexShrink: 0 }}
        path={getCircleAvatar({
          avatar: logo,
          circleName: name,
        })}
      />
      <Box css={{ ml: '$lg', flexGrow: 1 }}>
        <Flex css={{ alignItems: 'center' }}>
          <Avatar
            name={orgName}
            size="xs"
            margin="none"
            css={{ mr: '$sm' }}
            path={getCircleAvatar({
              avatar: orgLogo,
              circleName: orgName,
            })}
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
              fontSize: '$h2',
              fontWeight: '$bold',
            }}
          >
            {name}
          </Box>
        </Box>
      </Box>
      {admins && admins.length > 0 && (
        <Box>
          <Box css={{ mb: '$xs' }}>
            <Text variant="label">Circle Admins</Text>
          </Box>
          <Flex>
            {admins.map(u => (
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
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default CircleWithLogo;
