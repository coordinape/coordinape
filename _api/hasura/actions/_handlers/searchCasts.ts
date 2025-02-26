import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { createEmbedding } from '../../../../api-lib/bedrock/createEmbedding';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';

const MATCH_THRESHOLD = 0.0;

const MAX_LIMIT = 20;

const searchCastsSchema = z.object({
  search_query: z.string(),
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(MAX_LIMIT),
  created_after: z.string().optional(), // ISO timestamp string
});

interface VectorSearchResult {
  id: number;
  similarity: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, searchCastsSchema);

  let results: { cast_id: number; similarity: number }[] = [];

  try {
    if (payload.search_query.trim() === '') {
      return res.status(200).json(results);
    } else {
      // Generate embedding for the search query
      const embedding = await createEmbedding(payload.search_query);

      // Parse created_after if provided
      const createdAfter = payload.created_after
        ? new Date(payload.created_after).toISOString()
        : null;

      // Query for similar casts using the embedding
      // Use type assertion to handle custom function not in type definitions
      const response = await adminClient.query(
        {
          vector_search_enriched_casts: [
            {
              args: {
                target_vector: JSON.stringify(embedding),
                match_threshold: MATCH_THRESHOLD,
                limit_count: payload.limit,
                created_after: createdAfter,
              },
            },
            {
              id: true,
              similarity: true,
            },
          ],
        },
        {
          operationName: 'searchCasts__embeddingSearch',
        }
      );

      if (response.vector_search_enriched_casts.length > 0) {
        results = response.vector_search_enriched_casts.map(
          (c: VectorSearchResult) => ({
            cast_id: c.id,
            similarity: c.similarity,
          })
        );
      } else {
        // eslint-disable-next-line no-console
        console.log('No results found for term', payload.search_query);
      }
    }

    return res.status(200).json(results);
  } catch (e) {
    console.error(e);
    throw new InternalServerError('Error occurred searching casts', e);
  }
}
