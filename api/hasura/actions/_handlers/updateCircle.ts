import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { endNominees, updateCircle } from '../../../../api-lib/gql/mutations';
import { getCircle } from '../../../../api-lib/gql/queries';
import {
  errorResponseWithStatusCode,
  InternalServerError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { composeHasuraActionRequestBodyWithApiPermissions } from '../../../../api-lib/requests/schema';
import { guildInfoFromAPI } from '../../../../src/features/guild/guild-api';
import { zCircleName } from '../../../../src/lib/zod/formHelpers';

const updateCircleInput = z
  .object({
    circle_id: z.number().positive(),
    name: zCircleName.optional(),
    alloc_text: z.string().max(5000).optional(),
    allow_distribute_evenly: z.boolean().optional(),
    auto_opt_out: z.boolean().optional(),
    default_opt_in: z.boolean().optional(),
    discord_webhook: z.string().url().optional().or(z.literal('')),
    min_vouches: z.number().min(1).optional(),
    nomination_days_limit: z.number().min(1).optional(),
    only_giver_vouch: z.boolean().optional(),
    cont_help_text: z.string().optional(),
    team_selection: z.boolean().optional(),
    show_pending_gives: z.boolean().optional(),
    token_name: z
      .string()
      .max(255)
      .refine(val => val.trim().length >= 3)
      .optional(),
    update_webhook: z.boolean().optional(),
    vouching: z.boolean().optional(),
    vouching_text: z.string().max(5000).optional(),
    fixed_payment_token_type: z
      .string()
      .max(200)
      .transform(s => (s === 'Disabled' ? null : s))
      .optional(),
    fixed_payment_vault_id: z.number().positive().nullable().optional(),
    guild_id: z.number().nullable().optional(),
    guild_role_id: z.number().nullable().optional(),
  })
  .strict();

const requestSchema = composeHasuraActionRequestBodyWithApiPermissions(
  updateCircleInput,
  ['update_circle']
);

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = await requestSchema.parseAsync(req.body);

  const { circles_by_pk: circle } = await getCircle(input.circle_id);

  if (input.token_name && input.token_name !== circle?.token_name) {
    errorResponseWithStatusCode(
      res,
      {
        message: `Changing Custom Token Name not allowed`,
      },
      422
    );
    return;
  }

  if (input.guild_id) {
    try {
      // make sure this guild number is good
      const guildInfo = await guildInfoFromAPI(input.guild_id);
      // make sure the role is valid
      if (
        input.guild_role_id &&
        !guildInfo.roles.some(r => r.id == input.guild_role_id)
      ) {
        throw new UnprocessableError('invalid guild role');
      }
    } catch (e) {
      if (e instanceof UnprocessableError) {
        throw e;
      }
      throw new InternalServerError('Unable to fetch info from guild', e);
    }
  } else {
    input.guild_role_id = null;
  }

  const updated = await updateCircle(input);

  if (!input.vouching) {
    await endNominees(input.circle_id);
  }
  res.status(200).json(updated);
}

export default authCircleAdminMiddleware(handler);
