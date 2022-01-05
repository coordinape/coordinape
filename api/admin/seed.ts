import type { VercelRequest, VercelResponse } from '@vercel/node';

import { Gql } from '../../libs/gql/zeus';

// https://www.graphql-code-generator.com/docs/getting-started/further-reading
//

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: This shouldn't run in production
  console.log('|');
  console.log('|');
  console.log('|');
  console.log('|');
  console.log('HANDLING IT');

  try {
    const circles = await Gql('query')({
      circles_by_pk: [
        { id: 0 },
        {
          id: true,
          name: true,
          team_sel_text: true,
          epochs: [
            { limit: 1 },
            {
              id: true,
              start_date: true,
              number: true,
              circle_id: true,
              ended: true,
              grant: true,
              created_at: true,
              days: true,
              repeat: true,
              repeat_day_of_month: true,
            },
          ],
        },
      ],
    });

    console.log('HANDLED', circles);
  } catch (e) {
    console.error('API ERROR', e);
    res.status(501).json({
      error: '501',
      message: 'Server Error',
    });
  }
}
