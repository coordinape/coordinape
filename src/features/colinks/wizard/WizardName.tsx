import { useAuthStore } from 'features/auth';
import { ShowOrConnectTwitter } from 'features/twitter/ShowOrConnectTwitter';
import { useMyTwitter } from 'features/twitter/useMyTwitter';

import { OrBar } from '../../../components/OrBar';
import { EditProfileInfo } from 'pages/AccountPage/EditProfileInfo';
import { coLinksPaths } from 'routes/paths';
import { Flex } from 'ui';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardName = () => {
  const profileId = useAuthStore(state => state.profileId);

  const { twitter } = useMyTwitter(profileId);
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, rgb(18 19 21) 0%, rgb(73 74 76) 78%, rgb(83 75 78) 83%, rgb(110 109 109) 100%)',
        }}
      />
      <Flex
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-name.jpg')",
          backgroundPosition: '50% 60%',
        }}
      />
      <WizardInstructions>
        <ShowOrConnectTwitter
          callbackPage={coLinksPaths.wizard}
          minimal={true}
        />
        {!twitter && <OrBar>Or Set Your Name and Avatar</OrBar>}

        <EditProfileInfo
          vertical={true}
          preloadProfile={
            twitter
              ? {
                  name: twitter.username,
                  avatar: twitter.profile_image_url,
                  description: twitter.description,
                }
              : undefined
          }
        />
      </WizardInstructions>
    </>
  );
};
