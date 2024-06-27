import { PartyBody } from './GiveParty/PartyBody';
import { PartyHeader } from './GiveParty/PartyHeader';
import { ProfileNetwork } from './GiveParty/ProfileNetwork';

export const ProfileNetworkPage = () => {
  return (
    <>
      <PartyBody
        css={{
          height: '100%',
          gap: '$lg',
          display: 'block',
        }}
      >
        <PartyHeader css={{ mb: '$lg' }} />
        <ProfileNetwork fullscreen />
      </PartyBody>
    </>
  );
};
