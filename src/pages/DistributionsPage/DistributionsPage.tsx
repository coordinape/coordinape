import assert from 'assert';
import { useEffect, useState } from 'react';

import { claimsUnwrappedAmount } from 'common-lib/distributions';
import { useMyUser } from 'features/auth/useLoginData';
import { isUserAdmin } from 'lib/users';
import { getDisplayTokenString } from 'lib/vaults/tokens';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { DISTRIBUTION_TYPE } from '../../config/constants';
import { QUERY_KEY_NAV } from '../../features/nav';
import { givePaths } from '../../routes/paths';
import { LoadingModal } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useApiAdminCircle, useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useCircleIdParam } from 'routes/hooks';
import { AppLink, BackButton, Box, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AllocationsTable } from './AllocationsTable';
import { DistributionForm } from './DistributionForm';
import type { Gift } from './queries';
import { getEpochData, getExistingLockedTokenDistribution } from './queries';
import type { CustomToken } from './types';

export function DistributionsPage() {
  const { epochId } = useParams();
  const address = useConnectedAddress();
  const queryClient = useQueryClient();
  const contracts = useContracts();
  const circleId = useCircleIdParam();
  const isAdmin = isUserAdmin(useMyUser(circleId));

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: epoch,
    refetch: refetchDistributions,
  } = useQuery(
    ['distributions', epochId],
    () => getEpochData(Number.parseInt(epochId || '0'), address, contracts),
    {
      enabled: !!address,
      retry: false,
      select: d => {
        if (d.circle && d.circle.organization)
          d.circle.organization.vaults = d.circle?.organization.vaults.map(
            v => {
              v.symbol = getDisplayTokenString(v);
              return v;
            }
          );
        return d;
      },
      refetchOnWindowFocus: false,
      notifyOnChangeProps: ['data'],
    }
  );

  const [formGiftAmount, setFormGiftAmount] = useState<string>('0');
  const [giftVaultId, setGiftVaultId] = useState<string>('');
  const { downloadCSV } = useApiAdminCircle(circleId);
  const [existingLockedTokenDistribution, setExistingLockedTokenDistribution] =
    useState<any>({});
  const [customToken, setCustomToken] = useState<CustomToken>();

  // consider Hedgey integration enabled regardless of the value of data.enabled,
  // because it could be currently disabled but have past data
  const hedgeyEnabled = (epoch?.circle?.integrations?.length ?? 0) > 0;

  const loadExistingLockedTokenDistribution = () => {
    if (!hedgeyEnabled) return;
    getExistingLockedTokenDistribution(Number.parseInt(epochId || '0')).then(
      setExistingLockedTokenDistribution
    );
  };

  useEffect(() => {
    loadExistingLockedTokenDistribution();
  }, [epochId]);

  if (isIdle || isLoading) return <LoadingModal visible />;

  let epochError;
  if (isError) epochError = (error as any).message;

  if (!epoch?.id)
    return (
      <SingleColumnLayout>
        <Text p as="p">
          Epoch not found
        </Text>
        <Text size="small">{epochError}</Text>
      </SingleColumnLayout>
    );

  // remove deleted users' (where recipient doesn't exist) allocations from token gifts
  const gifts = epoch.token_gifts?.filter((g: Gift) => g.recipient) || [];
  const totalGive = gifts.reduce((t, g) => t + g.tokens, 0) || 0;

  assert(epoch.circle);
  const circle = epoch.circle;

  if (!isAdmin) {
    epochError = 'You are not an admin of this circle.';
  } else if (!epoch.ended) {
    epochError = 'This epoch has not ended yet.';
  }

  const circleDist = epoch.distributions.find(
    d =>
      d.distribution_type === DISTRIBUTION_TYPE.GIFT ||
      d.distribution_type === DISTRIBUTION_TYPE.COMBINED
  );
  const fixedDist = epoch.distributions.find(
    d =>
      d.distribution_type === DISTRIBUTION_TYPE.FIXED ||
      d.distribution_type === DISTRIBUTION_TYPE.COMBINED
  );

  const circleUsers = circle.users;

  const usersWithGiftnFixedAmounts = circleUsers
    .filter(
      u =>
        fixedDist?.claims.some(c => c.profile_id === u.profile?.id) ||
        (circle.fixed_payment_token_type &&
          u.user_private?.fixed_payment_amount) ||
        epoch.token_gifts?.some(g => g.recipient?.id === u.id && g.tokens > 0)
    )
    .map(user => {
      const receivedGifts = epoch.token_gifts?.filter(
        g => g.recipient_id === user.id
      );

      const circleDistClaimAmount = circleDist?.claims.find(
        c => c.profile_id === user.profile?.id
      )?.new_amount;

      const { circleClaimed, fixedPayment } = claimsUnwrappedAmount({
        address: user.profile.address,
        fixedDistDecimals: fixedDist?.vault.decimals,
        fixedGifts: fixedDist?.distribution_json.fixedGifts,
        fixedDistPricePerShare: Number(fixedDist?.vault.price_per_share),
        circleDistDecimals: circleDist?.vault.decimals,
        circleDistClaimAmount,
        circleDistPricePerShare: Number(circleDist?.vault.price_per_share),
        circleFixedGifts: circleDist?.distribution_json.fixedGifts,
      });
      return {
        id: user.id,
        name: user.profile.name ?? '',
        address: user.profile.address,
        fixedPaymentAmount: user.user_private?.fixed_payment_amount ?? 0,
        fixedPaymentClaimed: fixedPayment,
        avatar: user.profile.avatar,
        givers: receivedGifts?.length || 0,
        received: receivedGifts?.reduce((t, g) => t + g.tokens, 0) || 0,
        circleClaimed,
        combinedClaimed: fixedPayment + circleClaimed,
      };
    });

  if (existingLockedTokenDistribution?.locked_token_distribution_gifts) {
    usersWithGiftnFixedAmounts.forEach(user => {
      const usersLockedTokens =
        existingLockedTokenDistribution.locked_token_distribution_gifts.find(
          (gift: { profile: { address: string } }) =>
            gift.profile.address === user.address
        );
      if (!usersLockedTokens) return;
      user.circleClaimed = usersLockedTokens.earnings;
    });
  }

  const usersWithReceivedAmounts = uniqBy(
    gifts.map(g => g.recipient),
    'id'
  ).map(user => ({
    ...user,
    name: user.profile.name,
    received:
      epoch.token_gifts
        ?.filter(g => g.recipient?.id === user?.id)
        .reduce((t, g) => t + g.tokens, 0) || 0,
  }));

  const vaults = circle.organization?.vaults || [];
  const giftVault = vaults.find(v => v.id.toString() === giftVaultId);
  const fixedVault = vaults.find(v => v.id === circle.fixed_payment_vault_id);
  const tokenName = contracts
    ? circleDist
      ? getDisplayTokenString(circleDist.vault)
      : giftVault
      ? getDisplayTokenString(giftVault)
      : ''
    : circle.fixed_payment_token_type;
  const fixedTokenName = fixedDist
    ? getDisplayTokenString(fixedDist.vault)
    : fixedVault
    ? getDisplayTokenString(fixedVault)
    : '';

  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);

  const refetch = () => {
    refetchDistributions();
    queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
    queryClient.invalidateQueries(QUERY_KEY_NAV);
    loadExistingLockedTokenDistribution();
  };

  const totalFixedPayment = circleUsers
    .map(u => u.user_private?.fixed_payment_amount ?? 0)
    .reduce((total, tokens) => tokens + total, 0)
    .toString();

  return (
    <SingleColumnLayout>
      <AppLink to={givePaths.epochs(circle.id)}>
        <BackButton />
      </AppLink>
      <Text h1 css={{ '@sm': { display: 'block' } }}>
        Distributions&nbsp;
        {!epoch.description && (
          <Text normal>
            Epoch {epoch.number}: {startDate.toFormat('MMM d')} -{' '}
            {endDate.toFormat(
              endDate.month === startDate.month ? 'd' : 'MMM d'
            )}
          </Text>
        )}
      </Text>
      {epoch.description && (
        <Text size="xl">
          {startDate.toFormat('MMM d')} -{' '}
          {endDate.toFormat(endDate.month === startDate.month ? 'd' : 'MMM d')}:{' '}
          {epoch.description}
        </Text>
      )}
      <Box css={{ maxWidth: '712px' }}>
        <Text p as="p" css={{ my: '$md' }}>
          Please enter your budget for the epoch and review the distribution
          details below. If all looks good, approve the distribution so that
          contributors can claim their funds.
        </Text>
        <Text p as="p">
          Please note: Each token distribution requires a separate transaction.
          If you choose the same token, you can combine Gift Circle and Fixed
          Payment transactions. If you choose a token that you don&apos;t have a
          vault for, you can export the distribution to a CSV.
        </Text>
      </Box>
      {epochError ? (
        <Text
          tag
          color="secondary"
          size="medium"
          css={{
            mt: '$md',
            p: '$md',
          }}
        >
          {epochError}
        </Text>
      ) : (
        <>
          <Box css={{ mt: '$lg' }}>
            <DistributionForm
              users={usersWithReceivedAmounts}
              setAmount={setFormGiftAmount}
              circleUsers={circleUsers}
              {...{
                circleDist,
                customToken,
                epoch,
                existingLockedTokenDistribution,
                fixedDist,
                formGiftAmount,
                giftVaultId,
                refetch,
                setCustomToken,
                setGiftVaultId,
                totalFixedPayment,
                totalGive,
                vaults,
              }}
            />
          </Box>
          <AllocationsTable
            epoch={epoch}
            users={usersWithGiftnFixedAmounts}
            tokenName={tokenName}
            totalGive={totalGive}
            formGiftAmount={Number(formGiftAmount)}
            fixedTokenName={fixedTokenName}
            giveTokenName={circle.token_name}
            downloadCSV={downloadCSV}
            circleDist={circleDist}
            fixedDist={fixedDist}
            isLockedTokenDistribution={
              existingLockedTokenDistribution?.locked_token_distribution_gifts !==
              undefined
            }
            lockedTokenDistributionDecimals={
              existingLockedTokenDistribution?.token_decimals
            }
            lockedTokenDistributionSymbol={
              existingLockedTokenDistribution?.token_symbol
            }
            customToken={customToken}
          />
        </>
      )}
    </SingleColumnLayout>
  );
}
