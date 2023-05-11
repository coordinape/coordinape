/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import assert from 'assert';

import { rotate } from 'keyframes';

import isFeatureEnabled from 'config/features';
import { Box, Button, Flex, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { useCoSoulContracts } from './useCoSoulContracts';

export const MintPage = () => {
  const artWidthMobile = '320px';
  const artWidth = '400px';

  const contracts = useCoSoulContracts();

  // enqueue a mint cosoul transaction
  const mint = async () => {
    assert(contracts, 'contracts undefined');

    const transactionResponse = await contracts.cosoul.mint();

    console.log({ transactionResponse });
  };

  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <>
      <SingleColumnLayout css={{ m: 'auto' }}>
        <Flex
          css={{
            margin: 'auto',
            gap: '$2xl',
            mt: '$xl',
            alignItems: 'center',
            '@sm': {
              mt: 0,
              flexDirection: 'column-reverse',
            },
          }}
        >
          <Box
            css={{
              border: '1px dashed rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              position: 'relative',
              width: '100%',
              maxWidth: `${artWidth}`,
              height: `${artWidth}`,
              '@sm': {
                maxWidth: `${artWidthMobile}`,
                height: `${artWidthMobile}`,
              },
            }}
          >
            <Box
              css={{
                background:
                  'linear-gradient(rgb(198 219 137), rgb(34 119 127))',
                animation: `${rotate} 50s cubic-bezier(0.8, 0.2, 0.2, 0.8) alternate infinite`,
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%;',
                width: `${artWidth}`,
                height: `${artWidth}`,
                filter: `blur(calc(${artWidth} / 5))`,
                '@sm': {
                  maxWidth: `${artWidthMobile}`,
                  height: `${artWidthMobile}`,
                  filter: `blur(calc(${artWidthMobile} / 5))`,
                },
              }}
            />
            <Text
              color="default"
              semibold
              css={{
                position: 'absolute',
                height: '4rem',
                top: 'calc(50% - 2rem)',
                width: '12rem',
                left: 'calc(50% - 6rem)',
                textAlign: 'center',
                color: '$headingText',
                opacity: 0.7,
                display: 'flex',
                justifyContent: 'center',
                padding: '$sm',
              }}
            >
              CoSoul art will generate after minting
            </Text>
          </Box>
          <Panel
            css={{
              justifyContent: 'space-between',
              borderColor: '$cta',
              minWidth: '180px',
              maxWidth: `${artWidth}`,
              height: `${artWidth}`,
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
                2,345 pGIVE
              </Text>
              <Text size="small" color="secondary">
                pGIVE is an abstraction of the GIVE you have received in
                Coordinape
              </Text>
            </Flex>
            <Flex column css={{ gap: '$md' }}>
              <Button color="cta" size="large" onClick={mint}>
                Mint Your CoSoul
              </Button>
              <Text size="small" color="secondary">
                There are no fees to mint CoSouls, and gas costs are minimal.
              </Text>
            </Flex>
          </Panel>
        </Flex>
      </SingleColumnLayout>
    </>
  );
};
