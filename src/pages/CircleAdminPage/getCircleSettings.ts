import { client } from 'lib/gql/client';

import type { Awaited } from 'types/shim';

export const getCircleSettings = async (circleId: number) => {
  const { circle } = await client.query(
    {
      __alias: {
        circle: {
          circles_by_pk: [
            {
              id: circleId,
            },
            {
              id: true,
              name: true,
              logo: true,
              default_opt_in: true,
              is_verified: true,
              alloc_text: true,
              team_sel_text: true,
              token_name: true,
              vouching: true,
              min_vouches: true,
              nomination_days_limit: true,
              vouching_text: true,
              only_giver_vouch: true,
              team_selection: true,
              created_at: true,
              updated_at: true,
              organization_id: true,
              auto_opt_out: true,
              fixed_payment_token_type: true,
              fixed_payment_vault_id: true,
            },
          ],
        },
      },
    },
    {
      operationName: 'getCircleSettings',
    }
  );

  const tokenName = circle?.token_name || 'GIVE';
  const extraCircle = {
    ...circle,
    tokenName,
    teamSelText:
      circle?.team_sel_text ||
      `Think about who you worked with this Epoch, and who you saw adding value to the community. Allocate ${tokenName} to those whose contribution you directly experienced, or whose work supported yours.`,
    allocText:
      circle?.alloc_text ||
      `Thank your teammates by allocating them ${tokenName}`,
    vouchingText:
      circle?.vouching_text ||
      `Think someone new should be added to the ${circle?.name} circle?\nNominate or vouch for them here.`,
    hasVouching: circle?.vouching,
  };
  return extraCircle;
};

export type CircleSettingsResult = Awaited<
  ReturnType<typeof getCircleSettings>
>;
