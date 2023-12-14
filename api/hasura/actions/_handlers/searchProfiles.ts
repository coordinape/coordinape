import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { createEmbedding } from '../../../../api-lib/openai';

const MATCH_THRESHOLD = 0.7;
const LIMIT = 10;

const searchProfilesSchema = z.object({
  search_query: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, searchProfilesSchema);

  let results: { profile_id: number; similarity: any }[] = [];

  try {
    if (payload.search_query.trim() === '') {
      return res.status(200).json({ results });
    } else {
      const embedding = await createEmbedding(payload.search_query);

      // TODO: filter only profiles with cosouls/links bought
      // find profiles by description most similar to embedding
      const { vector_similar_profiles_by_description_embedding } =
        await adminClient.query(
          {
            vector_similar_profiles_by_description_embedding: [
              {
                args: {
                  target_vector: JSON.stringify(embedding),
                  match_threshold: MATCH_THRESHOLD,
                  limit_count: LIMIT,
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
