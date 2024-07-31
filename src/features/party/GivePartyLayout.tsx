import { useWindowSize } from '@react-hook/window-size';
import { Rainbowify } from 'features/rainbowkit/Rainbowify';

import { PartyBody } from 'pages/GiveParty/PartyBody';
import { PartyHeader } from 'pages/GiveParty/PartyHeader';

const GivePartyLayout = ({ children }: { children: React.ReactNode }) => {
  const [width] = useWindowSize();

  const desktop = width > 1140;

  return (
    <Rainbowify>
      <PartyBody css={{ width: '98%', margin: desktop ? 0 : '0 auto' }}>
        <PartyHeader />
        {children}
      </PartyBody>
    </Rainbowify>
  );
};

export default GivePartyLayout;
