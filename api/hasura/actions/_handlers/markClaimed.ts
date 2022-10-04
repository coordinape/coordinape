import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getPropsWithUserSession } from '../../../../api-lib/handlerHelpers';
import { UnprocessableError } from '../../../../api-lib/HttpError';
import { getProvider } from '../../../../api-lib/provider';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { Contracts, hasSimpleToken } from '../../../../src/lib/vaults';

const MarkClaimedInputSchema = z.object({
  claim_id: z.number(),
  tx_hash: z.string(),
});

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables: { hasuraProfileId },
    input: {
      payload: { tx_hash, claim_id },
    },
  } = getPropsWithUserSession(MarkClaimedInputSchema, req);

  const ids = await updateClaims(hasuraProfileId, claim_id, tx_hash);
  return res.json({ ids });
}

export default verifyHasuraRequestMiddleware(handler);

export const updateClaims = async (
  profileId: number,
  claimId: number,
  txHash: string,
  contracts?: Contracts
) => {
  const {
    claims: [claim],
  } = await adminClient.query({
    claims: [
      {
        where: {
          id: { _eq: claimId },
          profile_id: { _eq: profileId },
        },
        limit: 1,
      },
      {
        distribution: {
          id: true,
          vault_id: true,
          vault: {
            symbol: true,
            chain_id: true,
            decimals: true,
            vault_address: true,
            simple_token_address: true,
          },
          epoch: { circle_id: true },
        },
      },
    ],
  });

  if (!claim) {
    throw new UnprocessableError(
      `no claim with id ${claimId} & profile_id ${profileId}`
    );
  }

  const {
    distribution: {
      id: distribution_id,
      vault_id,
      vault: {
        vault_address,
        decimals,
        symbol,
        simple_token_address,
        chain_id,
      },
      epoch: { circle_id },
    },
  } = claim;

  const { update_claims: result } = await adminClient.mutate({
    update_claims: [
      {
        _set: { txHash },
        where: {
          txHash: { _is_null: true },
          id: { _lte: claimId },
          profile_id: { _eq: profileId },
          distribution: {
            vault_id: { _eq: vault_id },
            epoch: { circle_id: { _eq: circle_id } },
          },
        },
      },
      { returning: { id: true, new_amount: true } },
    ],
    delete_pending_vault_transactions_by_pk: [
      { tx_hash: txHash },
      { __typename: true },
    ],
  });

  if (!result?.returning.length) {
    throw new UnprocessableError('updated 0 claims');
  }

  let amount = result?.returning.reduce((a, b) => a + b.new_amount, 0);
  if (!hasSimpleToken({ simple_token_address })) {
    if (!contracts) {
      const provider = getProvider(chain_id);
      contracts = new Contracts(chain_id, provider, true);
    }
    const pps = await contracts.getPricePerShare(
      vault_address,
      simple_token_address,
      decimals
    );
    amount = amount * pps.toUnsafeFloat();
  }

  await adminClient.mutate(
    {
      insert_interaction_events_one: [
        {
          object: {
            event_type: 'vault_claim',
            profile_id: profileId,
            data: {
              vault_id,
              symbol,
              tx_hash: txHash,
              circle_id,
              distribution_id,
              amount,
            },
          },
        },
        { __typename: true },
      ],
    },
    { operationName: 'markClaimed' }
  );

  return result?.returning.map(x => x.id as number) || [];
};
