import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getProfilesWithAddress } from '../../../../api-lib/findProfile';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';

// for json validation
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

const interactionEventInput = z
  .object({
    profile_id: z.number().optional(),
    circle_id: z.number().optional(),
    org_id: z.number().optional(),
    event_type: z.string(),
    event_subtype: z.string().optional(),
    data: jsonSchema.optional(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { payload, session } = await getInput(req, interactionEventInput);

    const address = session.hasuraAddress;

    const profile = await getProfilesWithAddress(address);
    const { insert_interaction_events_one } = await adminClient.mutate(
      {
        insert_interaction_events_one: [
          {
            object: {
              ...payload,
              profile_id: profile?.id,
            },
          },
          {
            id: true,
          },
        ],
      },
      { operationName: 'insertInteractionEvent' }
    );

    if (!insert_interaction_events_one) {
      throw new Error('insert interaction event failed');
    }
    return res.status(200).json({ id: insert_interaction_events_one.id });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
