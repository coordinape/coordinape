import { useState, useMemo, useEffect } from 'react';

import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';

import HintBanner from '../../components/HintBanner';
import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_GET_STARTED_MEMBER,
  EXTERNAL_URL_GET_STARTED_TUTORIAL_VIDEO,
  paths,
} from '../../routes/paths';
import { ActionDialog, LoadingModal } from 'components';
import { Paginator } from 'components/Paginator';
import isFeatureEnabled from 'config/features';
import { useApeSnackbar, useApiAdminCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Button,
  Text,
  Flex,
  Link,
  Box,
  AppLink,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CurrentEpochPanel } from './CurrentEpochPanel';
import EpochForm from './EpochForm';
import { EpochPanel } from './EpochPanel';
import {
  getHistoryData,
  QueryPastEpoch,
  QueryFutureEpoch,
} from './getHistoryData';
import { NextEpoch } from './NextEpoch';

const pageSize = 3;

export const HistoryPage = () => {
  const {
    circle: { id: circleId },
    myUser: { id: userId },
  } = useSelectedCircle();

  const query = useQuery(
    ['history', circleId],
    () => getHistoryData(circleId, userId),
    { enabled: !!userId && !!circleId }
  );

  const circle = query.data;
  const me = circle?.users[0];

  const { deleteEpoch } = useApiAdminCircle(circleId);

  const [editEpoch, setEditEpoch] = useState<QueryFutureEpoch | undefined>(
    undefined
  );
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

  const nominees = circle?.nominees_aggregate.aggregate?.count || 0;
  const unallocated = (!me?.non_giver && me?.give_token_remaining) || 0;

  const { showInfo } = useApeSnackbar();

  const isAdmin = isUserAdmin(me);

  const closeFormHandler = () => {
    if (editEpoch) {
      setEditEpoch(undefined);
      showInfo('Saved Changes');
    } else {
      setNewEpoch(false);
      showInfo('Created Epoch');
    }
    query.refetch();
  };

  useEffect(() => {
    setEditEpoch(undefined);
    setNewEpoch(false);
  }, [circleId]);

  if (query.isLoading || query.isIdle)
    return <LoadingModal visible note="HistoryPage" />;

  return (
    <SingleColumnLayout>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
        }}
      >
        <Text h1 css={{ mb: '$md' }}>
          Epoch Overview
        </Text>
        {isAdmin && (
          <Button
            color="primary"
            outlined
            onClick={() => setNewEpoch(true)}
            disabled={newEpoch || !!editEpoch}
          >
            Create Epoch
          </Button>
        )}
      </Flex>
      {/* show some help for admins who don't have an epoch yet */}
      {isAdmin &&
        circle &&
        !currentEpoch &&
        pastEpochs.length == 0 &&
        (!futureEpochs || futureEpochs.length == 0) && (
          <HintBanner title={'Get started'}>
            <Text p as="p" css={{ mb: '$md' }}>
              Yay! You’ve created a new circle. Start adding members, creating
              and funding a vault, create an epoch and join our discord where
              we’re always happy to help and keep you updated on whats
              happening. Check out the{' '}
              <AppLink to={paths.circleAdmin(circleId)}>Circle Admin</AppLink>{' '}
              for additional settings.
            </Text>
            <Box>
              <AppLink to={paths.members(circleId)}>
                <Button
                  color="primary"
                  outlined
                  inline
                  css={{ mt: '$md', mr: '$md' }}
                >
                  Add/Import Members
                </Button>
              </AppLink>
              <Button
                color="primary"
                outlined
                inline
                css={{ mt: '$md', mr: '$md' }}
                onClick={() => setNewEpoch(true)}
                disabled={newEpoch || !!editEpoch}
              >
                Start an Epoch
              </Button>
              {isFeatureEnabled('vaults') && (
                <AppLink to={paths.vaults}>
                  <Button color="primary" outlined inline css={{ mt: '$md' }}>
                    Create a Vault
                  </Button>
                </AppLink>
              )}
            </Box>
          </HintBanner>
        )}
      {/* show some help for nonAdmin members who haven't gifted in an epoch */}
      {!isAdmin &&
        circle &&
        pastEpochs.filter(
          p => p.sentGifts.length > 0 || p.receivedGifts.length > 0
        ).length == 0 && (
          <HintBanner title={'Get started'}>
            <Text p as="p" css={{ mb: '$md' }}>
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
            <Box>
              <Link href={EXTERNAL_URL_GET_STARTED_MEMBER} target="_blank">
                <Button
                  color="primary"
                  outlined
                  inline
                  css={{ mt: '$md', mr: '$md' }}
                >
                  Get Started Guide
                </Button>
              </Link>
              <Link
                href={EXTERNAL_URL_GET_STARTED_TUTORIAL_VIDEO}
                target="_blank"
              >
                <Button color="primary" outlined inline css={{ mt: '$md' }}>
                  Watch Tutorial
                </Button>
              </Link>
            </Box>
          </HintBanner>
        )}
      {(editEpoch || newEpoch) && (
        <EpochForm
          circleId={circleId}
          epochs={futureEpochs}
          selectedEpoch={editEpoch}
          currentEpoch={currentEpoch}
          setEditEpoch={setEditEpoch}
          setNewEpoch={setNewEpoch}
          onClose={closeFormHandler}
        ></EpochForm>
      )}
      <Text h3>Upcoming Epochs</Text>
      {futureEpochs?.length === 0 && <Text>There are no scheduled epochs</Text>}
      <Collapsible open={open} onOpenChange={setOpen} css={{ mb: '$md' }}>
        {futureEpochs && futureEpochs.length > 0 && (
          <NextEpoch
            key={futureEpochs[0].id}
            epoch={futureEpochs[0]}
            setEditEpoch={setEditEpoch}
            isEditing={editEpoch || newEpoch ? true : false}
            setEpochToDelete={setEpochToDelete}
            isAdmin={isAdmin}
          />
        )}

        <CollapsibleContent>
          {futureEpochs?.slice(1).map(e => (
            <NextEpoch
              key={e.id}
              epoch={e}
              setEditEpoch={setEditEpoch}
              isEditing={editEpoch || newEpoch ? true : false}
              setEpochToDelete={setEpochToDelete}
              isAdmin={isAdmin}
            />
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
          <Text h3>Current</Text>
          <CurrentEpochPanel
            css={{ mb: '$md' }}
            circleId={circleId}
            epoch={currentEpoch}
            vouching={circle?.vouching}
            nominees={nominees}
            unallocated={unallocated}
            tokenName={circle?.token_name}
            isAdmin={isAdmin}
            isEditing={editEpoch || newEpoch ? true : false}
            editCurrentEpoch={() => {
              setEditEpoch(currentEpoch);
            }}
          />
        </>
      )}
      {pastEpochs.length > 0 && (
        <>
          <Text h3>Past</Text>
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
      <ActionDialog
        open={!!epochToDelete}
        title={`Remove Epoch ${
          epochToDelete?.number ? epochToDelete.number : ''
        }`}
        onClose={() => setEpochToDelete(undefined)}
        primaryText="Remove"
        onPrimary={
          epochToDelete
            ? () =>
                deleteEpoch(epochToDelete?.id)
                  .then(() => setEpochToDelete(undefined))
                  .then(() => query.refetch())
                  .catch(() => setEpochToDelete(undefined))
            : undefined
        }
      />
    </SingleColumnLayout>
  );
};
