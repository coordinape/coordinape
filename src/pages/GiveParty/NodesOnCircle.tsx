/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

export interface User {
  username: string;
}

export const NodesOnCircle = ({
  tier,
  users,
}: {
  tier: number;
  users: User[];
}) => {
  const containerSizes = ['20vmin', '38vmin', '53vmin', '67vmin', '82vmin'];
  const containerZIndexes = [5, 4, 3, 2, 1];
  const containerBackgrounds = [
    '#AE9CE1',
    '#C5F1C2',
    '#FAEABA',
    '#ECECEC',
    '#FAFAFA',
  ];
  const nodeBackgrounds = [
    '#9847FF',
    '#16AF5D',
    '#FFCD2A',
    '#C7C7C7',
    '#D5D5D5',
  ];
  const containerSize = containerSizes[tier - 1];
  const containerZIndex = containerZIndexes[tier - 1];
  const containerBackground = containerBackgrounds[tier - 1];
  const nodeBackground = nodeBackgrounds[tier - 1];
  const circleSize = '5vmin';
  const numberOfCircles = users.length;

  const circles = users.map((user, i) => {
    const angle = (i / numberOfCircles) * 2 * Math.PI;
    const x = 50 + 50 * Math.cos(angle);
    const y = 50 + 50 * Math.sin(angle);

    return (
      <div
        key={i}
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
          width: circleSize,
          height: circleSize,
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(calc(-2deg * ${tier}))`,
        }}
      >
        {user.username}
      </div>
    );
  });

  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: '50%',
        width: containerSize,
        height: containerSize,
        background: containerBackground,
        zIndex: containerZIndex,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(calc(2deg * ${tier}))`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {circles}
    </div>
  );
};
