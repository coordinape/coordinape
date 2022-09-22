import { client } from 'lib/gql/client';

import type { Awaited } from 'types/shim';

export const getFixedPayment = async (circleId: number) => {
  const { circles_by_pk } = await client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          users: [
            {},
            {
              user_private: { fixed_payment_amount: true },
            },
          ],
        },
      ],
    },
    {
      operationName: 'getFixedPayment',
    }
  );

  const fixedPayments = circles_by_pk?.users
    ?.filter(user => user.user_private?.fixed_payment_amount > 0)
    .map(user => user.user_private?.fixed_payment_amount);

  const fixedPaymentTotal = fixedPayments?.reduce((a, b) => a + b, 0);

  const fixedPaymentNumber = fixedPayments?.length;

  const fixedPayment = {
    fixedPaymentTotal,
    fixedPaymentNumber,
  };
  return fixedPayment;
};

export type FixedPaymentResult = Awaited<ReturnType<typeof getFixedPayment>>;
export const QUERY_KEY_FIXED_PAYMENT = 'fixedPayment';
