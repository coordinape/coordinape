import assert from 'assert';
import { useState } from 'react';

import { formatRelative, parseISO } from 'date-fns';
import { isUserAdmin } from 'lib/users';
import { getUnwrappedAmount } from 'lib/vaults';
import uniqBy from 'lodash/uniqBy';
import { FiExternalLink } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { styled } from 'stitches.config';

import { LoadingModal } from 'components';
import { useContracts } from 'hooks';
import { useFixCircleState } from 'hooks/migration';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Box, Link, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AllocationsTable } from './AllocationsTable';
import { DistributionForm } from './DistributionForm';
import type { EpochDataResult, Gift } from './queries';
import { getEpochData } from './queries';

// circle context:
// maybe you loaded the page from scratch so the circle is wrong
// maybe you navigated from history or admin so the circle is right

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

  useFixCircleState(epoch?.circle?.id, 'DistributionsPage');

  if (isIdle || isLoading) return <LoadingModal visible />;

  let epochError;
  if (isError) epochError = (error as any).message;

  if (!epoch?.id)
    return <SingleColumnLayout>Epoch not found</SingleColumnLayout>;

  assert(epoch);

  const totalGive = epoch.token_gifts?.reduce((t, g) => t + g.tokens, 0) || 0;

  if (!isUserAdmin(epoch.circle?.users[0])) {
    epochError = 'You are not an admin of this circle.';
  } else if (!epoch.ended) {
    epochError = 'This epoch has not ended yet.';
  } else if (totalGive === 0) {
    epochError = 'No tokens were allocated during this epoch.';
  }

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

  const dist = epoch?.distributions[0];
  if (dist) {
    const {
      total_amount,
      pricePerShare,
      vault: { symbol, decimals },
    } = dist;
    totalAmount = getUnwrappedAmount(total_amount, pricePerShare, decimals);
    tokenName = symbol;
  }

  return (
    <SingleColumnLayout>
      <Panel>
        <Text h2 css={{ mb: '$sm' }}>
          Distributions
        </Text>
        <Text h2 normal>
          {epoch?.circle?.name}: Epoch {epoch?.number}
        </Text>

        {epochError ? (
          <Text
            css={{
              fontSize: '$h3',
              fontWeight: '$semibold',
              textAlign: 'center',
              display: 'block',
              mt: '$md',
              color: '$red',
            }}
          >
            {epochError}
          </Text>
        ) : (
          <>
            <Panel nested css={{ mt: '$lg' }}>
              {dist ? (
                <Summary distribution={dist} />
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
              <AllocationsTable
                users={usersWithReceivedAmounts}
                totalAmountInVault={totalAmount}
                tokenName={tokenName}
                totalGive={totalGive}
              />
            </Box>
          </>
        )}
      </Panel>
    </SingleColumnLayout>
  );
}
//TODO: Discuss with the team what do about Icons in general. This should go in a separate file.
const Icon = styled(FiExternalLink, {
  size: '$md',
  color: '$focusedBorder',
});

const Summary = ({
  distribution,
}: {
  distribution: EpochDataResult['distributions'][0];
}) => {
  const distTime = parseISO(distribution.created_at + 'Z');
  return (
    <Box
      css={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Text css={{ color: '$complete' }}>
        Distribution submitted {formatRelative(distTime, Date.now())}
      </Text>
      <Box css={{ display: 'flex', alignItems: 'center' }}>
        <Icon css={{}} />
        <Link
          css={{ ml: '$xs' }}
          href={`https://etherscan.io/tx/${distribution.tx_hash}`}
        >
          View on Etherscan
        </Link>
      </Box>
    </Box>
  );
};
