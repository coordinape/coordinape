import React, { useState } from 'react';

import { updateUser } from 'lib/gql/mutations';
import { useMutation, useQuery } from 'react-query';

import { ApeInfoTooltip } from '../../components';
import { Check, X } from '../../icons/__generated';
import {
  Avatar,
  Box,
  Flex,
  Panel,
  Text,
  TextArea,
  ToggleButton,
} from '../../ui';

import { Member } from './';
import { Contribution } from './Contribution';
import { getContributionsForEpoch } from './queries';
import { SavingIndicator } from './SavingIndicator';

import { IMyUser } from 'types';

type StatementDrawerProps = {
  myUser: IMyUser;
  member: Member;
  userIsOptedOut: boolean;
  updateNonReceiver: (b: boolean) => void;
  isNonReceiverMutationLoading: boolean;
  start_date: Date;
  end_date: Date;
  setOptOutOpen: (b: boolean) => void;
};

// GiveDrawer is the focused modal drawer to give/note/view contributions for one member
export const EpochStatementDrawer = ({
  myUser,
  member,
  userIsOptedOut,
  updateNonReceiver,
  isNonReceiverMutationLoading,
  start_date,
  end_date,
  setOptOutOpen,
}: StatementDrawerProps) => {
  // fetch the contributions for this particular member
  const { data: contributions } = useQuery(
    ['allocate-contributions', member.id],
    () =>
      getContributionsForEpoch({
        circleId: member.circle_id,
        userId: member.id,
        start_date,
        end_date,
      }),
    {
      enabled: !!member,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  // statement is the current state of the epoch statement
  const [statement, setStatement] = useState(member.bio || '');

  // saveTimeout is the timeout handle for the buffered async saving
  const [saveTimeout, setSaveTimeout] =
    useState<ReturnType<typeof setTimeout>>();
  const [saving, setSaving] = useState<boolean | undefined>();

  const { mutate: updateEpochStatement } = useMutation(
    async (bio: string) => updateUser({ circle_id: member.circle_id, bio }),
    { onSuccess: () => setSaving(false) }
  );

  // update the statement in the to level page state
  const saveStatement = (bio: string) => {
    setSaving(true);
    updateEpochStatement(bio);
  };

  // statementChanged schedules a save to the underlying state in the parent component, clearing any pending save
  const statementChanged = (newStatement: string) => {
    setStatement(newStatement);
    if (saveTimeout) {
      setSaving(undefined);
      clearTimeout(saveTimeout);
    }
    // only save every 1s , if user increments or edits statement, delay 1s
    setSaveTimeout(setTimeout(() => saveStatement(newStatement), 1000));
  };

  return (
    <Box css={{ height: '100%', pt: '$md' }}>
      <Flex
        css={{
          pt: '$xl',
          display: 'grid',
          width: '100%',
          gridTemplateColumns: '1fr',
        }}
      >
        <Flex
          css={{
            flexGrow: 1,
            minWidth: 0,
            mb: '$md',
            justifyContent: 'space-between',
          }}
          alignItems="center"
        >
          <Flex>
            <Avatar
              size="small"
              name={member.name}
              path={member.profile.avatar}
              margin="none"
              css={{ mr: '$sm' }}
            />
            <Text ellipsis h3 semibold>
              {member.name}
            </Text>
          </Flex>
          <Flex>
            {myUser.fixed_non_receiver ? (
              <Text variant="label">
                You are blocked from receiving {myUser.circle.tokenName}
              </Text>
            ) : (
              <>
                <Text variant="label" css={{ mr: '$md' }}>
                  Receive Give?
                  <ApeInfoTooltip>
                    Choose no if you want to opt-out from receiving{' '}
                    {myUser.circle.tokenName}
                  </ApeInfoTooltip>
                </Text>
                <ToggleButton
                  color="complete"
                  css={{ mr: '$sm' }}
                  active={!userIsOptedOut}
                  disabled={isNonReceiverMutationLoading || !userIsOptedOut}
                  onClick={e => {
                    e.stopPropagation();
                    updateNonReceiver(false);
                  }}
                >
                  <Check size="lg" /> Yes
                </ToggleButton>
                <ToggleButton
                  color="destructive"
                  active={userIsOptedOut}
                  disabled={isNonReceiverMutationLoading || userIsOptedOut}
                  onClick={e => {
                    e.stopPropagation();
                    myUser.give_token_received > 0
                      ? setOptOutOpen(true)
                      : updateNonReceiver(true);
                  }}
                >
                  <X size="lg" /> No
                </ToggleButton>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Box css={{ mt: '$xl' }}>
        <Box>
          <Text inline semibold size="large" css={{ mr: '$xs' }}>
            Epoch Statement
          </Text>
          {/*<ApeInfoTooltip>*/}
          {/*  Not sure what goes here yet */}
          {/*</ApeInfoTooltip>*/}
        </Box>
        <TextArea
          css={{
            backgroundColor: 'white',
            width: '100%',
            mt: '$xs',
            mb: '$md',
          }}
          value={statement}
          onChange={e => statementChanged(e.target.value)}
          placeholder="Summarize your Contributions"
        />
        <Flex css={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <SavingIndicator needToSave={saving} css={{ mr: '$md' }} />
        </Flex>
      </Box>

      <Box
        css={{
          borderTop: '0.5px solid $secondaryText',
          mt: '$lg',
          pt: '$lg',
        }}
      >
        <Text semibold size="large">
          Contributions
        </Text>
        <Box css={{ pb: '$lg', mt: '$sm' }}>
          {!contributions && (
            // TODO: Better loading indicator here -g
            <Box>Loading...</Box>
          )}
          {contributions &&
            (contributions.length == 0 ? (
              <>
                <Box>
                  <Text inline color="neutral">
                    <Text semibold inline color="neutral">
                      {member.name}{' '}
                    </Text>
                    has no contributions recorded for this epoch
                  </Text>
                </Box>

                <Panel info css={{ mt: '$md' }}>
                  <Text p>
                    Contributions are coming soon! Members will be able to share
                    automatic contributions from integrated apps and journal
                    contributions as they happen.
                  </Text>
                </Panel>
              </>
            ) : (
              contributions.map(c => (
                <Contribution key={c.id} contribution={c} />
              ))
            ))}
        </Box>
      </Box>
    </Box>
  );
};
