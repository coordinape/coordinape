/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import { artWidth } from 'features/cosoul';
import { NavLink } from 'react-router-dom';

import { Users } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import {
  Avatar,
  Box,
  Flex,
  Link,
  Text,
  PopoverContent,
  Popover,
  PopoverTrigger,
  Tooltip,
} from 'ui';

import { abbreviateNumber } from './PartyStats';

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
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
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
    '#0CCB65',
    '#EEC43A',
    '#C7C7C7',
    '#D5D5D5',
  ];
  const tierSize = tierSizes[tier - 1];
  const tierZIndex = tierZIndexes[tier - 1];
  const tierBackground = tierBackgrounds[tier - 1];
  const nodeBackground = nodeBackgrounds[tier - 1];
  const nodeSize = '1.5em';
  const maxNodes = 25;
  const nodesCount = users.length;
  const maxPopoverUsers = 200;
  const popoverUsers = users.slice(0, maxPopoverUsers);
  const popoverUsersOverflowCount = nodesCount - maxPopoverUsers;

  const nodes = users.slice(0, maxNodes).map((user, i) => {
    const angle = (i / Math.min(nodesCount, maxNodes)) * 2 * Math.PI;
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
          zIndex: tierZIndex,
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
        <Tooltip
          contentCss={{ background: 'black', color: 'white' }}
          content={user.username}
        >
          <Avatar
            name={user.username}
            path={user.avatar}
            css={{ width: '100% !important', height: '100% !important' }}
          />
        </Tooltip>
      </Link>
    );
  });
  const popoverNodes = popoverUsers.map(user => (
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

  const tierHover = {
    outline: `2px solid ${nodeBackground}`,
    outlineOffset: '-2px',
  };
  const handWidth = 100;
  const tierStyles = {
    cursor: 'pointer',
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
    background: tierBackground,
    '&:hover': {
      ...tierHover,
    },
    ...(isHovered && {
      ...tierHover,
    }),
  };
  const armBorderWidth = '2px';
  const armStyle = {
    width: handWidth,
    p: '$sm $xs $md',
    position: 'absolute',
    borderBottom: `${armBorderWidth} solid $border `,
    '@xs': {
      width: 80,
    },
    '&:hover + div': {
      ...tierHover,
    },
  };
  const armLineStyle = {
    content: '',
    position: 'absolute',
    bottom: `-${armBorderWidth}`,
    maxWidth: `calc(($mediumScreen / 2) - (${artWidth} / 2))`,
    borderBottom: `${armBorderWidth} solid $border `,
  };

  return (
    // tiers
    <Popover>
      {/* ring */}
      <PopoverTrigger className="ringTrigger" css={{ ...tierStyles }}>
        {nodes}
      </PopoverTrigger>
      <Box>
        {/* data arm */}
        <Box
          css={{
            ...armStyle,
            right: 0,
            borderColor: nodeBackground,
            // colinks
            ...(tier === 1 && {
              top: -50,
              left: 5,
              '&:after': {
                ...armLineStyle,
                borderColor: nodeBackground,
                right: '0',
                transformOrigin: '100% 0',
                width: 222,
                rotate: '-115deg',
                '@xs': {
                  width: 151,
                  rotate: '-110deg',
                },
              },
            }),
            // GIVE tx
            ...(tier === 2 && {
              top: -50,
              left: `calc(50% - 45px)`,
              '&:after': {
                ...armLineStyle,
                borderColor: nodeBackground,
                right: '100%',
                rotate: '-99deg',
                transformOrigin: '100% 0',
                width: 145,
                '@xs': {
                  width: 109,
                  rotate: '-105deg',
                },
              },
            }),
            // mutuals
            ...(tier === 3 && {
              top: -50,
              right: 5,
              '&:after': {
                ...armLineStyle,
                borderColor: nodeBackground,
                right: '100%',
                rotate: '-66deg',
                transformOrigin: '100% 0',
                width: 134,
                '@xs': {
                  width: 91,
                  rotate: '-68deg',
                },
              },
            }),
            // Following
            ...(tier === 4 && {
              bottom: -35,
              left: 5,
              '&:after': {
                ...armLineStyle,
                borderColor: nodeBackground,
                right: '0',
                rotate: '114deg',
                transformOrigin: '100% 0',
                width: 105,
                '@xs': {
                  width: 74,
                },
              },
            }),
            // Followers
            ...(tier === 5 && {
              bottom: -35,
              right: 5,
              '&:after': {
                ...armLineStyle,
                borderColor: nodeBackground,
                right: '100%',
                rotate: '66deg',
                transformOrigin: '100% 0',
                width: 71,
                '@xs': {
                  width: 52,
                },
              },
            }),
          }}
        >
          <Text
            className="nodeSubHeader"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <PopoverTrigger
              className="armTrigger"
              css={{
                position: 'absolute',
                cursor: 'pointer',
                bottom: '$sm',
                fontSize: '$small',
                '@xs': {
                  fontSize: '$xs',
                },
              }}
            >
              {tierMessage}
              {nodesCount > maxNodes && (
                <Text inline css={{ fontSize: '$xs' }}>
                  + {abbreviateNumber(nodesCount - maxNodes)} <Users fa />
                </Text>
              )}
            </PopoverTrigger>
            <PopoverContent
              side="top"
              sideOffset={-50}
              css={{
                background: 'black',
                p: '$sm $md',
                maxHeight: 285,
                maxWidth: handWidth + 60,
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
                {popoverNodes}
                {popoverUsersOverflowCount > 0 && (
                  <Text size="xs">
                    ...and {abbreviateNumber(popoverUsersOverflowCount)} more
                  </Text>
                )}
              </Flex>
            </PopoverContent>
          </Text>
        </Box>
      </Box>
    </Popover>
  );
};
