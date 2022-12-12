import React, { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import dedent from 'dedent';
import { updateCircle } from 'lib/gql/mutations';
import { isUserAdmin } from 'lib/users';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import * as z from 'zod';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { useSelectedCircle } from '../../recoilState';
import { LoadingModal, FormInputField } from 'components';
import { useApeSnackbar } from 'hooks';
import {
  useContributions,
  Contribution as IntegrationContribution,
} from 'hooks/useContributions';
import {
  DeworkColor,
  WonderColor,
  ChevronDown,
  ChevronUp,
  Trash2,
  ChevronsRight,
  Edit,
  Edit3,
} from 'icons/__generated';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from 'pages/GivePage/EpochStatementDrawer';
import {
  Panel,
  Text,
  Box,
  Modal,
  Button,
  Flex,
  MarkdownPreview,
  Link,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { SavingIndicator, SaveState } from 'ui/SavingIndicator';

import { ContributionIntro } from './ContributionIntro';
import { ContributionPanel } from './ContributionPanel';
import { ContributionRow } from './ContributionRow';
import {
  deleteContributionMutation,
  updateContributionMutation,
  createContributionMutation,
} from './mutations';
import { PlaceholderContributions } from './PlaceholderContributions';
import {
  getContributionsAndEpochs,
  ContributionsAndEpochs,
  Contribution,
  Epoch,
} from './queries';
import {
  getCurrentEpoch,
  getNewContribution,
  getEpochLabel,
  createLinkedArray,
  LinkedElement,
  jumpToEpoch,
  isEpochCurrentOrLater,
} from './util';

const schema = z.object({
  team_sel_text: z

    .string()
    .max(500)
    .refine(val => val.trim().length >= 1, {
      message: 'Please write something',
    }),
});
type contributionTextSchema = z.infer<typeof schema>;

const DEBOUNCE_TIMEOUT = 1000;

const NEW_CONTRIBUTION_ID = 0;

const nextPrevCss = {
  color: '$text',
  padding: '0',
  minHeight: '32px',
  height: '32px',
  width: '32px',
  mr: '$sm',
  borderRadius: '$2',
  alignItems: 'center',
  '> svg': {
    mr: 0,
  },
};

type LinkedContributionsAndEpochs = {
  contributions: Array<LinkedElement<Contribution>>;
  epochs: Array<LinkedElement<Epoch>>;
  users: ContributionsAndEpochs['users'];
};

type CurrentContribution = {
  contribution: LinkedElement<Contribution>;
  epoch: LinkedElement<Epoch>;
};
type CurrentIntContribution = {
  contribution: IntegrationContribution;
  epoch?: LinkedElement<Epoch>;
};

const contributionIcon = (source: string) => {
  switch (source) {
    case 'wonder':
      return <WonderColor css={{ mr: '$md' }} />;
    default:
      return <DeworkColor css={{ mr: '$md' }} />;
  }
};
const contributionSource = (source: string) => {
  switch (source) {
    case 'wonder':
      return 'Wonder';
    default:
      return 'Dework';
  }
};
const ContributionsPage = () => {
  const address = useConnectedAddress();
  const { circle: selectedCircle, myUser: me } = useSelectedCircle();
  const [modalOpen, setModalOpen] = useState(false);
  const [editHelpText, setEditHelpText] = useState(false);

  const [saveState, setSaveState] = useState<{ [key: number]: SaveState }>({});
  const [currentContribution, setCurrentContribution] =
    useState<CurrentContribution | null>(null);
  const [currentIntContribution, setCurrentIntContribution] =
    useState<CurrentIntContribution | null>(null);

  const [showMarkdown, setShowMarkDown] = useState<boolean>(true);

  const queryClient = useQueryClient();
  const { showError } = useApeSnackbar();

  const {
    data,
    refetch: refetchContributions,
    dataUpdatedAt,
  } = useQuery(
    ['contributions', selectedCircle.id],
    () =>
      getContributionsAndEpochs({
        circleId: selectedCircle.id,
        userAddress: address,
      }),
    {
      enabled: !!(selectedCircle.id && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      select: data => {
        return {
          ...data,
          contributions: createLinkedArray(data.contributions),
          epochs: createLinkedArray(data.epochs),
        };
      },
    }
  );
  const [updatedTeamSelText, setUpdatedTeamSelText] = useState<
    string | undefined
  >();

  const { control, reset, resetField, setValue } = useForm({ mode: 'all' });
  const { control: contributionTextControl, handleSubmit } =
    useForm<contributionTextSchema>({
      resolver: zodResolver(schema),
      mode: 'all',
    });
  const isAdmin = isUserAdmin(me);
  const onSubmit: SubmitHandler<contributionTextSchema> = async data => {
    try {
      await updateCircle({
        circle_id: selectedCircle.id,
        team_sel_text: data.team_sel_text,
      });
      setUpdatedTeamSelText(data.team_sel_text);
    } catch (e) {
      showError(e);
      console.warn(e);
    }
    setEditHelpText(false);
  };

  useEffect(() => {
    // once we become buffering, we need to schedule
    // this protection of state change in useEffect allows us to fire this only once
    // so requests don't stack up
    if (saveState[currentContribution?.contribution.id] == 'buffering') {
      updateSaveStateForContribution(
        currentContribution?.contribution.id,
        'scheduled'
      );
      // Should we cancel this too????
      handleDebouncedDescriptionChange(
        saveContribution,
        descriptionField.value
      );
    }
  }, [
    currentContribution?.contribution.id,
    saveState[currentContribution?.contribution.id],
  ]);

  const { field: descriptionField } = useController({
    name: 'description',
    control,
  });

  const { mutate: createContribution, reset: resetCreateMutation } =
    useMutation(createContributionMutation, {
      onSuccess: newContribution => {
        refetchContributions();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
        if (newContribution.insert_contributions_one) {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          setCurrentContribution({
            contribution: {
              ...newContribution.insert_contributions_one,
              description: descriptionField.value as string,
              next: () => data?.contributions[NEW_CONTRIBUTION_ID],
              prev: () => undefined,
              idx: 0,
            },
            epoch: getCurrentEpoch(data?.epochs ?? []),
          });

          if (
            // invoke resetField() value if current form is up to date
            descriptionField?.value ==
            newContribution.insert_contributions_one.description
          ) {
            resetField('description', {
              defaultValue:
                newContribution.insert_contributions_one.description,
            });
            updateSaveStateForContribution(
              newContribution.insert_contributions_one.id,
              'saved'
            );
          } else {
            updateSaveStateForContribution(
              newContribution.insert_contributions_one.id,
              'buffering'
            );
          }
        } else {
          updateSaveStateForContribution(NEW_CONTRIBUTION_ID, 'stable');
          resetCreateMutation();
        }
      },
    });

  const { mutate: mutateContribution, reset: resetUpdateMutation } =
    useMutation(updateContributionMutation, {
      mutationKey: ['updateContribution', currentContribution?.contribution.id],
      onError: (errors, { id }) => {
        updateSaveStateForContribution(id, 'error');
      },
      onSuccess: ({ updateContribution }, { id }) => {
        refetchContributions();
        updateSaveStateForContribution(id, 'saved');
        if (
          currentContribution &&
          updateContribution?.updateContribution_Contribution
        ) {
          setCurrentContribution({
            ...currentContribution,
            contribution: {
              ...currentContribution.contribution,
              description:
                updateContribution.updateContribution_Contribution.description,
            },
          });
        }
      },
    });

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution', currentContribution?.contribution.id],
      onSuccess: data => {
        setModalOpen(false);
        setCurrentContribution(null);
        refetchContributions();
        updateSaveStateForContribution(data.contribution_id, 'stable');
        reset();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
      },
    }
  );

  const saveContribution = useMemo(() => {
    return (value: string) => {
      if (!currentContribution) return;
      currentContribution.contribution.id === NEW_CONTRIBUTION_ID
        ? createContribution({
            user_id: currentUserId,
            circle_id: selectedCircle.id,
            description: value,
          })
        : mutateContribution({
            id: currentContribution.contribution.id,
            datetime_created: currentContribution.contribution.datetime_created,
            description: value,
          });
    };
  }, [currentContribution?.contribution.id]);

  // We need to instantiate exactly one debounce function for each newly
  // mounted currentContribution so it can be cancelled. Otherwise,
  // the handle of a live function is lost on re-render and we cannot
  // cancel the call when a bunch of typing is happening
  const handleDebouncedDescriptionChange = useMemo(
    () =>
      debounce((s: typeof saveContribution, v: string) => {
        updateSaveStateForContribution(
          currentContribution?.contribution.id,
          'saving'
        );
        s(v);
      }, DEBOUNCE_TIMEOUT),
    [currentContribution?.contribution.id]
  );

  const updateSaveStateForContribution = (
    id: number | undefined,
    saveState: SaveState
  ) => {
    if (id == undefined) {
      return;
    }
    setSaveState(prevState => {
      const newState = { ...prevState };
      newState[id] = saveState;
      return newState;
    });
  };

  // prevents page re-renders when typing out a contribution
  // This seems pretty silly but it's actually a huge optimization
  // when 30+ contributions are on the page
  const memoizedEpochData = useMemo(() => {
    if (!data) return data;
    const returnData: typeof data = { ...data };
    const currentEpoch = getCurrentEpoch(data?.epochs || []);
    if (currentEpoch.id === 0 && data?.epochs)
      returnData.epochs = createLinkedArray([currentEpoch, ...data.epochs]);

    return returnData;
  }, [dataUpdatedAt]);

  const activeContributionFn = useMemo(
    () =>
      (
        epoch: LinkedElement<Epoch>,
        contribution?: LinkedElement<Contribution>,
        integrationContributions?: IntegrationContribution
      ) => {
        if (contribution) {
          setCurrentContribution({ contribution, epoch });
          setCurrentIntContribution(null);
          resetField('description', {
            defaultValue: contribution.description,
          });
        } else if (integrationContributions) {
          setCurrentIntContribution({
            contribution: integrationContributions,
            epoch,
          });
          setCurrentContribution(null);
        }

        setModalOpen(true);
      },
    []
  );
  /// Return here if we don't have the data so that the actual page component can be simpler
  if (!memoizedEpochData) {
    return <LoadingModal visible />;
  }
  const currentUserId: number = memoizedEpochData.users[0]?.id;

  const closeDrawer = () => {
    setModalOpen(false);
    setShowMarkDown(true);
    setCurrentContribution(null);
    setCurrentIntContribution(null);
    resetCreateMutation();
    resetUpdateMutation();
    reset();
  };
  const newContribution = () => {
    setCurrentContribution({
      contribution: getNewContribution(
        currentUserId,
        memoizedEpochData.contributions[0]
      ),
      epoch: getCurrentEpoch(memoizedEpochData.epochs),
    });
    resetField('description', { defaultValue: '' });
    resetCreateMutation();
    setModalOpen(true);
    setShowMarkDown(false);
  };

  return (
    <>
      <SingleColumnLayout>
        <Text h1>Contributions</Text>
        <Flex
          alignItems="end"
          css={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '$md',
            width: '60%',
            '@sm': { width: '100%' },
          }}
        >
          {!editHelpText ? (
            <Flex
              css={{
                gap: '$md',
                alignItems: 'center',
                '@sm': { flexDirection: 'column', alignItems: 'start' },
              }}
            >
              <Text p as="p">
                {updatedTeamSelText
                  ? updatedTeamSelText
                  : data?.circles_by_pk?.team_sel_text
                  ? data?.circles_by_pk?.team_sel_text
                  : 'What have you been working on?'}
                {isAdmin && (
                  <Link
                    href="#"
                    iconLink
                    onClick={() => {
                      setEditHelpText(true);
                    }}
                    css={{ whiteSpace: 'nowrap', ml: '$sm' }}
                  >
                    <Edit3 />
                    Edit
                  </Link>
                )}
              </Text>
            </Flex>
          ) : (
            <Flex
              css={{
                gap: '$md',
                alignItems: 'flex-start',
                flexGrow: 1,
                '@sm': { flexDirection: 'column' },
              }}
            >
              <FormInputField
                name="team_sel_text"
                id="finish_work"
                control={contributionTextControl}
                defaultValue={data?.circles_by_pk?.team_sel_text}
                label="Contribution Help Text"
                placeholder="Default: 'What have you been working on?'"
                infoTooltip="Change the text that contributors see on this page."
                showFieldErrors
                css={{
                  width: '100%',
                }}
              />
              <Flex css={{ gap: '$sm', mt: '$lg', '@sm': { mt: 0 } }}>
                <Button
                  outlined
                  color="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
                <Button
                  outlined
                  color="destructive"
                  onClick={() => {
                    setEditHelpText(false);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>
        {(memoizedEpochData.contributions || []).length === 0 && (
          <ContributionIntro />
        )}

        <EpochGroup
          contributions={memoizedEpochData.contributions || []}
          epochs={memoizedEpochData.epochs || []}
          currentContribution={currentContribution}
          setActiveContribution={activeContributionFn}
          userAddress={address}
          addContributionClickHandler={newContribution}
        />
      </SingleColumnLayout>
      <Modal
        drawer
        showClose={false}
        open={modalOpen}
        onOpenChange={() => {
          closeDrawer();
        }}
      >
        <Panel invertForm css={{ p: 0 }}>
          {currentContribution ? (
            <>
              <Flex
                alignItems="center"
                css={{ justifyContent: 'space-between' }}
              >
                <Flex alignItems="center">
                  <Button
                    onClick={() => {
                      closeDrawer();
                    }}
                    color="textOnly"
                    noPadding
                    css={{ mr: '$lg' }}
                  >
                    <ChevronsRight size="lg" />
                  </Button>
                  <Button
                    color="white"
                    size="large"
                    css={nextPrevCss}
                    disabled={
                      currentContribution.contribution.prev() === undefined
                    }
                    onClick={() => {
                      const prevContribution =
                        currentContribution.contribution.prev();
                      if (!prevContribution) return;
                      prevContribution.next = () => ({
                        ...currentContribution.contribution,
                        description: descriptionField.value,
                      });
                      setCurrentContribution({
                        contribution: prevContribution,
                        epoch: jumpToEpoch(
                          currentContribution.epoch,
                          prevContribution.datetime_created
                        ),
                      });
                      resetField('description', {
                        defaultValue: prevContribution.description,
                      });
                    }}
                  >
                    <ChevronUp size="lg" />
                  </Button>
                  <Button
                    color="white"
                    css={nextPrevCss}
                    disabled={
                      currentContribution.contribution.next() === undefined
                    }
                    onClick={() => {
                      const nextContribution =
                        currentContribution.contribution.next();
                      if (!nextContribution) return;
                      nextContribution.prev = () => ({
                        ...currentContribution.contribution,
                        description: descriptionField.value,
                      });
                      setCurrentContribution({
                        contribution: nextContribution,
                        epoch: jumpToEpoch(
                          currentContribution.epoch,
                          nextContribution.datetime_created
                        ),
                      });
                      resetField('description', {
                        defaultValue: nextContribution.description,
                      });
                    }}
                  >
                    <ChevronDown size="lg" />
                  </Button>
                </Flex>
                <Button
                  color="textOnly"
                  noPadding
                  disabled={!currentContribution.contribution.id}
                  onClick={() => {
                    handleDebouncedDescriptionChange.cancel();
                    deleteContribution({
                      contribution_id: currentContribution.contribution.id,
                    });
                  }}
                >
                  <Trash2 />
                </Button>
              </Flex>
              <Flex column css={{ my: '$xl' }}>
                <Flex
                  alignItems="center"
                  css={{
                    mb: '$sm',
                    justifyContent: 'space-between',
                  }}
                >
                  <Flex>
                    <Text
                      h3
                      semibold
                      css={{
                        mr: '$md',
                      }}
                    >
                      {currentContribution.epoch.id
                        ? renderEpochDate(currentContribution.epoch)
                        : 'Latest'}
                    </Text>
                    {getEpochLabel(currentContribution.epoch)}
                  </Flex>
                  {isEpochCurrentOrLater(currentContribution.epoch) && (
                    <SavingIndicator
                      saveState={saveState[currentContribution.contribution.id]}
                      retry={() => {
                        saveContribution(descriptionField.value);
                        refetchContributions();
                      }}
                    />
                  )}
                </Flex>
                <Text size="medium" css={{ fontWeight: '$medium' }}>
                  {currentContribution.epoch.description}
                </Text>
              </Flex>
              <Flex column css={{ gap: '$sm' }}>
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <Text inline semibold size="large">
                    Contribution
                  </Text>
                  <Text variant="label">
                    {DateTime.fromISO(
                      currentContribution.contribution.datetime_created
                    ).toFormat('LLL dd')}
                  </Text>
                </Flex>
                {isEpochCurrentOrLater(currentContribution.epoch) ? (
                  showMarkdown ? (
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
                      <MarkdownPreview source={descriptionField.value} />
                    </Box>
                  ) : (
                    <Box css={{ position: 'relative' }}>
                      <FormInputField
                        id="description"
                        name="description"
                        control={control}
                        css={{
                          textarea: {
                            resize: 'vertical',
                            pb: '$xl',
                            minHeight: 'calc($2xl * 2)',
                          },
                        }}
                        defaultValue={
                          currentContribution.contribution.description
                        }
                        areaProps={{
                          autoFocus: true,
                          onChange: e => {
                            setValue('description', e.target.value);
                            // Don't schedule a new save if a createContribution
                            // request is inflight, since this will create
                            // a duplicate contribution
                            if (
                              !(
                                currentContribution.contribution.id ===
                                  NEW_CONTRIBUTION_ID &&
                                saveState[
                                  currentContribution.contribution.id
                                ] == 'saving'
                              )
                            )
                              updateSaveStateForContribution(
                                currentContribution.contribution.id,
                                'buffering'
                              );
                          },
                          onBlur: () => {
                            if (descriptionField.value.length > 0)
                              setShowMarkDown(true);
                          },
                          onFocus: e => {
                            e.currentTarget.setSelectionRange(
                              e.currentTarget.value.length,
                              e.currentTarget.value.length
                            );
                          },
                        }}
                        disabled={
                          !isEpochCurrentOrLater(currentContribution.epoch)
                        }
                        placeholder="What have you been working on?"
                        textArea
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
                  )
                ) : (
                  <Panel nested>
                    <MarkdownPreview
                      source={currentContribution.contribution.description}
                    />
                  </Panel>
                )}

                <Flex css={{ justifyContent: 'flex-end', mt: '$md' }}>
                  <Button
                    color="primary"
                    onClick={newContribution}
                    // adding onMouseDown because the onBlur event on the markdown-ready textarea was preventing onClick
                    onMouseDown={newContribution}
                  >
                    <Edit />
                    New
                  </Button>
                </Flex>
              </Flex>
            </>
          ) : currentIntContribution ? (
            <>
              <Flex column css={{ my: '$xl' }}>
                <Text h2 css={{ gap: '$md', mb: '$sm' }}>
                  {currentIntContribution.epoch
                    ? renderEpochDate(currentIntContribution.epoch)
                    : 'Latest'}
                  {getEpochLabel(currentIntContribution.epoch)}
                </Text>
                <Text size="medium" css={{ fontWeight: '$medium' }}>
                  {currentIntContribution?.epoch?.description}
                </Text>
              </Flex>
              <Panel css={{ pl: '0 !important' }}>
                <Text p size="large" semibold css={{ color: '$headingText' }}>
                  {contributionSource(
                    currentIntContribution.contribution.source
                  )}
                </Text>
              </Panel>
              <Panel nested>
                <Link
                  target="_blank"
                  href={currentIntContribution.contribution.link}
                >
                  {contributionIcon(currentIntContribution.contribution.source)}
                  {currentIntContribution.contribution.title}
                </Link>
              </Panel>
            </>
          ) : (
            <></>
          )}
        </Panel>
      </Modal>
    </>
  );
};

type SetActiveContributionProps = {
  setActiveContribution: (
    e: LinkedElement<Epoch>,
    c?: LinkedElement<Contribution>,
    intC?: IntegrationContribution
  ) => void;
  currentContribution: CurrentContribution | null;
};
const monthsEqual = (start: string, end: string) =>
  DateTime.fromISO(start).month === DateTime.fromISO(end).month;

const yearCurrent = (end: string) =>
  DateTime.fromISO(end).year === DateTime.now().year;

/*
 * Dynamically adds month prefixes if the end month differs from the start
 * month and year suffixes if the end year does not match the current year
 */
const renderEpochDate = (epoch: Epoch) =>
  dedent`
  ${DateTime.fromISO(epoch.start_date).toFormat('LLL dd')} -
    ${DateTime.fromISO(epoch.end_date).toFormat(
      (monthsEqual(epoch.start_date, epoch.end_date) ? '' : 'LLL ') +
        'dd' +
        (yearCurrent(epoch.end_date) ? '' : ' yyyy')
    )}
  `;

const contributionFilterFn =
  ({ start, end }: { start?: string; end: string }) =>
  (c: Contribution) => {
    const startDate = start ?? DateTime.fromSeconds(0).toISO();
    return c.datetime_created > startDate && c.datetime_created < end;
  };

const EpochGroup = React.memo(function EpochGroup({
  contributions,
  epochs,
  currentContribution,
  setActiveContribution,
  userAddress,
  addContributionClickHandler,
}: Omit<LinkedContributionsAndEpochs, 'users'> &
  SetActiveContributionProps & {
    userAddress?: string;
    addContributionClickHandler: () => void;
  }) {
  return (
    <Flex column css={{ gap: '$1xl' }}>
      {epochs.map((epoch, idx, epochArray) => (
        <Box key={epoch.id}>
          <Flex column css={{ gap: '$sm' }}>
            <Flex
              alignItems="center"
              css={{
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '$md',
              }}
            >
              <Text h2 bold css={{ gap: '$md' }}>
                {epoch.id === 0 ? 'Latest' : renderEpochDate(epoch)}
                {getEpochLabel(epoch)}
              </Text>
              {idx === 0 && (
                <Button
                  outlined
                  color="primary"
                  onClick={addContributionClickHandler}
                >
                  Add Contribution
                </Button>
              )}
            </Flex>
            {epoch.description && (
              <Text size="medium" css={{ fontWeight: '$medium' }}>
                {epoch.description}
              </Text>
            )}
          </Flex>
          <ContributionPanel>
            <ContributionList
              contributions={contributions.filter(
                contributionFilterFn({
                  start: epochArray[idx + 1]?.end_date,
                  end: epoch.end_date,
                })
              )}
              currentContribution={currentContribution}
              setActiveContribution={setActiveContribution}
              epoch={epoch}
              userAddress={userAddress}
            />
          </ContributionPanel>

          {contributions.length == 0 && idx == 0 && (
            <PlaceholderContributions />
          )}
        </Box>
      ))}
    </Flex>
  );
});

type ContributionListProps = {
  contributions: Array<LinkedElement<Contribution>>;
  epoch: LinkedElement<Epoch>;
  userAddress?: string;
} & SetActiveContributionProps;
const ContributionList = ({
  epoch,
  contributions,
  setActiveContribution,
  currentContribution,
  userAddress,
}: ContributionListProps) => {
  // epochs are listed in chronologically descending order
  // so the next epoch in the array is the epoch that ended
  // before the one here
  const priorEpoch = epoch.next();
  const integrationContributions = useContributions({
    address: userAddress || '',
    startDate: priorEpoch
      ? priorEpoch.end_date
      : // add a buffer of time before the start date if this is the first epoch
        // Querying from epoch time 0 is apparently an unwelcome
        // practice for some integrators
        DateTime.fromISO(epoch.start_date).minus({ months: 1 }).toISO(),
    endDate: epoch.end_date,
    mock: false,
  });

  return (
    <>
      {contributions.length || integrationContributions?.length ? (
        <>
          {contributions.map(c => (
            <ContributionRow
              key={c.id}
              active={currentContribution?.contribution.id === c.id}
              description={c.description}
              datetime_created={c.datetime_created}
              onClick={() => {
                setActiveContribution(epoch, c, undefined);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveContribution(epoch, c, undefined);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            />
          ))}
          {integrationContributions?.map(c => (
            <Panel
              key={c.title}
              css={{
                border: '2px solid $border',
                cursor: 'pointer',
                background: 'white',
                '&:hover': {
                  background: '$highlight',
                  border: '2px solid $link',
                },
              }}
              nested
              onClick={() => {
                setActiveContribution(epoch, undefined, c);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveContribution(epoch, undefined, c);
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <Text
                ellipsis
                css={{
                  mr: '10px',
                  maxWidth: '60em',
                }}
              >
                {contributionIcon(c.source)}
                {c.title}
              </Text>
            </Panel>
          ))}
        </>
      ) : epoch.id !== 0 ? (
        <Text>You don&apos;t have any contributions in this epoch</Text>
      ) : (
        <Text>You don&apos;t have any contributions yet</Text>
      )}
    </>
  );
};

export default ContributionsPage;
