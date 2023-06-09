import { useEffect } from 'react';

import { Flex, Panel, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { CoSoulButton } from './CoSoulButton';
import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth, artWidthMobile } from './MintPage';
import { generateRandomNumber, startNumberScramble } from './numberScramble';

type CoSoulData = QueryCoSoulResult;

export const CoSoulManagement = ({
  cosoul_data,
}: {
  cosoul_data: CoSoulData;
}) => {
  const mintInfo = cosoul_data.mintInfo;
  useEffect(() => {
    startNumberScramble('.management-scramble');
  });
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
          <Text
            color="cta"
            className={`${!mintInfo && 'management-scramble'}`}
            data-digits="3"
            data-text={generateRandomNumber(3)}
            css={{ fontWeight: 'inherit', width: mintInfo ? 'auto' : '2em' }}
          >
            {mintInfo
              ? numberWithCommas(cosoul_data.totalPgive, 0)
              : generateRandomNumber(3)}
          </Text>
          Public GIVE
        </Text>
        <Text tag color="primary" css={{ mt: '$sm', mb: '$md' }}>
          Mint to reveal your stats and art
        </Text>
        <Text color="secondary">
          pGIVE is an abstraction of the GIVE you have received in Coordinape.
        </Text>
        <Text color="secondary">
          pGIVE auto-syncs to your minted CoSoul every month.
        </Text>
        <Text color="secondary">
          Minting will create a public view of your stats, username, and
          organization/circle names; similar to what is displayed below.
        </Text>
      </Flex>
      {/*{!cosoul_data && (*/}
      <Flex column css={{ gap: '$sm' }}>
        <CoSoulButton />
        <Text color="secondary">
          There are no fees to mint CoSouls, and gas costs are minimal.
        </Text>
      </Flex>
    </Panel>
  );
};
