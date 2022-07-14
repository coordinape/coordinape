import assert from 'assert';
import React, { useState } from 'react';

import { formatRelative, parseISO } from 'date-fns';
import { isUserAdmin } from 'lib/users';
import uniqBy from 'lodash/uniqBy';
import { FiExternalLink } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { useSelectedCircle } from '../../recoilState';
import { paths } from '../../routes/paths';
import { LoadingModal } from 'components';
import { useApiAdminCircle, useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { AppLink, Box, Button, Link, Panel, Text, Icon } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { makeExplorerUrl } from 'utils/provider';

import { AllocationsTable } from './AllocationsTable';
import { DistributionForm } from './DistributionForm';
import type { EpochDataResult, Gift } from './queries';
import { getEpochData } from './queries';

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

  const [formGiftAmount, setFormGiftAmount] = useState<number>(0);
  const [giftVaultId, setGiftVaultId] = useState<string>('');
  const { users: circleUsers, circleId } = useSelectedCircle();
  const { downloadCSV } = useApiAdminCircle(circleId);

  if (isIdle || isLoading) return <LoadingModal visible />;

  let epochError;
  if (isError) epochError = (error as any).message;

  if (!epoch?.id)
    return <SingleColumnLayout>Epoch not found</SingleColumnLayout>;

  const totalGive = epoch.token_gifts?.reduce((t, g) => t + g.tokens, 0) || 0;
  assert(epoch.circle);
  const circle = epoch.circle;
  if (!isUserAdmin(circle.users[0])) {
    epochError = 'You are not an admin of this circle.';
  } else if (!epoch.ended) {
    epochError = 'This epoch has not ended yet.';
  } else if (totalGive === 0) {
    epochError = 'No tokens were allocated during this epoch.';
  }
  const circleDist = epoch.distributions.find(
    d => d.distribution_type === 1 || d.distribution_type === 3
  );
  const fixedDist = epoch.distributions.find(
    d => d.distribution_type === 2 || d.distribution_type === 3
  );
  const usersWithGiftnFixedAmounts = circleUsers
    .filter(u => {
      return (
        (fixedDist &&
          fixedDist.claims.some(c => c.profile?.id === u.profile?.id)) ||
        (circle.fixed_payment_token_type && u.fixed_payment_amount) ||
        epoch.token_gifts?.some(g => g.recipient.id === u.id && g.tokens > 0)
      );
    })
    .map(user => {
      const receivedGifts = epoch.token_gifts?.filter(
        g => g.recipient.id === user.id
      );
      return {
        id: user.id,
        name: user.name,
        address: user.address,
        fixed_payment_amount: user.fixed_payment_amount ?? 0,
        avatar: user.profile?.avatar,
        givers: receivedGifts ? receivedGifts.length : 0,
        received: receivedGifts
          ? receivedGifts.reduce((t, g) => t + g.tokens, 0) || 0
          : 0,
        claimed: !fixedDist
          ? 0
          : fixedDist.claims
              .filter(c => c.profile?.id === user.profile?.id)
              .reduce((t, g) => t + g.new_amount, 0) || 0,
        circle_claimed: !circleDist
          ? 0
          : circleDist.claims
              .filter(c => c.profile?.id === user.profile?.id)
              .reduce((t, g) => t + g.new_amount, 0) || 0,
      };
    });
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
  const vaults = circle.organization.vaults || [];
  const vault1TokenName = vaults.find(
    v => v.id === Number(giftVaultId)
  )?.symbol;
  let tokenName = vault1TokenName;

  if (circleDist) {
    tokenName = circleDist.vault.symbol;
  }

  return (
    <SingleColumnLayout>
      <Panel>
        <AppLink to={paths.members(circle.id)}>
          <Button outlined css={{ minWidth: '100px', marginBottom: '$sm' }}>
            &larr; Back
          </Button>
        </AppLink>
        <Text h2 css={{ mb: '$sm' }}>
          Distributions
        </Text>
        <Text h2 normal>
          {circle.name}: Epoch {epoch.number}
        </Text>

        {epochError ? (
          <Text
            css={{
              fontSize: '$h3',
              fontWeight: '$semibold',
              textAlign: 'center',
              display: 'block',
              mt: '$md',
              color: '$alert',
            }}
          >
            {epochError}
          </Text>
        ) : (
          <>
            <Panel nested css={{ mt: '$lg' }}>
              <DistributionForm
                giftVaultId={giftVaultId}
                formGiftAmount={formGiftAmount}
                epoch={epoch}
                users={usersWithReceivedAmounts}
                setAmount={setFormGiftAmount}
                setVaultId={setGiftVaultId}
                vaults={vaults}
                circleUsers={circleUsers}
                downloadCSV={downloadCSV}
              />
              <Box
                css={{
                  display: 'grid',
                  width: '100%',
                  'grid-template-columns': '1fr 1fr',
                  'column-gap': '$lg',
                }}
              >
                {circleDist && <Summary distribution={circleDist} />}
                {fixedDist && <Summary distribution={fixedDist} />}
              </Box>
            </Panel>

            <Box css={{ mt: '$lg' }}>
              <AllocationsTable
                users={usersWithGiftnFixedAmounts}
                tokenName={tokenName}
                totalGive={totalGive}
                formGiftAmount={formGiftAmount}
                fixedTokenName={fixedDist?.vault.symbol}
                giveTokenName={circle.token_name}
              />
            </Box>
          </>
        )}
      </Panel>
    </SingleColumnLayout>
  );
}

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
      <ExplorerLink distribution={distribution} />
    </Box>
  );
};

const ExplorerLink = ({
  distribution,
}: {
  distribution: EpochDataResult['distributions'][0];
}) => {
  const { tx_hash } = distribution;
  const { chain_id } = distribution.vault;
  const LinkIcon = Icon(FiExternalLink);

  const explorerHref = makeExplorerUrl(chain_id, tx_hash);

  if (!explorerHref) return <></>;

  return (
    <Box css={{ display: 'flex', alignItems: 'center' }}>
      <LinkIcon css={{ size: '$md', color: '$borderMedium', length: 0 }} />
      <Link css={{ ml: '$xs' }} href={explorerHref}>
        View on Etherscan
      </Link>
    </Box>
  );
};
