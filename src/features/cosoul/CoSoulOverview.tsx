import { Flex, Panel, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { QueryCoSoulResult } from './getCoSoulData';
import { MintButton } from './MintButton';
import { artWidth, artWidthMobile } from './MintPage';

type CoSoulData = QueryCoSoulResult;

export const CoSoulOverview = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  return (
    <Panel
      css={{
        justifyContent: 'space-between',
        borderColor: '$cta',
        width: '100%',
        minWidth: '180px',
        maxWidth: `${artWidth}`,
        pb: '$xl',
        gap: '$3xl',
        '@sm': {
          maxWidth: `${artWidthMobile}`,
          height: 'auto',
          gap: '$1xl',
        },
      }}
    >
      <Flex column css={{ gap: '$sm' }}>
        <Text variant="label">{"You've Earned"}</Text>
        <Text h2 display>
          {numberWithCommas(cosoul_data.totalPgive, 0)} Public GIVE
        </Text>
        <Text color="secondary">
          pGIVE is an abstraction of the GIVE you have received in Coordinape.
        </Text>
        <Text color="secondary">
          pGIVE auto-syncs to your minted CoSoul every month.
        </Text>
      </Flex>
      {/*{!cosoul_data && (*/}
      <Flex column css={{ gap: '$sm' }}>
        <MintButton />
        <Text color="secondary">
          There are no fees to mint CoSouls, and gas costs are minimal.
        </Text>
      </Flex>
      {/*)}*/}
    </Panel>
  );
};
