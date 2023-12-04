import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { createEmbedding } from '../openai';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { event }: EventTriggerPayload<'profiles', 'INSERT' | 'UPDATE'> =
      req.body;
    if (event.data?.new && event.data?.old) {
      return handleUpdate(event.data.new, event.data.old, res);
    } else if (event.data?.new) {
      return handleInsert(event.data.new, res);
    } else {
      console.error('Unexpected event payload', event);
      throw Error('Unexpected event payload');
    }
  } catch (e) {
    return errorResponse(res, e);
  }
}

const handleInsert = async (
  newRow: EventTriggerPayload<'profiles', 'INSERT'>['event']['data']['new'],
  res: VercelResponse
) => {
  const { id, description } = newRow;

  if (!description || description === '') {
    return res.status(200).json({
      message: `no description`,
    });
  }

  await updateEmbedding(id, description);

  res.status(200).json({
    message: `description embedding updated for profile.id ${id}`,
  });
};

const handleUpdate = async (
  newRow: EventTriggerPayload<'profiles', 'UPDATE'>['event']['data']['new'],
  oldRow: EventTriggerPayload<'profiles', 'UPDATE'>['event']['data']['old'],
  res: VercelResponse
) => {
  if (newRow.description === oldRow.description) {
    return res.status(200).json({
      message: `no change in description - this shouldn't happen`,
    });
  }

  if (!newRow.description || newRow.description === '') {
    return res.status(200).json({
      message: `no description`,
    });
  }

  await updateEmbedding(newRow.id, newRow.description);

  res.status(200).json({
    message: `replies notification deleted`,
  });
};

async function updateEmbedding(id: number, description: string) {
  if (!process.env.OPENAI_API_KEY || !process.env.HELICONE_API_KEY) {
    return console.error(
      'Environment variables OPENAI_API_KEY, HELICONE_API_KEY are required: skipping description embedding generation'
    );
  }

  const embedding = await createEmbedding(description);

  const { update_profiles_by_pk } = await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: {
            id: id,
          },
          _set: {
            description_embedding: JSON.stringify(embedding),
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'updateDescriptionEmbedding',
    }
  );
  return update_profiles_by_pk;
}
