import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createTextEmbedding } from '../bedrock/createEmbedding';
import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

// Define mutations and other imports as needed

export default async function handler(req: VercelRequest, res: VercelResponse) {
  type Events = EventTriggerPayload<'enriched_casts', 'INSERT'>;

  try {
    const {
      table: { name: table_name },
    }: Events = req.body;

    switch (table_name) {
      case 'enriched_casts': {
        await handleEnrichedCastEmbedding(req);
        break;
      }
      default: {
        throw `unknown table name for activity ${table_name}`;
      }
    }

    res.status(200).json({
      message: `enriched cast embedding recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}

async function handleEnrichedCastEmbedding(req: VercelRequest) {
  const {
    event: {
      data: {
        new: { id, text },
      },
    },
  }: EventTriggerPayload<'enriched_casts', 'INSERT'> = req.body;

  // Get the embedding
  const embedding = await createTextEmbedding(text);

  // Update the record with the embedding result
  await adminClient.mutate(
    {
      update_enriched_casts_by_pk: [
        {
          pk_columns: { id },
          _set: { embedding },
        },
        { id: true },
      ],
    },
    { operationName: 'updateEnrichedCastEmbedding' }
  );
}
