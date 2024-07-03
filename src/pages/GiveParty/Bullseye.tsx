/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavLink } from 'react-router-dom';

import { Users } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import {
  Avatar,
  Box,
  Flex,
  Link,
  Tooltip,
  Text,
  PopoverContent,
  Popover,
  PopoverTrigger,
} from 'ui';

export interface User {
  username: string;
  avatar: string;
  address: string;
}

export const Bullseye = ({
  tier,
  users,
  tierMessage,
}: {
  tier: number;
  users: User[];
  tierMessage: React.ReactNode;
}) => {
  const tierSizes = ['34%', '53%', '70%', '84%', '98%'];
  const tierZIndexes = [5, 4, 3, 2, 1];
  const tierBackgrounds = [
    'radial-gradient(circle at center, rgba(0,0,0,0.2) 20%, rgb(153 13 235 / 68%) 75%)',
    'radial-gradient(circle at center, rgba(0,0,0,0.2) 49%, rgb(15 208 102 / 58%) 71%)',
    'radial-gradient(circle at center, rgba(0,0,0,0.2) 50%, rgb(165 151 14 / 80%) 75%)',
    'radial-gradient(circle at center, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.3) 75%)',
    'radial-gradient(circle at center, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.3) 75%)',
  ];
  const nodeBackgrounds = [
    '#9847FF',
    '#16AF5D',
    '#FFCD2A',
    '#C7C7C7',
    '#D5D5D5',
  ];
  const tierSize = tierSizes[tier - 1];
  const tierZIndex = tierZIndexes[tier - 1];
  const tierBackground = tierBackgrounds[tier - 1];
  const nodeBackground = nodeBackgrounds[tier - 1];
  const nodeSize = '1.5em';
  const maxNodes = 30;
  const numberOfNodes = users.length;

  const nodes = users.slice(0, maxNodes).map((user, i) => {
    const angle = (i / Math.min(numberOfNodes, maxNodes)) * 2 * Math.PI;
    const x = 50 + 50 * Math.cos(angle);
    const y = 50 + 50 * Math.sin(angle);

    return (
      // nodes
      <Link
        key={tierZIndex + i}
        as={NavLink}
        to={coLinksPaths.partyProfile(user.address)}
        style={{
          position: 'absolute',
          background: nodeBackground,

          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: nodeSize,
          height: nodeSize,
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(calc(-2deg * ${tier}))`,
        }}
      >
        <Avatar
          name={user.username}
          path={user.avatar}
          css={{ width: '100% !important', height: '100% !important' }}
        />
      </Link>
    );
  });

  const allNodes = users.map(user => (
    <Link
      as={NavLink}
      to={coLinksPaths.partyProfile(user.address || '')}
      key={user.address}
      css={{
        alignItems: 'center',
        gap: '$sm',
        display: 'flex',
        color: 'white',
      }}
    >
      <Avatar size="xs" name={user.username} path={user.avatar} />
      <Text size="small" semibold css={{ textDecoration: 'none' }}>
        {user.username}
      </Text>
    </Link>
  ));

  const tierStyles = {
    position: 'absolute',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: `translate3d(-50%, -50%, 0)`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '1 / 1',
    width: tierSize,
    '&:hover': {
      outline: `2px solid ${nodeBackground}`,
    },
    '@media (orientation: landscape)': {
      height: tierSize,
      width: 'auto',
    },
  };

  return (
    // tiers
    <>
      <Popover>
        <PopoverTrigger
          css={{
            zIndex: 1,
            ...tierStyles,
          }}
        >
          {allNodes.length > maxNodes && (
            <Text
              inline
              css={{
                cursor: 'pointer',
                position: 'absolute',
                top: 6,
                zIndex: 0,
                fontSize: '$small !important',
              }}
            >
              + {allNodes.length - maxNodes} <Users fa />
            </Text>
          )}
        </PopoverTrigger>
        <PopoverContent
          side="top"
          css={{
            background: 'black',
            p: '$sm $md',
            maxHeight: 285,
            overflow: 'auto',
          }}
        >
          <Flex column css={{ gap: '$sm' }}>
            <Text
              semibold
              css={{
                borderBottom: `1px solid ${nodeBackground}`,
                pb: '$sm',
                mb: '$xs',
              }}
            >
              {tierMessage}
            </Text>
            {allNodes}
          </Flex>
        </PopoverContent>
      </Popover>
      <Box
        css={{
          ...tierStyles,
          background: tierBackground,
        }}
      >
        {nodes}
      </Box>
    </>
  );
};
