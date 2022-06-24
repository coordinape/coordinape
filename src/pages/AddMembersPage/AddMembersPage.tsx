/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { LoadingModal } from '../../components';
import { Box } from '../../ui/Box/Box';
import { useSelectedCircle } from 'recoilState/app';
import { Button, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import {
  deleteMagicToken,
  deleteWelcomeToken,
  useMagicToken,
  useWelcomeToken,
} from './useCircleTokens';
import { ICircle } from '../../types';
import EthAndNameEntry from './NewMemberEntry';
import CopyCodeTextField from './CopyCodeTextField';
import TabButton, { Tab } from './TabButton';
import NewMemberList from './NewMemberList';
import { client } from '../../lib/gql/client';
import { useApeSnackbar } from '../../hooks';
import { normalizeError } from '../../utils/reporting';
import { WorkingIcon } from '../../ui/icons/WorkingIcon';
import { hostname } from 'os';
import { APP_URL } from '../../utils/domain';

export type NewMember = {
  address: string;
  name: string;
};

const AddMembersPage = () => {
  // const { isMobile } = useMobileDetect();
  const {
    circleId,
    // myUser: me,
    // users: visibleUsers,
    circle,
    // circleEpochsStatus: { epochs: epochsReverse },
  } = useSelectedCircle();

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

  // TODO: handle the hostname for local /staging
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
  revokeMagic,
  revokeWelcome,
}: {
  circle: ICircle;
  welcomeLink: string;
  magicLink: string;
  revokeMagic(): void;
  revokeWelcome(): void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ETH);
  const [newMembers, setNewMembers] = useState<NewMember[]>([
    {
      address: '',
      name: '',
    },
  ]);

  const [success, setSuccess] = useState<boolean>(false);

  const { showError } = useApeSnackbar();
  const submitNewMembers = async () => {
    try {
      setLoading(true);
      await client.mutate({
        createUsers: [
          {
            payload: {
              circle_id: circle.id,
              users: newMembers.filter(m => m.address != '' && m.name != ''),
            },
          },
          {
            __typename: true,
          },
        ],
      });
      // ok it worked, clear out?
      setSuccess(true);
    } catch (e) {
      showError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  };

  const [submittable, setSubmittable] = useState<boolean>(false);

  useEffect(() => {
    for (const m of newMembers) {
      if (m.name !== '' && m.address !== '') {
        // at least one good entry
        setSubmittable(true);
        return;
      }
    }
    setSubmittable(false);
  }, [newMembers]);

  return (
    <SingleColumnLayout>
      {loading && <LoadingModal visible={true} />}
      <Panel>
        <Flex css={{ alignItems: 'center', mb: '$sm' }}>
          <Text h1 css={{ my: '$xl' }}>
            Add Members to {circle.name}
          </Text>
        </Flex>
        <Flex css={{ mb: '$xl' }}>
          <TabButton
            tab={Tab.ETH}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          >
            ETH Address
          </TabButton>
          <TabButton
            tab={Tab.CSV}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          >
            CSV Import
          </TabButton>
          <TabButton
            tab={Tab.LINK}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          >
            Join Link
          </TabButton>
        </Flex>
        {currentTab === Tab.ETH && (
          <Box>
            <NewMemberList
              newMembers={newMembers}
              setNewMembers={setNewMembers}
            />
            {success && (
              <Box>
                WelcomeLink
                <Flex>
                  <Box css={{ flexGrow: 1, mr: '$md' }}>
                    <CopyCodeTextField value={welcomeLink} />
                  </Box>
                  <Button
                    color={'transparent'}
                    onClick={revokeWelcome}
                    css={{ padding: 0 }}
                  >
                    {/* TODO this styling is not lovely */}
                    <WorkingIcon size="md" color="neutral" />
                  </Button>
                </Flex>
              </Box>
            )}
            {!success && (
              <Box>
                <Button
                  disabled={!submittable || loading}
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={submitNewMembers}
                >
                  Add Members
                </Button>
              </Box>
            )}
          </Box>
        )}
        {currentTab === Tab.CSV && (
          <Box>
            <Box>CSV Import</Box>
            <Box>
              <div>
                WelcomeLink
                <CopyCodeTextField value={welcomeLink} />
                <Button onClick={revokeWelcome}>refr</Button>
              </div>
            </Box>
          </Box>
        )}
        {currentTab === Tab.LINK && (
          <>
            <div>
              MagicLink
              <CopyCodeTextField value={magicLink} />
              <Button onClick={revokeMagic}>refr</Button>
            </div>
          </>
        )}
      </Panel>
    </SingleColumnLayout>
  );
};

export default AddMembersPage;
