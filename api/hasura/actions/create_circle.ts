import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { gql } from '../../../api-lib/Gql';
import {
  profiles_constraint,
  order_by,
  profiles_update_column,
} from '../../../src/lib/gql/zeusHasuraAdmin';
import { createCircleSchemaInput } from '../../../src/lib/zod';
import { MutationCreate_CircleArgs } from '../customTypes/createCircleCustomTypes';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { object }: MutationCreate_CircleArgs = req.body.input;
  try {
    createCircleSchemaInput.parse(object);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    }
  }
  const address = object.address.toLowerCase();
  const coordinapeAddress = process.env.COORDINAPE_USER_ADDRESS.toLowerCase();
  const insertProfiles = {
    objects: [{ address: address }, { address: coordinapeAddress }],
    on_conflict: {
      constraint: profiles_constraint.profiles_address_key,
      update_columns: [profiles_update_column.address],
    },
  };
  const insertUsers = {
    data: [
      {
        name: object.user_name,
        address: address,
        role: 1,
      },
      {
        name: 'Coordinape',
        address: coordinapeAddress,
        role: 2,
        non_receiver: false,
        fixed_non_receiver: false,
        starting_tokens: 0,
        non_giver: true,
        give_token_remaining: 0,
        bio: 'Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations.',
      },
    ],
  };
  const circleReturn = {
    id: true,
    name: true,
    protocol_id: true,
    team_sel_text: true,
    alloc_text: true,
    vouching: true,
    min_vouches: true,
    nomination_days_limit: true,
    vouching_text: true,
    logo: true,
    default_opt_in: true,
    team_selection: true,
    only_giver_vouch: true,
    auto_opt_out: true,
  };
  try {
    // attach new circle to existing organisation
    if (object.protocol_id) {
      const { profiles } = await gql.q('query')({
        profiles: [
          {
            where: {
              address: { _eq: address },
              users: {
                role: { _eq: 1 },
                circle: { protocol_id: { _eq: object.protocol_id } },
              },
            },
          },
          { id: true },
        ],
      });
      try {
        z.array(
          z.object({
            id: z.number(),
          })
        )
          .nonempty({
            message:
              'Address is not an admin of any circles under this protocol',
          })
          .parse(profiles);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(422).json({
            extensions: err.issues,
            message: 'Invalid input',
            code: '422',
          });
        }
      }

      const { insert_circles_one } = await gql.q('mutation')({
        insert_circles_one: [
          {
            object: {
              name: object.circle_name,
              protocol_id: object.protocol_id,
              users: insertUsers,
            },
          },
          circleReturn,
        ],
        insert_profiles: [
          insertProfiles,
          {
            returning: {
              id: true,
            },
          },
        ],
      });
      return res.status(200).json(insert_circles_one);
    } else {
      // create a new organisation
      const { insert_organizations_one } = await gql.q('mutation')({
        insert_organizations_one: [
          {
            object: {
              name: object.protocol_name,
              circles: {
                data: [
                  {
                    name: object.circle_name,
                    users: insertUsers,
                  },
                ],
              },
            },
          },
          {
            circles: [
              { limit: 1, order_by: [{ id: order_by.desc }] },
              circleReturn,
            ],
          },
        ],
        insert_profiles: [
          insertProfiles,
          {
            returning: {
              id: true,
            },
          },
        ],
      });

      return res.status(200).json(insert_organizations_one.circles.pop());
    }
  } catch (e) {
    return res.status(401).json({
      error: '401',
      message: e.message || 'Unexpected error',
    });
  }
}
