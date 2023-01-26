import React, { useEffect, useState } from 'react';

import { LoadingModal } from '../../components';
import { paths } from '../../routes/paths';
import { ICircle } from '../../types';
import { APP_URL } from '../../utils/domain';
import { useSelectedCircle } from 'recoilState/app';
import { AppLink, Box, ContentHeader, Flex, Link, Panel, Text } from 'ui';
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

  const magicLink = APP_URL + paths.join(magicLinkUuid);
  const welcomeLink = APP_URL + paths.invite(welcomeUuid);

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
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Add Members to {circle.name}</Text>
          <Text p as="p">
            Note that after adding members you can see and manage them in the{' '}
            <AppLink inlineLink to={paths.members(circle.id)}>
              members table.
            </AppLink>
          </Text>
        </Flex>
      </ContentHeader>

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
              <Text css={{ pb: '$lg', pt: '$sm' }}>
                Please import a .CSV file with only these two columns: Name,
                Address. &nbsp;
                <Link inlineLink href="/resources/example.csv" download>
                  Download Sample CSV
                </Link>
              </Text>
              <CSVImport addNewMembers={addMembersFromCSV} />
            </Box>
          )}

          <Box css={{ mt: '$md' }}>
            <Link
              inlineLink
              target="_blank"
              rel="noreferrer"
              href={
                'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/admin-best-practices#ways-to-give'
              }
            >
              Documentation: GIVE Circle Best Practices
            </Link>
          </Box>
        </Panel>
      </Box>
    </SingleColumnLayout>
  );
};

export default AddMembersPage;
