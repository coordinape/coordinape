import { useState } from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';

import { Panel, Text, Flex, IconButton } from '../../ui';
import { GemCoOutline } from 'icons/__generated';

import {
  MAX_GIVE,
  MAX_POINTS_CAP,
  POINTS_PER_GIVE,
} from './getAvailablePoints';
import { PointsBarInfo } from './PointsBarInfo';
import { usePoints } from './usePoints';

const barGradient =
  'linear-gradient(90deg, $alert 0, $complete 70px, $cta 170px)';

const progressStyles = {
  position: 'relative',
  pt: '$xs',
  '.tickMark': {
    position: 'absolute',
    '&:after': {
      content: '',
      borderLeft: '1px solid transparent',
      height: '1rem',
    },
    '&:last-of-type:after': {
      display: 'none',
    },
    svg: {
      position: 'absolute',
      top: '-1.3rem',
      left: '-0.5rem',
    },
  },
  progress: {
    width: '100%',
    height: '1rem',
    appearance: 'none',
    borderRadius: '$3',
    background: '$surfaceNested',
    overflow: 'clip',
    outline: '0.5px solid $borderDim',
    '&:not([value]), &:value': {
      appearance: 'none',
    },
    '&::-webkit-progress-bar': {
      background: '$surfaceNested',
    },
    '&::-webkit-progress-value': {
      background: barGradient,
    },
    '&::-moz-progress-bar': {
      background: barGradient,
    },
  },
};

export const PointsBar = ({
  open = false,
  barOnly = false,
  demo = false,
  forceTheme,
}: {
  open?: boolean;
  barOnly?: boolean;
  demo?: boolean;
  forceTheme?: 'dark' | 'light';
}) => {
  let { give, points } = usePoints();

  if (demo) {
    give = 25;
    points = MAX_POINTS_CAP;
  }

  // Dynamically generate tickMark styles
  for (let i = 1; i <= MAX_GIVE; i++) {
    const key: string = `&.tickMark-${i}`;
    (progressStyles['.tickMark'] as any)[key] = {
      left: `calc(100% / ${MAX_GIVE} * ${i} - 2px)`,
      'svg path': {
        fill: points && points >= POINTS_PER_GIVE * i ? '$cta' : '$border',
      },
    };
  }

  const [showInfo, setShowInfo] = useState<boolean>(open);

  if (barOnly) {
    return (
      <Flex css={{ ...progressStyles }}>
        <progress id="points" max={MAX_POINTS_CAP} value={points} />
        {Array.from({ length: MAX_GIVE }, (_, index) => (
          <Text key={index + 1} className={`tickMark tickMark-${index + 1}`}>
            {/* <GemCoOutline fa /> */}
          </Text>
        ))}
      </Flex>
    );
  }

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
          width: '100%',
          background:
            forceTheme === 'dark'
              ? '#1A1B1F'
              : forceTheme === 'light'
                ? '#f2f2f2'
                : '$surface',
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
              minHeight: '230px',
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
            <Flex css={{ justifyContent: 'space-between' }}>
              <Text semibold>
                {showInfo && <GemCoOutline fa size="lg" css={{ mr: '$xs' }} />}
                GIVE Bar
                {!open && (
                  <IconButton onClick={() => setShowInfo(prev => !prev)}>
                    <InfoCircledIcon />
                  </IconButton>
                )}
              </Text>
              <Flex css={{ alignItems: 'center', gap: '$xs' }}>
                <Text semibold color="cta">
                  {give}
                </Text>
                <GemCoOutline
                  fa
                  css={{
                    path: {
                      fill: '$cta',
                    },
                  }}
                />
              </Flex>
            </Flex>
            <Flex css={{ ...progressStyles }}>
              <progress id="points" max={MAX_POINTS_CAP} value={points} />
              {Array.from({ length: MAX_GIVE }, (_, index) => (
                <Text
                  key={index + 1}
                  className={`tickMark tickMark-${index + 1}`}
                >
                  {/* show give icon above tick marks */}
                  {/* <GemCoOutline fa /> */}
                </Text>
              ))}
            </Flex>
            {showInfo && <PointsBarInfo />}
          </Flex>
        </Flex>
      </Panel>
    </>
  );
};
