import assert from 'assert';

import { claimsUnwrappedAmount } from 'common-lib/distributions';
import { useMyUser } from 'features/auth/useLoginData';
import { isUserAdmin } from 'lib/users';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { DISTRIBUTION_TYPE } from '../../config/constants';
import { givePaths } from '../../routes/paths';
import { LoadingModal } from 'components';
import { useApiAdminCircle } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useCircleIdParam } from 'routes/hooks';
import { AppLink, BackButton, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AllocationsTable } from './AllocationsTable';
import type { Gift } from './queries';
import { getEpochData } from './queries';

export function DistributionsPage() {
  const { epochId } = useParams();
  const address = useConnectedAddress();
  const circleId = useCircleIdParam();
  const isAdmin = isUserAdmin(useMyUser(circleId));

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: epoch,
  } = useQuery(
    ['distributions', epochId],
    () => getEpochData(Number.parseInt(epochId || '0'), address),
    {
      enabled: !!address,
      retry: false,
      refetchOnWindowFocus: false,
      notifyOnChangeProps: ['data'],
    }
  );

  const { downloadCSV } = useApiAdminCircle(circleId);

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
        // fixedDistPricePerShare: Number(fixedDist?.vault.price_per_share),
        circleDistDecimals: circleDist?.vault.decimals,
        circleDistClaimAmount,
        // circleDistPricePerShare: Number(circleDist?.vault.price_per_share),
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

  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);

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
          <AllocationsTable
            epoch={epoch}
            users={usersWithGiftnFixedAmounts}
            totalGive={totalGive}
            giveTokenName={circle.token_name}
            downloadCSV={downloadCSV}
            formGiftAmount={0}
          />
        </>
      )}
    </SingleColumnLayout>
  );
}
