import { useWindowSize } from '@react-hook/window-size';
import { Rainbowify } from 'features/rainbowkit/Rainbowify';
import { useParams } from 'react-router-dom';

import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { Flex } from 'ui';

import { PartyBody } from './PartyBody';
import { PartyHeader } from './PartyHeader';
import { PartyProfileContent } from './PartyProfileContent';
import { useCoLinksProfile } from './useCoLinksProfile';
import { useFarcasterUser } from './useFarcasterUser';

export const profileColumnWidth = 520;
export const profileColumnWidthMobile = 360;
export const PartyProfile = () => {
  const { address } = useParams();
  const { data: targetProfile } = useCoLinksProfile(address!);
  const { data: fcUser } = useFarcasterUser(address!);
  const [width] = useWindowSize();

  const mapWidth = width - profileColumnWidth;
  const desktop = width > 1140;

  // TODO: return a profile/farcaster user not found thing here
  if (!targetProfile && !fcUser) return;

  return (
    <>
      <Rainbowify>
        <PartyBody css={{ width: '100%', margin: desktop ? 0 : 'auto' }}>
          <PartyHeader />
          <Flex column css={{ gap: '$md' }}>
            <PartyProfileContent
              address={address!}
              css={{
                zIndex: 1,
                position: desktop ? 'absolute' : 'relative',
                right: desktop ? '$md' : 0,
                width: profileColumnWidth,
                '@xs': {
                  width: profileColumnWidthMobile,
                },
              }}
            />

            <Flex css={{ flexGrow: 1 }}>
              <Flex
                css={{
                  overflow: 'hidden',
                  ...(desktop
                    ? { width: mapWidth, position: 'absolute', left: '$md' }
                    : {
                        width: profileColumnWidth,
                        position: 'relative',
                        // left: `calc(50% - (${profileColumnWidth}/2))`,
                        margin: 'auto',
                      }),
                  // border: '3px solid rgba(0,0,0,0.2)',
                  // borderRadius: '$3',
                  // height: 800,
                  // maxWidth: 1000,
                  // '@xs': {
                  //   maxWidth: `${artWidthMobile}`,
                  // },
                }}
              >
                <GiveGraph
                  address={address}
                  height={desktop ? undefined : profileColumnWidth}
                  width={desktop ? mapWidth : profileColumnWidth}
                  minZoom={2}
                  expand={desktop}
                />
              </Flex>
            </Flex>
          </Flex>
        </PartyBody>
      </Rainbowify>
    </>
  );
};
