import React, { useState } from 'react';

import { LoadingModal } from '../../components';
import { isFeatureEnabled } from '../../config/features';
import { AlertSolid } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { ICircle } from '../../types';
import BackButton from '../../ui/BackButton';
import { Box } from '../../ui/Box/Box';
import HintButton from '../../ui/HintButton';
import { APP_URL } from '../../utils/domain';
import { useSelectedCircle } from 'recoilState/app';
import { AppLink, Flex, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import ConstrainedBox from './ConstrainedBox';
import CopyCodeTextField from './CopyCodeTextField';
import NewMemberList from './NewMemberList';
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
          tab={Tab.LINK}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          Magic Link
        </TabButton>
        <TabButton
          tab={Tab.ETH}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          ETH Address
        </TabButton>
        {isFeatureEnabled('csv_import') && (
          <TabButton
            tab={Tab.CSV}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          >
            CSV Import
          </TabButton>
        )}
      </Flex>
      <Panel>
        {currentTab === Tab.ETH && (
          <Box>
            <Text css={{ pb: '$lg', pt: '$sm' }} size={'large'}>
              Add new members by wallet address.
            </Text>

            <NewMemberList
              circleId={circle.id}
              welcomeLink={welcomeLink}
              revokeWelcome={revokeWelcome}
            />
          </Box>
        )}
        {currentTab === Tab.CSV && (
          <Box>
            <Box>CSV Import</Box>
          </Box>
        )}
        {currentTab === Tab.LINK && (
          <Box>
            <Text css={{ pb: '$lg', pt: '$sm' }} size="large">
              Add new members by sharing a magic link.
            </Text>
            <ConstrainedBox css={{ mb: '$md' }}>
              <Flex css={{ alignItems: 'center', mb: '$xs' }}>
                <Text variant="label">Magic Circle Link</Text>
              </Flex>
              <CopyCodeTextField value={magicLink} />

              <Panel alert css={{ mt: '$xl' }}>
                <Flex>
                  <AlertSolid
                    color="alert"
                    size="xl"
                    css={{
                      mr: '$md',
                      '& path': { stroke: 'none' },
                      flexShrink: 0,
                    }}
                  />
                  <Text size="large">
                    Anyone with this link can join this circle and set their
                    name. For added security, add new members using their wallet
                    addresses.
                  </Text>
                </Flex>
              </Panel>
            </ConstrainedBox>
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
    </SingleColumnLayout>
  );
};

export default AddMembersPage;
