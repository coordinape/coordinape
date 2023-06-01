import { Flex, Panel, Text } from 'ui';

import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth, artWidthMobile } from './MintPage';

type CoSoulData = QueryCoSoulResult;

export const CoSoulUserInfo = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  return (
    <Panel
      css={{
        justifyContent: 'space-between',
        width: '100%',
        minWidth: '180px',
        maxWidth: `${artWidth}`,
        background: 'transparent',
        border: 'none',
        gap: '$3xl',
        '@sm': {
          maxWidth: `${artWidthMobile}`,
          height: 'auto',
          gap: '$1xl',
        },
      }}
    >
      <Flex column css={{ gap: '$sm' }}>
        <Text h2 display>
          USERNAME
          {cosoul_data.totalPgive}
        </Text>
        <Text color="secondary">Member since 1999</Text>
      </Flex>
    </Panel>
  );
};
