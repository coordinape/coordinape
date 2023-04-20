import React, { useCallback, useEffect, useState } from 'react';

import { ActivityList } from 'features/activities/ActivityList';
import type { MyUser } from 'features/auth/useLoginData';
import { updateUser } from 'lib/gql/mutations';
import debounce from 'lodash/debounce';
import { useMutation, useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContributions } from 'hooks/useContributions';
import {
  Check,
  ChevronsRight,
  DeworkColor,
  WonderColor,
  X,
} from 'icons/__generated';
import { paths } from 'routes/paths';
import {
  InfoTooltip,
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  TextArea,
  ToggleButton,
  MarkdownPreview,
  Panel,
} from 'ui';
import { SaveState, SavingIndicator } from 'ui/SavingIndicator';

import { Member } from './';
import { getContributionsForEpoch } from './queries';

const DEBOUNCE_TIMEOUT = 1000;

export const QUERY_KEY_ALLOCATE_CONTRIBUTIONS = 'allocate-contributions';

const contributionIcon = (source: string) => {
  switch (source) {
    case 'wonder':
      return <WonderColor css={{ mr: '$md' }} />;
    default:
      return <DeworkColor css={{ mr: '$md' }} />;
  }
};

type StatementDrawerProps = {
  circleId: number;
  closeDrawer: () => void;
  end_date: Date;
  isNonReceiverMutationLoading: boolean;
  member: Member;
  myUser: MyUser;
  setOptOutOpen: (b: boolean) => void;
  setStatement: (s: string) => void;
  start_date: Date;
  statement: string;
  tokenName: string;
  updateNonReceiver: (b: boolean) => void;
  userIsOptedOut: boolean;
};

export const EpochStatementDrawer = ({
  circleId,
  closeDrawer,
  end_date,
  isNonReceiverMutationLoading,
  member,
  myUser,
  setOptOutOpen,
  setStatement,
  start_date,
  statement,
  tokenName,
  updateNonReceiver,
  userIsOptedOut,
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
  const integrationContributions = useContributions({
    address: member.address || '',
    startDate: start_date.toISOString(),
    endDate: end_date.toISOString(),
    circleId,
    mock: false,
  });

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
    if (!statement.length && showMarkdown) {
      setShowMarkDown(false);
    }
  }, []);

  return (
    <Box css={{ height: '100%' }}>
      <Button
        onClick={() => {
          closeDrawer();
        }}
        color="textOnly"
        noPadding
      >
        <ChevronsRight size="lg" />
      </Button>

      <Flex
        css={{
          flexGrow: 1,
          minWidth: 0,
          my: '$md',
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
            name={member.profile.name}
            path={member.profile.avatar}
            margin="none"
            css={{ mr: '$sm' }}
          />
          <Text ellipsis large semibold>
            {member.profile.name}
          </Text>
        </Flex>
        <Flex>
          {myUser.fixed_non_receiver ? (
            <Text variant="label">
              You are blocked from receiving {tokenName}
            </Text>
          ) : (
            <>
              <Text variant="label" css={{ mr: '$md' }}>
                Receive Give?
                <InfoTooltip>
                  Choose no if you want to opt-out from receiving {tokenName}
                </InfoTooltip>
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
      <Flex column css={{ mt: '$xl' }}>
        <Panel ghost invertForm css={{ gap: '$sm' }}>
          <Text inline semibold size="large">
            Epoch Statement
          </Text>
          {showMarkdown ? (
            <Box
              tabIndex={0}
              css={{ borderRadius: '$3' }}
              onClick={() => {
                setShowMarkDown(false);
              }}
              onKeyDown={e => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowMarkDown(false);
                }
              }}
            >
              <MarkdownPreview source={statement} />
            </Box>
          ) : (
            <Box css={{ position: 'relative' }}>
              <TextArea
                id="epoch_statement"
                autoSize
                css={{
                  resize: 'vertical',
                  pb: '$xl',
                  width: '100%',
                  minHeight: 'calc($2xl * 2)',
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
              <Text
                inline
                size="small"
                color="secondary"
                css={{
                  position: 'absolute',
                  right: '$sm',
                  bottom: '$sm',
                }}
              >
                Markdown Supported
              </Text>
            </Box>
          )}
          <Flex
            css={{
              mt: '$sm',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '$md',
              '@sm': { flexDirection: 'row-reverse' },
            }}
          >
            <SavingIndicator
              saveState={saving}
              retry={() => {
                updateEpochStatement(statement);
              }}
            />
          </Flex>
        </Panel>
      </Flex>

      <Box
        css={{
          borderTop: '1px solid $border',
          mt: '$lg',
          pt: '$lg',
        }}
      >
        <Flex css={{ justifyContent: 'space-between', mb: '$md' }}>
          <Text semibold size="large">
            Contributions
          </Text>
          {contributions && contributions?.length == 0 && (
            <Button
              as={NavLink}
              to={paths.contributions(member.circle_id)}
              size="small"
              color="secondary"
            >
              Add Contribution
            </Button>
          )}
        </Flex>
        <Box css={{ pb: '$lg' }}>
          {!contributions && <LoadingIndicator />}
          {contributions &&
            (contributions.length === 0 &&
            (!integrationContributions ||
              integrationContributions?.length === 0) ? (
              <Box>
                <Text inline color="neutral">
                  You have no contributions
                </Text>
              </Box>
            ) : (
              <ActivityList
                drawer
                queryKey={['give-contributions', member.profile.id]}
                where={{
                  _and: [
                    { action: { _eq: 'contributions_insert' } },
                    { actor_profile_id: { _eq: member.profile.id } },
                    { circle_id: { _eq: member.circle_id } },
                    { created_at: { _gt: start_date.toISOString() } },
                    { created_at: { _lt: end_date.toISOString() } },
                  ],
                }}
              />
            ))}
          <Box css={{ mt: '-$md' }}>
            {integrationContributions &&
              integrationContributions.length > 0 &&
              integrationContributions.map(c => (
                <Box key={c.link} css={{ pb: '$md' }}>
                  <Text
                    ellipsis
                    css={{
                      cursor: 'default',
                      backgroundColor: '$dim',
                      minHeight: 0,
                      borderRadius: '$1',
                      p: '$md',
                    }}
                  >
                    {contributionIcon(c.source)}
                    {c.title}
                  </Text>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
