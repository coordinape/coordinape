import assert from 'assert';
import { useState } from 'react';

import { BigNumber, FixedNumber } from 'ethers';
import uniqBy from 'lodash/uniqBy';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingModal } from 'components';
import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Box, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AllocationsTable } from './AllocationsTable';
import { DistributionForm } from './DistributionForm';
import { getEpochData } from './queries';
import type { Gift } from './queries';

export function DistributionsPage() {
  const { epochId } = useParams();
  const address = useConnectedAddress();
  const contracts = useContracts();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: epoch,
  } = useQuery(
    ['distributions', epochId],
    () => getEpochData(Number(epochId), address, contracts),
    { enabled: !!(contracts && address), retry: false }
  );

  const [form1Amount, setForm1Amount] = useState<number>(0);
  const [vault1Id, setVault1Id] = useState<string>('');

  if (isIdle || isLoading) return <LoadingModal visible />;

  // TODO show error if user isn't circle admin
  if (isError) return <Text>{(error as any).message}</Text>;

  // TODO show error if epoch not found
  // TODO show error if epoch hasn't ended yet
  assert(epoch);

  const totalGive = epoch.token_gifts?.reduce((t, g) => t + g.tokens, 0) || 0;

  // reformat gift data into a structure that's easier for subcomponents to use
  const usersWithReceivedAmounts = uniqBy(
    epoch.token_gifts?.map((g: Gift) => g.recipient),
    'id'
  ).map(user => ({
    ...user,
    received:
      epoch.token_gifts
        ?.filter(g => g.recipient.id === user.id)
        .reduce((t, g) => t + g.tokens, 0) || 0,
  }));

  const vaults = epoch.circle?.organization.vaults || [];
  const vault1TokenName = vaults.find(v => v.id === Number(vault1Id))?.symbol;

  let totalAmount = form1Amount;
  let tokenName = vault1TokenName;

  // if distribution already happened, show summary instead of form
  const dist = epoch?.distributions[0];
  if (dist) {
    totalAmount = FixedNumber.from(dist.total_amount.toPrecision(30))
      .mulUnsafe(dist.pricePerShare)
      .divUnsafe(FixedNumber.from(BigNumber.from(10).pow(dist.vault.decimals)))
      .toUnsafeFloat();
    tokenName = dist?.vault.symbol;
  }

  return (
    <SingleColumnLayout>
      <Panel>
        <Text variant="sectionHeader" css={{ mb: '$sm' }}>
          Distributions
        </Text>
        <Text variant="sectionHeader" normal>
          {epoch?.circle?.name}: Epoch {epoch?.number}
        </Text>
        <Panel nested css={{ mt: '$lg' }}>
          {dist ? (
            <>
              <Text>There was a distribution already</Text>
              <Text>{dist.created_at}</Text>
            </>
          ) : (
            <DistributionForm
              epoch={epoch}
              users={usersWithReceivedAmounts}
              setAmount={setForm1Amount}
              setVaultId={setVault1Id}
              vaults={vaults}
            />
          )}
        </Panel>

        <Box css={{ mt: '$lg' }}>
          {totalGive && epoch.token_gifts ? (
            <AllocationsTable
              users={usersWithReceivedAmounts}
              totalAmountInVault={totalAmount}
              tokenName={tokenName}
              totalGive={totalGive}
            />
          ) : (
            <Text
              css={{
                fontSize: '$7',
                fontWeight: '$bold',
                textAlign: 'center',
                display: 'block',
              }}
            >
              No GIVE was allocated for this epoch
            </Text>
          )}
        </Box>
      </Panel>
    </SingleColumnLayout>
  );
}
