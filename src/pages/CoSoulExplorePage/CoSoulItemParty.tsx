import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { artWidthMobile } from 'features/cosoul/constants';

import { CoSoul } from '../../features/colinks/fetchCoSouls';
import { Box, Flex, Text } from 'ui';

export const CoSoulItemParty = ({ cosoul }: { cosoul: CoSoul }) => {
  const repScore = cosoul.profile_public?.reputation_score?.total_score || 0;
  const tier1 = 1;
  const tier2 = 1000;
  const tier3 = 3000;
  const tierColor =
    repScore > tier3
      ? '#E3A102'
      : repScore > tier2
        ? '#1EC6AD'
        : repScore > tier1
          ? '#9995E0'
          : 'transparent';
  return (
    <Box
      key={cosoul.id}
      css={{
        overflow: 'hidden',
        borderRadius: '$4',
        position: 'relative',
      }}
    >
      <Flex
        column
        css={{
          background:
            'linear-gradient(0.36turn, rgb(89 12 233), rgb(46 1 132) 70%)',
          px: '$sm',
          pt: '$xs',
          pb: '$sm',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Text semibold css={{ fontSize: 26 }}>
          {repScore}
        </Text>
        <Text size="small" css={{ opacity: 0.8 }}>
          Onchain Rep Score
        </Text>
      </Flex>
      <Box
        css={{
          width: '100%',
          aspectRatio: '1 / 1',
        }}
      >
        <Box
          css={{
            background: tierColor,
            width: '100%',
            aspectRatio: '1 / 1',
            position: 'absolute',
            mixBlendMode: 'overlay',
          }}
        />
        <CoSoulArt
          pGive={cosoul.pgive}
          address={cosoul.address}
          repScore={repScore}
          width={artWidthMobile}
        />
      </Box>
    </Box>
  );
};
