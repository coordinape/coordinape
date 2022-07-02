import { useState, useMemo } from 'react';

import { useQuery } from 'react-query';

import { ActionDialog, LoadingModal } from 'components';
import { Paginator } from 'components/Paginator';
import AdminEpochForm from 'forms/AdminEpochForm';
import { useApiAdminCircle, useContracts } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { Button, Text, Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { NextEpoch } from './conponents';
import { CurrentEpochPanel } from './CurrentEpochPanel';
import { EpochPanel } from './EpochPanel';
import { getHistoryData, QueryEpoch } from './getHistoryData';

import { IApiEpoch } from 'types';

const pageSize = 3;

export const HistoryPage = () => {
  const contracts = useContracts();
  const {
    circle: { id: circleId },
    myUser: { id: userId },
  } = useSelectedCircle();

  const query = useQuery(
    ['history', circleId],
    () => getHistoryData(circleId, userId, contracts),
    { enabled: !!userId && !!circleId }
  );

  const circle = query.data;
  const me = circle?.users[0];

  const { deleteEpoch } = useApiAdminCircle(circleId);

  const [editEpoch, setEditEpoch] = useState<IApiEpoch | undefined>(undefined);
  const [newEpoch, setNewEpoch] = useState<boolean>(false);
  const [deleteEpochDialog, setDeleteEpochDialog] = useState<
    IApiEpoch | undefined
  >(undefined);

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

  if (query.isLoading || query.isIdle)
    return <LoadingModal visible note="HistoryPage" />;

  return (
    <SingleColumnLayout>
      <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text h1 css={{ mb: '$md' }}>
          Epoch Overview
        </Text>
        <Button
          color="primary"
          outlined
          onClick={() => setNewEpoch(true)}
          disabled={newEpoch}
        >
          Create Epoch
        </Button>
      </Flex>
      {(editEpoch || newEpoch) && (
        <AdminEpochForm
          circleId={circleId}
          epochs={futureEpochs}
          selectedEpoch={editEpoch}
          currentEpoch={currentEpoch}
          setEditEpoch={setEditEpoch}
          setNewEpoch={setNewEpoch}
        ></AdminEpochForm>
      )}

      <Text h3>Upcoming Epochs</Text>
      {futureEpochs?.length === 0 && <Text>There are no scheduled Epochs</Text>}
      {futureEpochs?.map(e => {
        return (
          <NextEpoch
            key={e.id}
            epoch={e}
            setEditEpoch={setEditEpoch}
            isEditing={editEpoch || newEpoch ? true : false}
            setDeleteEpochDialog={setDeleteEpochDialog}
          ></NextEpoch>
        );
      })}
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
          />
        </>
      )}
      {pastEpochs.length > 0 && (
        <>
          <Text h3>Past</Text>
          {shownPastEpochs.map((epoch: QueryEpoch) => (
            <EpochPanel
              key={epoch.id}
              circleId={circleId}
              epoch={epoch}
              tokenName={circle?.token_name || 'GIVE'}
            />
          ))}
          <Paginator pages={totalPages} current={page} onSelect={setPage} />
        </>
      )}
      <ActionDialog
        open={!!deleteEpochDialog}
        title={`Remove Epoch ${deleteEpochDialog?.id}`}
        onClose={() => setDeleteEpochDialog(undefined)}
        primaryText="Remove"
        onPrimary={
          deleteEpochDialog
            ? () =>
                deleteEpoch(deleteEpochDialog?.id)
                  .then(() => setDeleteEpochDialog(undefined))
                  .catch(() => setDeleteEpochDialog(undefined))
            : undefined
        }
      />
    </SingleColumnLayout>
  );
};
