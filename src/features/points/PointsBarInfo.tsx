import { Flex, Text } from 'ui';

import { MAX_GIVE } from './getAvailablePoints';

export const PointsBarInfo = () => {
  return (
    <>
      <Flex
        css={{
          flexGrow: 1,
          height: '100%',
          width: '100%',
          minHeight: '230px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundImage: "url('/imgs/background/colink-give.jpg')",
          '@sm': {
            display: 'none',
          },
        }}
      />
      <Flex
        column
        css={{
          m: '$sm',
          gap: '$md',
          whiteSpace: 'wrap',
        }}
      >
        <Text inline size="small">
          GIVE is a scarce and powerful way signal of appreciation. You can
          allocate GIVE to support ideas, skills and signal value.
        </Text>
        <Text inline size="small">
          GIVEs roll into the receiver&apos;s onchain pGIVE score on their
          CoSoul.
        </Text>
        <Text inline size="small">
          Your GIVE bar is always slowly recharging and maxes out at {MAX_GIVE}.
        </Text>
      </Flex>
    </>
  );
};
