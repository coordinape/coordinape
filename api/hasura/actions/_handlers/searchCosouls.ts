import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { poap_holders_select_column } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { createEmbedding } from '../../../../api-lib/openai';

const searchCosoulSchema = z.object({
  search_query: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, searchCosoulSchema);

  let results: number[];

  try {
    if (payload.search_query.trim() === '') {
      results = [];
    } else {
      const embedding = await createEmbedding(payload.search_query);

      // find all poap holders who have a poap with closest distance to query
      const { vector_search_poap_holders } = await adminClient.query(
        {
          vector_search_poap_holders: [
            {
              args: {
                target_vector: JSON.stringify(embedding),
                match_threshold: 0.7,
                limit_count: 10,
              },
              distinct_on: [poap_holders_select_column.address],
            },
            {
              id: true,
              address: true,
            },
          ],
        },
        {
          operationName: 'serachCoSouls__search_most_similar_poap_holders',
        }
      );

      const addresses: string[] = vector_search_poap_holders.map(
        ph => ph.address
      );

      const { cosouls } = await adminClient.query(
        {
          cosouls: [
            {
              where: {
                address: { _in: addresses },
              },
            },
            {
              id: true,
            },
          ],
        },
        {
          operationName: 'searchCosouls__fetchCosouls',
        }
      );
      results = cosouls.map(c => c.id);
    }

    return res.status(200).json({ cosoul_ids: results });
  } catch (e) {
    throw new InternalServerError('Error occurred searching CoSouls', e);
  }
}
