import React, { useEffect, useState } from 'react';

import { LoadingModal } from '../../components';
import { paths } from '../../routes/paths';
import { ICircle } from '../../types';
import { APP_URL } from '../../utils/domain';
import { useSelectedCircle } from 'recoilState/app';
import { AppLink, Box, ContentHeader, Flex, Link, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import CSVImport from './CSVImport';
import InviteLink from './InviteLink';
import NewMemberList, { NewMember } from './NewMemberList';
import TabButton, { Tab } from './TabButton';
import {
  deleteInviteToken,
  deleteWelcomeToken,
  useInviteToken,
  useWelcomeToken,
} from './useCircleTokens';

const AddMembersPage = () => {
  const { circleId, circle } = useSelectedCircle();

  const [loading, setLoading] = useState<boolean>(false);

  const { data: inviteLinkUuid, refetch: fetchInviteToken } =
    useInviteToken(circleId);
  const { data: welcomeUuid, refetch: refetchWelcomeToken } =
    useWelcomeToken(circleId);

  // Wait for initial load, show nothing but loading modal
  if (!inviteLinkUuid || !welcomeUuid) {
    return <LoadingModal visible={true} />;
  }

  const revokeInvite = async () => {
    try {
      setLoading(true);
      await deleteInviteToken(circleId);
      await fetchInviteToken();
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

  const inviteLink = APP_URL + paths.join(inviteLinkUuid);
  const welcomeLink = APP_URL + paths.invite(welcomeUuid);

  return (
    <>
      <LoadingModal visible={loading} />
      <AddMembersContents
        circle={circle}
        welcomeLink={welcomeLink}
        inviteLink={inviteLink}
        revokeInvite={revokeInvite}
        revokeWelcome={revokeWelcome}
      />
    </>
  );
};

const AddMembersContents = ({
  circle,
  welcomeLink,
  inviteLink,
  // revokeInvite, TODO: add revoke in a later PR when UI is better defined
  revokeWelcome,
}: {
  circle: ICircle;
  welcomeLink: string;
  inviteLink: string;
  revokeInvite(): void;
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
          Invite Link
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
              <Text css={{ pb: '$lg', pt: '$sm' }} size="medium">
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
              <Text css={{ pb: '$lg', pt: '$sm' }} size="medium">
                Add new members by sharing an invite link.
              </Text>
              <InviteLink inviteLink={inviteLink} />
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
        </Panel>
        <Box css={{ mt: '$lg' }}>
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
      </Box>
    </SingleColumnLayout>
  );
};

export default AddMembersPage;
