import { client } from 'lib/gql/client';
import { z } from 'zod';

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

type addInteractionEventType = z.infer<typeof interactionEventInput>;

export const addInteractionEvent = async (payload: addInteractionEventType) => {
  await client.mutate(
    {
      insertInteractionEvent: [
        {
          payload,
        },
        { id: true },
      ],
    },
    { operationName: 'addInteractionEvent_insertInteractionEvent' }
  );
};
