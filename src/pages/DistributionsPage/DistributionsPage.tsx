import assert from 'assert';
import React, { useState } from 'react';

import { isUserAdmin } from 'lib/users';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { DISTRIBUTION_TYPE } from '../../config/constants';
import { useSelectedCircle } from '../../recoilState';
import { paths } from '../../routes/paths';
import { ReactComponent as LeftArrowSVG } from 'assets/svgs/button/left-arrow.svg';
import { LoadingModal } from 'components';
import { useApiAdminCircle, useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { AppLink, Box, Button, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AllocationsTable } from './AllocationsTable';
import { DistributionForm } from './DistributionForm';
import type { Gift } from './queries';
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
    refetch,
  } = useQuery(
    ['distributions', epochId],
    () => getEpochData(Number(epochId), address, contracts),
    { enabled: !!(contracts && address), retry: false }
  );

  const [formGiftAmount, setFormGiftAmount] = useState<number>(0);
  const [giftVaultSymbol, setGiftVaultSymbol] = useState<string>('');
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
    d =>
      d.distribution_type === DISTRIBUTION_TYPE.GIFT ||
      d.distribution_type === DISTRIBUTION_TYPE.COMBINED
  );
  const fixedDist = epoch.distributions.find(
    d =>
      d.distribution_type === DISTRIBUTION_TYPE.FIXED ||
      d.distribution_type === DISTRIBUTION_TYPE.COMBINED
  );

  const isCombinedDistribution =
    fixedDist &&
    circleDist &&
    circleDist.distribution_type === DISTRIBUTION_TYPE.COMBINED &&
    fixedDist.distribution_type === DISTRIBUTION_TYPE.COMBINED;

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
      const claimed = !fixedDist
        ? 0
        : fixedDist.claims
            .filter(c => c.profile?.id === user.profile?.id)
            .reduce((t, g) => t + g.new_amount, 0) || 0;
      const circle_claimed = !circleDist
        ? 0
        : circleDist.claims
            .filter(c => c.profile?.id === user.profile?.id)
            .reduce((t, g) => t + g.new_amount, 0) || 0;
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
        claimed,
        circle_claimed,
        // if its a combined distribution we don't add the claim amounts twice
        // to avoid double counting towards the total claimed
        combined_claimed: !isCombinedDistribution
          ? claimed + circle_claimed
          : claimed,
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
  let tokenName = giftVaultSymbol;

  if (circleDist) {
    tokenName = circleDist.vault.symbol;
  }
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);

  return (
    <SingleColumnLayout>
      <AppLink to={paths.history(circle.id)}>
        <Button
          size="small"
          outlined
          css={{ padding: '$sm', color: '$neutral', borderColor: '$neutral' }}
        >
          <LeftArrowSVG />
          Back
        </Button>
      </AppLink>
      <Text h1 css={{ '@sm': { display: 'block' } }}>
        Distributions&nbsp;
        <Text normal>
          Epoch {epoch.number}: {startDate.toFormat('MMM d')} -{' '}
          {endDate.toFormat(endDate.month === startDate.month ? 'd' : 'MMM d')}
        </Text>
      </Text>
      <br />
      <Box css={{ maxWidth: '712px' }}>
        <Text css={{ lineHeight: `$shorter` }}>
          Please review the distribution details below and if all looks good,
          approve the distribution so that contributors can claim their funds.
          <br />
          <br />
          Each token distribution requires a separate transaction. If you choose
          the same token, you can combine Gift Circle and Fixed Payment
          transactions. If you choose a token that you don’t have a vault for,
          you can export the distribution to a CSV.
        </Text>
      </Box>
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
          <Box css={{ mt: '$lg' }}>
            <DistributionForm
              circleDist={circleDist}
              fixedDist={fixedDist}
              giftVaultSymbol={giftVaultSymbol}
              formGiftAmount={formGiftAmount}
              epoch={epoch}
              users={usersWithReceivedAmounts}
              setAmount={setFormGiftAmount}
              setGiftVaultSymbol={setGiftVaultSymbol}
              vaults={vaults}
              circleUsers={circleUsers}
              downloadCSV={downloadCSV}
              refetch={refetch}
            />
          </Box>
          <AllocationsTable
            epoch={epoch}
            users={usersWithGiftnFixedAmounts}
            tokenName={tokenName}
            totalGive={totalGive}
            formGiftAmount={formGiftAmount}
            fixedTokenName={
              fixedDist
                ? fixedDist.vault.symbol
                : circle.fixed_payment_token_type
            }
            giveTokenName={circle.token_name}
            downloadCSV={downloadCSV}
          />
        </>
      )}
    </SingleColumnLayout>
  );
}
