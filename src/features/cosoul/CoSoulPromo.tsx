import { useIsCoLinksSite } from 'features/colinks/useIsCoLinksSite';
import { NavLink } from 'react-router-dom';
import type { CSS } from 'stitches.config';

import { coLinksPaths, coSoulPaths } from '../../routes/paths';
import { Button, Panel, Text } from 'ui';

import { artWidth, artWidthMobile } from './constants';
import { QueryCoSoulResult } from './getCoSoulData';

type CoSoulData = QueryCoSoulResult;
export const CoSoulPromo = ({
  cosoul_data,
  address,
  css,
}: {
  cosoul_data: CoSoulData;
  address?: string;
  css?: CSS;
}) => {
  const isCoLinks = useIsCoLinksSite();
  return (
    <>
      {(!address || (address && !cosoul_data.mintInfo)) && (
        <Panel
          css={{
            gap: '$md',
            borderColor: '$cta',
            mt: '-$xl',
            maxWidth: `${artWidth}`,
            '@sm': {
              maxWidth: `${artWidthMobile}`,
            },
            ...css,
          }}
        >
          <Text p as="p" color="secondary">
            Bring your GIVE onchain my minting your CoSoul. It&apos;s a
            SoulBound NFT that grants you access and reputation into untold web3
            worlds!
          </Text>
          <Button
            color="cta"
            as={NavLink}
            to={isCoLinks ? coLinksPaths.cosoul : coSoulPaths.cosoul}
          >
            Mint Your Own CoSoul
          </Button>
        </Panel>
      )}
    </>
  );
};
