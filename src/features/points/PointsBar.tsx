import { useState } from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useQuery } from 'react-query';

import { Panel, Text, Flex, IconButton } from '../../ui';
import { GemCoFill, GemCoFillSm } from 'icons/__generated';

import {
  MAX_GIVE,
  MAX_POINTS_CAP,
  POINTS_PER_GIVE,
} from './getAvailablePoints';
import { getMyAvailablePoints } from './getMyAvailablePoints';

const progressStyles = {
  position: 'relative',
  pt: '1.3rem',
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
      top: '-1.3rem',
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

export const POINTS_QUERY_KEY = 'points_query_key';

export const PointsBar = ({ open = false }: { open?: boolean }) => {
  const { data: points } = useQuery(
    [POINTS_QUERY_KEY],
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

  const [showInfo, setShowInfo] = useState<boolean>(open);

  return (
    <>
      <Panel
        css={{
          border: 'none',
          flexDirection: 'column',
          p: '0',
          overflow: 'clip',
          alignItems: 'center',
          gap: '0',
        }}
      >
        {showInfo && (
          <Flex
            className="art"
            onClick={() => setShowInfo(prev => !prev)}
            css={{
              flexGrow: 1,
              height: '100%',
              width: '100%',
              minHeight: '180px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/colink-give.jpg')",
            }}
          />
        )}
        <Flex
          column
          css={{
            flex: 2,
            gap: '$sm',
            alignItems: 'flex-start',
            p: '$md',
            color: '$text',
            width: '100%',
          }}
        >
          <Flex column css={{ width: '100%', gap: '$sm' }}>
            <Text semibold>
              {showInfo && <GemCoFill fa size="lg" css={{ mr: '$xs' }} />}
              GIVE Bar
              {!open && (
                <IconButton onClick={() => setShowInfo(prev => !prev)}>
                  <InfoCircledIcon />
                </IconButton>
              )}
            </Text>
            {showInfo && (
              <Flex column css={{ mb: '$sm', gap: '$md' }}>
                <Text inline size="small">
                  GIVE is a scarce thing that is more powerful than an emoji
                  reaction. You can allocate GIVE to members via Posts to
                  support ideas, skills and signal value.
                </Text>
                <Text inline size="small">
                  GIVEs roll into the receiver&apos;s onchain pGIVE score on
                  their CoSoul.
                </Text>
                <Text size="small">
                  Your GIVE bar is always slowly recharging and maxes out at{' '}
                  {MAX_GIVE}.
                </Text>
              </Flex>
            )}
            <Flex css={{ ...progressStyles }}>
              <progress id="points" max={MAX_POINTS_CAP} value={points} />
              {Array.from({ length: MAX_GIVE }, (_, index) => (
                <Text
                  key={index + 1}
                  className={`tickMark tickMark-${index + 1}`}
                >
                  <GemCoFillSm fa />
                </Text>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Panel>
    </>
  );
};
