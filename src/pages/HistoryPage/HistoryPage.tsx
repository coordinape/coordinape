import { useState, useMemo, useEffect } from 'react';

import { findMonthlyEndDate } from 'common-lib/epochs';
import { isUserAdmin } from 'lib/users';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { LoadingModal } from '../../components';
import HintBanner from '../../components/HintBanner';
import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_GET_STARTED_MEMBER,
  EXTERNAL_URL_GET_STARTED_TUTORIAL_VIDEO,
  paths,
} from '../../routes/paths';
import { Paginator } from 'components/Paginator';
import isFeatureEnabled from 'config/features';
import { useToast, useApiAdminCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Button,
  Text,
  Flex,
  Link,
  AppLink,
  Modal,
  ContentHeader,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CurrentEpochPanel } from './CurrentEpochPanel';
import { EndEpochDialog } from './EndEpochDialog';
import EpochForm from './EpochForm';
import { EpochPanel } from './EpochPanel';
import {
  getHistoryData,
  QueryPastEpoch,
  QueryFutureEpoch,
  QueryCurrentEpoch,
  QUERY_KEY_ACTIVE_HISTORY,
} from './getHistoryData';

const pageSize = 3;

export const HistoryPage = () => {
  const {
    circle: { id: circleId },
    myUser: { id: userId },
  } = useSelectedCircle();

  const query = useQuery(
    [QUERY_KEY_ACTIVE_HISTORY, circleId],
    () => getHistoryData(circleId, userId),
    { enabled: !!userId && !!circleId }
  );

  const circle = query.data;
  const me = circle?.users[0];

  const { deleteEpoch, updateEpoch } = useApiAdminCircle(circleId);

  const [editEpoch, setEditEpoch] = useState<QueryFutureEpoch | undefined>(
    undefined
  );
  const [endEpochDialog, setEndEpochDialog] = useState<boolean>(false);
  const [newEpoch, setNewEpoch] = useState<boolean>(false);
  const [epochToDelete, setEpochToDelete] = useState<
    QueryFutureEpoch | undefined
  >(undefined);
  const [open, setOpen] = useState(false);

  const futureEpochs = circle?.futureEpoch;

  const currentEpoch = circle?.currentEpoch[0];

  const pastEpochs = circle?.pastEpochs || [];

  // TODO fetch only data for page shown
  const [page, setPage] = useState(0);
  const shownPastEpochs = useMemo(
    () => pastEpochs.slice(page * pageSize, (page + 1) * pageSize),
    [pastEpochs, page]
  );
  const totalPages = Math.ceil(pastEpochs.length / pageSize);

  const unallocated = (!me?.non_giver && me?.give_token_remaining) || 0;

  const { showDefault, showSuccess } = useToast();

  const isAdmin = isUserAdmin(me);

  const closeFormHandler = () => {
    if (editEpoch) {
      if (endEpochDialog) {
        setEditEpoch(undefined);
        setEndEpochDialog(false);
        showSuccess('Epoch Ended');
      } else {
        setEditEpoch(undefined);
        showSuccess('Saved Changes');
      }
    } else {
      setNewEpoch(false);
      showDefault('Created Epoch');
    }
    query.refetch();
  };

  useEffect(() => {
    setEditEpoch(undefined);
    setNewEpoch(false);
  }, [circleId]);

  const deleteEpochHandler = async (
    epochToDelete: QueryFutureEpoch | undefined,
    currentEpoch: QueryCurrentEpoch | undefined
  ) => {
    if (epochToDelete && epochToDelete.id > -1) {
      return deleteEpoch(epochToDelete?.id);
    } else if (currentEpoch)
      return updateEpoch(currentEpoch.id, {
        params: {
          end_date: currentEpoch.end_date,
          start_date: currentEpoch.start_date,
          type: 'one-off',
        },
      });
  };

  const getNextRepeatingDates = (epoch: NonNullable<typeof currentEpoch>) => {
    const { start_date, end_date, repeat_data } = epoch;

    if (!repeat_data) return null;
    if (repeat_data.type === 'monthly') {
      const nextStartDate = DateTime.fromISO(end_date);
      return {
        nextStartDate,
        nextEndDate: findMonthlyEndDate(nextStartDate),
      };
    } /*if (repeat_data === 'custom')*/ else {
      const nextStartDate = DateTime.fromISO(start_date).plus({
        [repeat_data.frequency_unit]: repeat_data.frequency,
      });
      const nextEndDate = DateTime.fromISO(end_date).plus({
        [repeat_data.frequency_unit]: repeat_data.frequency,
      });
      return { nextStartDate, nextEndDate };
    }
  };

  const nextRepeatingEpoch: typeof currentEpoch | undefined = useMemo(() => {
    if (currentEpoch && currentEpoch.repeat_data) {
      const nextEpochDates = getNextRepeatingDates(currentEpoch);
      if (!nextEpochDates) return currentEpoch;
      return {
        ...currentEpoch,
        id: -1,
        number: -1,
        start_date: nextEpochDates.nextStartDate.toISO(),
        end_date: nextEpochDates.nextEndDate.toISO(),
      };
    }
  }, [currentEpoch?.id, currentEpoch?.repeat_data]);

  if (query.isLoading || query.isIdle || !circle)
    return <LoadingModal visible note="HistoryPage" />;

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1 css={{ mb: '$sm' }}>
            {circle.name} Overview
          </Text>
          <Text p as="p">
            Your current and past epochs.
          </Text>
        </Flex>
        {isAdmin && (
          <Button
            css={{ mt: '$sm' }}
            color="cta"
            onClick={() => setNewEpoch(true)}
            disabled={newEpoch || !!editEpoch}
          >
            Create Epoch
          </Button>
        )}
      </ContentHeader>
      {isFeatureEnabled('epoch_timing_banner') && (
        <HintBanner title={'Epoch Timing Settings'}>
          <Text p as="p" css={{ color: 'inherit' }}>
            Heads up, we&apos;ve released updated settings for epoch timing.
          </Text>
          <Button
            as="a"
            href={
              'https://docs.coordinape.com/get-started/epochs/create-an-epoch'
            }
            target="_blank"
            rel="noreferrer"
            color="secondary"
          >
            Read the docs to learn more.
          </Button>
        </HintBanner>
      )}

      {/* show some help for admins who don't have an epoch yet */}
      {isAdmin &&
        circle &&
        !currentEpoch &&
        pastEpochs.length == 0 &&
        (!futureEpochs || futureEpochs.length == 0) && (
          <HintBanner title={'Get started'}>
            <Text p as="p">
              Yay! You’ve created a new circle. Start adding members, creating
              and funding a vault, create an epoch and join our discord where
              we’re always happy to help and keep you updated on whats
              happening. Check out the{' '}
              <AppLink to={paths.circleAdmin(circleId)}>Circle Admin</AppLink>{' '}
              for additional settings.
            </Text>
            <Flex css={{ gap: '$md' }}>
              <AppLink to={paths.members(circleId)}>
                <Button color="secondary" inline>
                  Add/Import Members
                </Button>
              </AppLink>
              <Button
                color="secondary"
                inline
                onClick={() => setNewEpoch(true)}
                disabled={newEpoch || !!editEpoch}
              >
                Start an Epoch
              </Button>
              {isFeatureEnabled('vaults') && (
                <AppLink to={paths.vaults}>
                  <Button color="secondary" inline>
                    Create a Vault
                  </Button>
                </AppLink>
              )}
            </Flex>
          </HintBanner>
        )}
      {/* show some help for nonAdmin members who haven't gifted in an epoch */}
      {!isAdmin &&
        circle &&
        pastEpochs.filter(
          p => p.sentGifts.length > 0 || p.receivedGifts.length > 0
        ).length == 0 && (
          <HintBanner title={'Get started'}>
            <Text p as="p">
              Let your circles know who you are by{' '}
              <AppLink to={paths.profile('me')}>
                completing your profile
              </AppLink>
              . To learn more about Coordinape, check out our get started guide.{' '}
              <Link href={EXTERNAL_URL_DISCORD} target="_blank">
                Join our discord
              </Link>{' '}
              where we’re always happy to help and keep you updated on whats
              happening.
            </Text>
            <Flex css={{ gap: '$md' }}>
              <Link href={EXTERNAL_URL_GET_STARTED_MEMBER} target="_blank">
                <Button color="secondary" inline>
                  Get Started Guide
                </Button>
              </Link>
              <Link
                href={EXTERNAL_URL_GET_STARTED_TUTORIAL_VIDEO}
                target="_blank"
              >
                <Button color="secondary" inline>
                  Watch Tutorial
                </Button>
              </Link>
            </Flex>
          </HintBanner>
        )}
      {newEpoch && (
        <EpochForm
          circleId={circleId}
          epochs={futureEpochs}
          selectedEpoch={undefined}
          currentEpoch={currentEpoch}
          setEditEpoch={setEditEpoch}
          setEndEpochDialog={setEndEpochDialog}
          setNewEpoch={setNewEpoch}
          onClose={closeFormHandler}
          setEpochToDelete={setEpochToDelete}
          isAdmin={isAdmin}
          isEditing={editEpoch || newEpoch ? true : false}
        ></EpochForm>
      )}

      <Text h2>Upcoming Epochs</Text>
      {futureEpochs?.length === 0 && !nextRepeatingEpoch && (
        <Text>There are no scheduled epochs</Text>
      )}
      <Collapsible open={open} onOpenChange={setOpen} css={{ mb: '$md' }}>
        {nextRepeatingEpoch && (
          <EpochForm
            key={-1}
            circleId={circleId}
            epochs={futureEpochs}
            selectedEpoch={nextRepeatingEpoch}
            currentEpoch={currentEpoch}
            setEditEpoch={setEditEpoch}
            setEndEpochDialog={setEndEpochDialog}
            setNewEpoch={setNewEpoch}
            onClose={closeFormHandler}
            isEditing={editEpoch || newEpoch ? true : false}
            editingEpoch={editEpoch?.id}
            setEpochToDelete={setEpochToDelete}
            isAdmin={isAdmin}
          ></EpochForm>
        )}

        {futureEpochs && futureEpochs.length > 0 && (
          <EpochForm
            key={futureEpochs[0].id}
            circleId={circleId}
            epochs={futureEpochs}
            selectedEpoch={futureEpochs[0]}
            currentEpoch={currentEpoch}
            setEditEpoch={setEditEpoch}
            setEndEpochDialog={setEndEpochDialog}
            setNewEpoch={setNewEpoch}
            onClose={closeFormHandler}
            isEditing={editEpoch || newEpoch ? true : false}
            setEpochToDelete={setEpochToDelete}
            isAdmin={isAdmin}
            editingEpoch={editEpoch?.id}
          ></EpochForm>
        )}

        <CollapsibleContent>
          {futureEpochs?.slice(1).map(e => (
            <EpochForm
              key={e.id}
              circleId={circleId}
              epochs={futureEpochs}
              selectedEpoch={e}
              currentEpoch={currentEpoch}
              setEditEpoch={setEditEpoch}
              setEndEpochDialog={setEndEpochDialog}
              setNewEpoch={setNewEpoch}
              onClose={closeFormHandler}
              isEditing={editEpoch || newEpoch ? true : false}
              editingEpoch={editEpoch?.id}
              setEpochToDelete={setEpochToDelete}
              isAdmin={isAdmin}
            ></EpochForm>
          ))}
        </CollapsibleContent>
        {futureEpochs && futureEpochs.length > 1 && (
          <CollapsibleTrigger asChild>
            <Link css={{ fontWeight: '$bold' }}>
              {!open
                ? `View ${futureEpochs.length - 1} More`
                : 'Hide Upcoming Epochs'}
            </Link>
          </CollapsibleTrigger>
        )}
      </Collapsible>
      {currentEpoch && (
        <>
          <Text h2>Current Epoch</Text>
          <CurrentEpochPanel
            circleId={circleId}
            epoch={currentEpoch}
            unallocated={unallocated}
            tokenName={circle?.token_name}
            isAdmin={isAdmin}
            isEditing={editEpoch || newEpoch ? true : false}
            editingEpoch={editEpoch?.id}
            editCurrentEpoch={() => {
              setEditEpoch(currentEpoch);
            }}
          />
          {editEpoch && editEpoch?.id === currentEpoch.id && (
            <EpochForm
              circleId={circleId}
              epochs={futureEpochs}
              selectedEpoch={currentEpoch}
              currentEpoch={currentEpoch}
              setEditEpoch={setEditEpoch}
              setEndEpochDialog={setEndEpochDialog}
              setNewEpoch={setNewEpoch}
              onClose={closeFormHandler}
              isEditing={editEpoch || newEpoch ? true : false}
              editingEpoch={editEpoch?.id}
              setEpochToDelete={setEpochToDelete}
              isAdmin={isAdmin}
            ></EpochForm>
          )}
        </>
      )}
      {pastEpochs.length > 0 && (
        <>
          <Text h2>Past Epochs</Text>
          {shownPastEpochs.map((epoch: QueryPastEpoch) => (
            <EpochPanel
              key={epoch.id}
              circleId={circleId}
              epoch={epoch}
              tokenName={circle?.token_name || 'GIVE'}
              isAdmin={isAdmin}
            />
          ))}
          <Paginator pages={totalPages} current={page} onSelect={setPage} />
        </>
      )}
      <Modal
        open={!!epochToDelete}
        onOpenChange={() => setEpochToDelete(undefined)}
        title={`Remove Epoch ${
          epochToDelete?.number && epochToDelete.number > -1
            ? epochToDelete.number
            : ''
        }`}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Button
            color="destructive"
            onClick={() =>
              deleteEpochHandler(epochToDelete, currentEpoch)
                .then(() => setEpochToDelete(undefined))
                .then(() => query.refetch())
                .catch(() => setEpochToDelete(undefined))
            }
          >
            Remove
          </Button>
        </Flex>
      </Modal>
      {endEpochDialog && currentEpoch?.id && (
        <EndEpochDialog
          epochId={currentEpoch?.id}
          circleId={circleId}
          endEpochDialog={endEpochDialog}
          setEndEpochDialog={setEndEpochDialog}
          onClose={closeFormHandler}
        />
      )}
    </SingleColumnLayout>
  );
};
