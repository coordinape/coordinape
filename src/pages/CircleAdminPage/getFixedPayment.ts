import { client } from 'lib/gql/client';

import type { Awaited } from 'types/shim';

export const getFixedPayment = async (circleId: number) => {
  const { circles_by_pk } = await client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          users: [{}, { user_private: { fixed_payment_amount: true } }],
          fixed_payment_vault_id: true,
        },
      ],
    },
    { operationName: 'getFixedPayment' }
  );

  const fixedPayments = circles_by_pk?.users
    ?.filter(user => user.user_private?.fixed_payment_amount > 0)
    .map(user => user.user_private?.fixed_payment_amount);

  return {
    total: fixedPayments?.reduce((a, b) => a + b, 0),
    number: fixedPayments?.length,
    vaultId: circles_by_pk?.fixed_payment_vault_id,
  };
};

export type FixedPaymentResult = Awaited<ReturnType<typeof getFixedPayment>>;
export const QUERY_KEY_FIXED_PAYMENT = 'fixedPayment';
