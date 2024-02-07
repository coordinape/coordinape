import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { createEmbedding } from '../../../../api-lib/openai';
import { MATCH_THRESHOLD } from '../../../../src/features/ai/vectorEmbeddings';

const MAX_LIMIT = 10;

const searchProfilesSchema = z.object({
  search_query: z.string(),
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(MAX_LIMIT),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, searchProfilesSchema);

  let results: { profile_id: number; similarity: any }[] = [];

  try {
    if (payload.search_query.trim() === '') {
      return res.status(200).json({ results });
    } else {
      const embedding = await createEmbedding(payload.search_query);

      const { vector_similar_profiles_by_description_embedding } =
        await adminClient.query(
          {
            vector_similar_profiles_by_description_embedding: [
              {
                args: {
                  target_vector: JSON.stringify(embedding),
                  match_threshold: MATCH_THRESHOLD,
                  additional_where: 'links > 0',
                  limit_count: payload.limit,
                },
              },
              {
                id: true,
                similarity: true,
              },
            ],
          },
          {
            operationName: 'searchProfiles__descriptionEmbeddingSearch',
          }
        );

      if (vector_similar_profiles_by_description_embedding.length > 0) {
        results = vector_similar_profiles_by_description_embedding.map(p => ({
          profile_id: p.id as number,
          similarity: p.similarity,
        }));
      }
    }

    return res.status(200).json(results);
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching profiles', e);
  }
}
