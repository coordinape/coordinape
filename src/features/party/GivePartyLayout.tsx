import { Rainbowify } from 'features/rainbowkit/Rainbowify';

import { Box } from '../../ui';
import { PartyBody } from 'pages/GiveParty/PartyBody';
import { PartyHeader } from 'pages/GiveParty/PartyHeader';

const GivePartyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Rainbowify>
      <PartyBody css={{ width: '98%', margin: '0 auto' }}>
        <PartyHeader />
        <Box css={{ maxWidth: '$smallScreen' }}>{children}</Box>
      </PartyBody>
    </Rainbowify>
  );
};

export default GivePartyLayout;
