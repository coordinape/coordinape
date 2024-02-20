import { useState } from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from 'react-query';

import { Panel, Text, Flex, IconButton } from '../../ui';
import { GemSharpSolid } from 'icons/__generated';

import {
  MAX_GIVE,
  MAX_POINTS_CAP,
  POINTS_PER_GIVE,
} from './getAvailablePoints';
import { getMyAvailablePoints } from './getMyAvailablePoints';

const progressStyles = {
  position: 'relative',
  pt: '1.1rem',
  '.tickMark': {
    color: 'orange',
    position: 'absolute',
    '&:after': {
      content: '',
      borderLeft: '1px solid $borderDim',
      height: '1rem',
    },
    '&:last-of-type:after': {
      display: 'none',
    },
    svg: {
      position: 'absolute',
      top: '-1.1rem',
      left: '-0.5rem',
      path: {
        fill: '$border',
      },
    },
  },
  progress: {
    width: '100%',
    height: '1rem',
    appearance: 'none',
    borderRadius: '$3',
    background: '$surfaceNested',
    overflow: 'clip',
    '&:not([value]), &:value': {
      appearance: 'none',
    },
    '&::-webkit-progress-bar': {
      background: '$surfaceNested',
    },
    '&::-webkit-progress-value': {
      background: '$cta',
    },
    '&::-moz-progress-bar': {
      background: '$cta',
    },
  },
};

export const PointsBar = () => {
  const { data: points } = useQuery(
    'points',
    async () => {
      return await getMyAvailablePoints();
    },
    {
      onError: error => {
        console.error(error);
      },
    }
  );

  // Dynamically generate tickMark styles
  for (let i = 1; i <= MAX_GIVE; i++) {
    const key: string = `&.tickMark-${i}`;
    (progressStyles['.tickMark'] as any)[key] = {
      left: `calc(100% / ${MAX_GIVE} * ${i} - 2px)`,
      'svg path': {
        fill: points && points >= POINTS_PER_GIVE * i ? '$cta' : '$borderDim',
      },
    };
  }

  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <Panel css={{ border: 'none', gap: '$xs' }}>
      <Text semibold>
        GIVE
        <IconButton onClick={() => setShowInfo(prev => !prev)}>
          <InfoCircledIcon />
        </IconButton>
      </Text>
      {showInfo && (
        <>
          <Text inline size="small">
            You have{' '}
            <Text inline semibold>
              {points && Math.floor(points / POINTS_PER_GIVE)}
              <GemSharpSolid nostroke /> GIVE tokens
            </Text>{' '}
            that you can use to show people you appreciated them.
          </Text>
          <Text size="small">
            You constantly earn GIVE up to a max, and you also gain GIVE as your
            REP increases.
          </Text>
        </>
      )}
      <Flex css={{ ...progressStyles }}>
        <progress id="points" max={MAX_POINTS_CAP} value={points} />
        {Array.from({ length: MAX_GIVE }, (_, index) => (
          <Text key={index + 1} className={`tickMark tickMark-${index + 1}`}>
            <GemSharpSolid nostroke />
          </Text>
        ))}
      </Flex>
      <Flex css={{ justifyContent: 'space-between' }}>
        <Text variant="label" color="cta">
          {points && Math.floor(points)} Give
        </Text>
        <Text variant="label">{MAX_POINTS_CAP} Max</Text>
      </Flex>
    </Panel>
  );
};
