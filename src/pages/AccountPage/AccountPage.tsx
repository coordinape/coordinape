import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { SkillComboBox } from '../../components/SkillComboBox/SkillComboBox';
import { useIsCoLinksSite } from '../../features/colinks/useIsCoLinksSite';
import { ShowOrConnectGitHub } from '../../features/github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from '../../features/linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from '../../features/twitter/ShowOrConnectTwitter';
import { useToast } from '../../hooks';
import { X } from '../../icons/__generated';
import { EditEmailForm } from 'pages/ProfilePage/EmailSettings/EditEmailForm';
import { ContentHeader, Flex, IconButton, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { EditProfileInfo } from './EditProfileInfo';
import { SkillAndTopicPicker } from './SkillAndTopicPicker';

export default function AccountPage() {
  const isCoLinksPage = useIsCoLinksSite();

  const [searchParams, setSearchParams] = useSearchParams();

  const error = searchParams.get('error');

  const { showError } = useToast();

  // Show the error and remove it from the URL
  // this error comes from the twitter/github/linkedin callbacks
  useEffect(() => {
    if (error) {
      showError(error);
      setSearchParams('');
    }
  }, [error]);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Account Settings</Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ maxWidth: '$readable', gap: '$lg' }}>
        Boom
        <PickOneSkill />
        {isCoLinksPage && (
          <>
            <Panel css={{ gap: '$md' }}>
              <Text large semibold>
                Profile
              </Text>
              <EditProfileInfo />
            </Panel>
            <SkillAndTopicPicker />
          </>
        )}
        <Panel>
          <Text large semibold>
            Email Addresses
          </Text>
          <EditEmailForm />
        </Panel>
        <Flex css={{ gap: '$lg' }}>
          {isCoLinksPage && (
            <>
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  Twitter
                </Text>
                <ShowOrConnectTwitter />
              </Panel>
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  GitHub
                </Text>
                <ShowOrConnectGitHub />
              </Panel>
              <Panel css={{ maxWidth: '$readable', flex: 1 }}>
                <Text large semibold css={{ mb: '$lg' }}>
                  LinkedIn
                </Text>
                <ShowOrConnectLinkedIn />
              </Panel>
            </>
          )}
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
}

const PickOneSkill = () => {
  const [skill, setSkill] = useState<string | undefined>();
  return (
    <>
      {skill ? (
        <Flex css={{ gap: '$md' }}>
          <Text tag size="medium" color="complete" css={{ pr: 0 }}>
            {skill}
            <IconButton
              onClick={() => setSkill(undefined)}
              css={{ pr: '$sm', width: 'auto' }}
            >
              <X size={'xs'} />
            </IconButton>
          </Text>
        </Flex>
      ) : (
        <SkillComboBox
          hideInput={false}
          excludeSkills={[]}
          addSkill={async (skill: string) => {
            setSkill(skill);
          }}
          placeholder={'Choose a GIVE Reason'}
        />
      )}
    </>
  );
};
