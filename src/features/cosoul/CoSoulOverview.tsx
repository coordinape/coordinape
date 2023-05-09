import { NavLink } from 'react-router-dom';

import { paths } from 'routes/paths';
import { Text, Panel, Flex, Button } from 'ui';
import { numberWithCommas } from 'utils';

import { QueryCoSoulResult } from './getCoSoulData';
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
        minHeight: `calc(${artWidth} * .6)`,
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
          pGIVE is an abstraction of the GIVE you have received in Coordinape
        </Text>
      </Flex>
      <Flex column css={{ gap: '$md' }}>
        <Button color="cta" size="large" as={NavLink} to={paths.cosoul}>
          Sync Your CoSoul
        </Button>
        <Text color="secondary">
          There are no fees to mint CoSouls, and gas costs are minimal.
        </Text>
      </Flex>
    </Panel>
  );
};
