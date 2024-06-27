/* eslint-disable @typescript-eslint/no-unused-vars */
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from 'routes/paths';
import { Avatar, Box, Link } from 'ui';

export interface User {
  username: string;
  avatar: string;
  address: string;
}

export const Bullseye = ({ tier, users }: { tier: number; users: User[] }) => {
  const tierSizes = ['35%', '54%', '71%', '85%', '98%'];
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
  const numberOfNodes = users.length;

  const nodes = users.map((user, i) => {
    const angle = (i / numberOfNodes) * 2 * Math.PI;
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

  return (
    // tiers
    <Box
      css={{
        position: 'absolute',
        borderRadius: '50%',
        background: tierBackground,
        zIndex: tierZIndex,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(calc(2deg * ${tier}))`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: '1 / 1',
        width: tierSize,
        '@media (orientation: landscape)': {
          height: tierSize,
          width: 'auto',
        },
      }}
    >
      {nodes}
    </Box>
  );
};
