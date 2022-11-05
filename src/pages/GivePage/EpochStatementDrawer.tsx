import React, { useCallback, useEffect, useState } from 'react';

import MarkdownPreview from '@uiw/react-markdown-preview';
import { updateUser } from 'lib/gql/mutations';
import debounce from 'lodash/debounce';
import { useMutation, useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';

import { ApeInfoTooltip } from '../../components';
import { Check, X } from '../../icons/__generated';
import { paths } from 'routes/paths';
import { Avatar, Box, Button, Flex, Text, TextArea, ToggleButton } from 'ui';
import { SaveState, SavingIndicator } from 'ui/SavingIndicator';

import { Member } from './';
import { Contribution } from './Contribution';
import { getContributionsForEpoch } from './queries';

import { IMyUser } from 'types';

const DEBOUNCE_TIMEOUT = 1000;

export const QUERY_KEY_ALLOCATE_CONTRIBUTIONS = 'allocate-contributions';

type StatementDrawerProps = {
  myUser: IMyUser;
  member: Member;
  userIsOptedOut: boolean;
  updateNonReceiver: (b: boolean) => void;
  isNonReceiverMutationLoading: boolean;
  start_date: Date;
  end_date: Date;
  setOptOutOpen: (b: boolean) => void;
  setStatement: (s: string) => void;
  statement: string;
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
  statement,
  setStatement,
}: StatementDrawerProps) => {
  // fetch the contributions for this particular member
  const { data: contributions } = useQuery(
    [QUERY_KEY_ALLOCATE_CONTRIBUTIONS, member.id],
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

  // saveTimeout is the timeout handle for the buffered async saving
  const [saving, setSaving] = useState<SaveState>('stable');
  const [showMarkdown, setShowMarkDown] = useState<boolean>(true);

  const { mutate: updateEpochStatement } = useMutation(
    async (bio: string) => updateUser({ circle_id: member.circle_id, bio }),
    { onSettled: (data, error) => setSaving(error ? 'error' : 'saved') }
  );

  // update the statement in the to level page state
  const saveStatement = useCallback(
    (bio: string) => {
      setSaving('scheduled');
      updateEpochStatement(bio);
    },
    [setSaving, updateEpochStatement]
  );

  // statementChanged schedules a save to the underlying state in the parent component, clearing any pending save
  const statementChanged = (newStatement: string) => {
    setStatement(newStatement);
    setSaving('buffering');
    scheduleSaveStatement(saveStatement, newStatement);
  };

  // TODO: is this gonna not really debounce because of the statement dependency
  const scheduleSaveStatement = useCallback(
    debounce(
      // pass in the latest instantiations so we're saving the
      // newest state
      (s: typeof saveStatement, statement: string) => s(statement),
      DEBOUNCE_TIMEOUT
    ),
    [saveStatement]
  );

  useEffect(() => {
    if (!showMarkdown) {
      document?.getElementById('epoch_statement')?.focus();
    }
  }, [showMarkdown]);

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
            gap: '$md',
            '@sm': {
              flexDirection: 'column',
              alignItems: 'flex-start',
            },
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
      <Flex column css={{ mt: '$xl', gap: '$sm' }}>
        <Text inline semibold size="large">
          Epoch Statement
        </Text>
        {showMarkdown && !!statement.length ? (
          <Box
            onClick={() => {
              setShowMarkDown(false);
            }}
          >
            <MarkdownPreview source={sanitizeHtml(statement)} />
          </Box>
        ) : (
          <TextArea
            id="epoch_statement"
            autoSize
            css={{
              backgroundColor: 'white',
              width: '100%',
              fontSize: '$medium',
              whiteSpace: 'pre-wrap',
            }}
            value={statement}
            onChange={e => statementChanged(e.target.value)}
            placeholder="Summarize your Contributions"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            onBlur={() => {
              if (statement.length > 0) setShowMarkDown(true);
            }}
            onFocus={e => {
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              );
            }}
          />
        )}
        <Flex
          css={{ justifyContent: 'flex-end', alignItems: 'center', mt: '$sm' }}
        >
          <SavingIndicator
            saveState={saving}
            retry={() => {
              updateEpochStatement(statement);
            }}
          />
        </Flex>
      </Flex>

      <Box
        css={{
          borderTop: '0.5px solid $secondaryText',
          mt: '$lg',
          pt: '$lg',
        }}
      >
        <Flex css={{ justifyContent: 'space-between' }}>
          <Text semibold size="large">
            Contributions
          </Text>
          {contributions && contributions?.length == 0 && (
            <Button
              as={NavLink}
              to={paths.contributions(member.circle_id)}
              outlined
              size="small"
              color="primary"
            >
              Add Contribution
            </Button>
          )}
        </Flex>
        <Box css={{ pb: '$lg' }}>
          {!contributions && (
            // TODO: Better loading indicator here -g
            <Box>Loading...</Box>
          )}
          {contributions &&
            (contributions.length == 0 ? (
              <>
                <Box>
                  <Text inline color="neutral">
                    You have no contributions
                  </Text>
                </Box>
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
