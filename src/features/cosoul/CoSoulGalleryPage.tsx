import isFeatureEnabled from 'config/features';
import { Flex, Text } from 'ui';
import Iframe from 'ui/Iframe/Iframe';
import { shortenAddressWithFrontLength } from 'utils';

export const artWidthMobile = '320px';
export const artWidth = '320px';
const addresses = [
  '0xA3d812C732baAc3feAeF4CD8a628DbE8d6e60a55',
  // '0x14581BfcFcb4c43A433c3Ffe048727050F208c35',
  // '0x976BB10bfF75307a5A1E350A1EDFA30B5EafBe7E',
  // '0x00bA5Ffb1Ec658e3e88C6E906da524b8E6451E89',
];
const pGiveValues = [1, 50, 100, 150, 200, 250, 500];
// const pGiveValues = [
//   1, 50, 100, 150, 200, 250, 500, 600, 700, 800, 1000, 2000, 5000, 10000,
// ];
const canvasStyles = {
  left: 0,
  top: 0,
  width: `${artWidth} !important`,
  height: `${artWidth} !important`,
  '@sm': {
    width: `${artWidthMobile} !important`,
    height: `${artWidthMobile} !important`,
  },
};

export const CoSoulGalleryPage = () => {
  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <>
      <Flex column>
        {addresses.map(address => {
          return (
            <Flex key={address} row css={{ flexWrap: 'wrap' }}>
              {pGiveValues.map(pGive => {
                return (
                  <Flex
                    key={pGive}
                    css={{
                      ...canvasStyles,
                      position: 'relative',
                    }}
                  >
                    <Text
                      css={{
                        position: 'absolute',
                        background: '$surface',
                        p: '1px',
                        fontSize: '11px',
                        color: '#aaa',
                      }}
                    >
                      {address && shortenAddressWithFrontLength(address, 4)}
                      <br />
                      {pGive}
                    </Text>
                    <Iframe
                      title="cosouls"
                      css={{
                        ...canvasStyles,
                      }}
                      src={`/cosoul/art?&address=${address}&pgive=${pGive}&animate=false`}
                    />
                  </Flex>
                );
              })}
            </Flex>
          );
        })}
      </Flex>
    </>
  );
};
