import React, { useEffect, useState } from 'react';

import { LoadingModal } from '../../components';
import { paths } from '../../routes/paths';
import { ICircle } from '../../types';
import BackButton from '../../ui/BackButton';
import { Box } from '../../ui/Box/Box';
import HintButton from '../../ui/HintButton';
import { APP_URL } from '../../utils/domain';
import { useSelectedCircle } from 'recoilState/app';
import { AppLink, Flex, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import CSVImport from './CSVImport';
import MagicLink from './MagicLink';
import NewMemberList, { NewMember } from './NewMemberList';
import TabButton, { Tab } from './TabButton';
import {
  deleteMagicToken,
  deleteWelcomeToken,
  useMagicToken,
  useWelcomeToken,
} from './useCircleTokens';

const AddMembersPage = () => {
  const { circleId, circle } = useSelectedCircle();

  const [loading, setLoading] = useState<boolean>(false);

  const { data: magicLinkUuid, refetch: refetchMagicToken } =
    useMagicToken(circleId);
  const { data: welcomeUuid, refetch: refetchWelcomeToken } =
    useWelcomeToken(circleId);

  // Wait for initial load, show nothing but loading modal
  if (!magicLinkUuid || !welcomeUuid) {
    return <LoadingModal visible={true} />;
  }

  const revokeMagic = async () => {
    try {
      setLoading(true);
      await deleteMagicToken(circleId);
      await refetchMagicToken();
    } finally {
      setLoading(false);
    }
  };

  const revokeWelcome = async () => {
    try {
      setLoading(true);
      await deleteWelcomeToken(circleId);
      await refetchWelcomeToken();
    } finally {
      setLoading(false);
    }
  };

  const magicLink = APP_URL + '/join/' + magicLinkUuid;
  const welcomeLink = APP_URL + '/welcome/' + welcomeUuid;

  return (
    <>
      <LoadingModal visible={loading} />
      <AddMembersContents
        circle={circle}
        welcomeLink={welcomeLink}
        magicLink={magicLink}
        revokeMagic={revokeMagic}
        revokeWelcome={revokeWelcome}
      />
    </>
  );
};

const AddMembersContents = ({
  circle,
  welcomeLink,
  magicLink,
  // revokeMagic, TODO: add revoke in a later PR when UI is better defined
  revokeWelcome,
}: {
  circle: ICircle;
  welcomeLink: string;
  magicLink: string;
  revokeMagic(): void;
  revokeWelcome(): void;
}) => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ETH);

  const [preloadedMembers, setPreloadedMembers] = useState<NewMember[]>([]);

  const addMembersFromCSV = (newMembers: NewMember[]) => {
    // Switch to ETH tab, set the preloaded values
    setPreloadedMembers(newMembers);
    setCurrentTab(Tab.ETH);
  };

  useEffect(() => {
    if (currentTab != Tab.ETH) {
      // reset the preloaded members
      setPreloadedMembers([]);
    }
  }, [currentTab]);

  return (
    <SingleColumnLayout>
      <Box>
        <AppLink to={paths.members(circle.id)}>
          <BackButton />
        </AppLink>
      </Box>

      <Flex css={{ alignItems: 'center', mb: '$sm' }}>
        <Text h1>Add Members to {circle.name}</Text>
      </Flex>
      <Box css={{ mb: '$md' }}>
        <Text inline>
          Note that after adding members you can see and manage them in the
          <AppLink to={paths.members(circle.id)} css={{ display: 'inline' }}>
            &nbsp;members table.
          </AppLink>
        </Text>
      </Box>
      <Flex css={{ mb: '$sm' }}>
        <TabButton
          tab={Tab.ETH}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          ETH Address
        </TabButton>
        <TabButton
          tab={Tab.LINK}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          Magic Link
        </TabButton>
        <TabButton
          tab={Tab.CSV}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          CSV Import
        </TabButton>
      </Flex>

      <Box
        css={{
          width: '70%',
          '@md': {
            width: '100%',
          },
        }}
      >
        <Panel>
          {currentTab === Tab.ETH && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }} size="large">
                Add new members by wallet address.
              </Text>
              <NewMemberList
                circleId={circle.id}
                welcomeLink={welcomeLink}
                revokeWelcome={revokeWelcome}
                preloadedMembers={preloadedMembers}
              />
            </Box>
          )}
          {currentTab === Tab.LINK && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }} size="large">
                Add new members by sharing a magic link.
              </Text>
              <MagicLink magicLink={magicLink} />
            </Box>
          )}
          {currentTab === Tab.CSV && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }} size="large">
                Please import a .CSV file with only these two columns: Name,
                Address. &nbsp;
                <a href="/resources/example.csv" download>
                  Download Sample CSV
                </a>
              </Text>
              <CSVImport addNewMembers={addMembersFromCSV} />
            </Box>
          )}

          <Box css={{ mt: '$md' }}>
            <HintButton
              href={
                'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/admin-best-practices#ways-to-give'
              }
            >
              Documentation: GIVE Circle Best Practices
            </HintButton>
          </Box>
        </Panel>
      </Box>
    </SingleColumnLayout>
  );
};

export default AddMembersPage;
