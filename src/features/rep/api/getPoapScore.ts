import { adminClient } from '../../../../api-lib/gql/adminClient';

import { POAP_HOLDING_VALUE, POAP_SCORE_MAX } from './scoring';

export const getPoapScore = async (address: string) => {
  const { poap_holders_aggregate } = await adminClient.query(
    {
      poap_holders_aggregate: [
        {
          where: { address: { _eq: address.toLowerCase() } },
        },
        { aggregate: { count: [{}, true] } },
      ],
    },
    { operationName: 'getPoapScore__getPoapsHeld' }
  );
  const poapScore =
    (poap_holders_aggregate?.aggregate?.count || 0) * POAP_HOLDING_VALUE;

  return Math.min(POAP_SCORE_MAX, poapScore);
};
