import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GraphQLClient, gql } from 'graphql-request';
import Validator from 'validatorjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const variables = req.body.input.object;
  const rules = {
    user_name: 'required|string|max:255',
    address: ['required', 'regex:/^(0x)?[0-9a-f]{40}$/i'],
    circle_name: 'required|string|max:255',
    protocol_id: 'integer',
    protocol_name: 'required_without:protocol_id|string|max:255',
  };

  const validation = new Validator(variables, rules);
  if (validation.fails()) {
    return res.status(422).json({
      extensions: validation.errors.all(),
      message: 'Invalid input',
      code: '422',
    });
  }
  const client = new GraphQLClient(process.env.REACT_APP_HASURA_URL, {
    headers: { 'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET },
  });
  variables.address = variables.address.toLowerCase();
  try {
    // attach new circle to existing organisation
    if (variables.protocol_id) {
      const QUERY = gql`
        query ($address: String!, $protocol_id: Int!) {
          profiles(
            limit: 1
            where: {
              address: { _eq: $address }
              users: {
                role: { _eq: 1 }
                circle: { protocol_id: { _eq: $protocol_id } }
              }
            }
          ) {
            id
          }
        }
      `;
      let data = await client.request(QUERY, {
        address: variables.address,
        protocol_id: variables.protocol_id,
      });
      const { profiles } = data;
      if (!profiles.length) {
        return res.status(422).json({
          extensions: {
            protocol_id:
              'Address is not an admin of any circles under this protocol',
          },
          message: 'Invalid input',
          code: '422',
        });
      }

      const INSERT_MUTATION = gql`
        mutation (
          $circle_name: String!
          $coordinape_address: String!
          $address: String!
          $user_name: String!
          $protocol_id: Int!
        ) {
          insert_circles_one(
            object: {
              name: $circle_name
              protocol_id: $protocol_id
              users: {
                data: [
                  { name: $user_name, address: $address, role: 1 }
                  {
                    name: "Coordinape"
                    address: $coordinape_address
                    role: 2
                    non_receiver: false
                    fixed_non_receiver: false
                    starting_tokens: 0
                    non_giver: true
                    give_token_remaining: 0
                    bio: "Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations."
                  }
                ]
              }
            }
          ) {
            id
            name
            protocol_id
            team_sel_text
            alloc_text
            vouching
            min_vouches
            nomination_days_limit
            vouching_text
            logo
            default_opt_in
            team_selection
            only_giver_vouch
            auto_opt_out
          }
          insert_profiles(
            objects: [{ address: $address }, { address: $coordinape_address }]
            on_conflict: {
              constraint: profiles_address_key
              update_columns: address
            }
          ) {
            affected_rows
          }
        }
      `;

      data = await client.request(INSERT_MUTATION, {
        circle_name: variables.circle_name,
        coordinape_address: process.env.COORDINAPE_USER_ADDRESS.toLowerCase(),
        address: variables.address,
        user_name: variables.user_name,
        protocol_id: variables.protocol_id,
      });
      return res.status(200).json(data.insert_circles_one);
    } else {
      // create a new organisation
      const INSERT_MUTATION = gql`
        mutation (
          $protocol_name: String!
          $circle_name: String!
          $coordinape_address: String!
          $address: String!
          $user_name: String!
        ) {
          insert_organizations_one(
            object: {
              name: $protocol_name
              circles: {
                data: {
                  name: $circle_name
                  users: {
                    data: [
                      { name: $user_name, address: $address, role: 1 }
                      {
                        name: "Coordinape"
                        address: $coordinape_address
                        role: 2
                        non_receiver: false
                        fixed_non_receiver: false
                        starting_tokens: 0
                        non_giver: true
                        give_token_remaining: 0
                        bio: "Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations."
                      }
                    ]
                  }
                }
              }
            }
          ) {
            circles(order_by: { id: desc }, limit: 1) {
              id
              name
              protocol_id
              team_sel_text
              alloc_text
              vouching
              min_vouches
              nomination_days_limit
              vouching_text
              logo
              default_opt_in
              team_selection
              only_giver_vouch
              auto_opt_out
            }
          }
          insert_profiles(
            objects: [{ address: $address }, { address: $coordinape_address }]
            on_conflict: {
              constraint: profiles_address_key
              update_columns: address
            }
          ) {
            affected_rows
          }
        }
      `;

      const data = await client.request(INSERT_MUTATION, {
        circle_name: variables.circle_name,
        coordinape_address: process.env.COORDINAPE_USER_ADDRESS.toLowerCase(),
        address: variables.address,
        user_name: variables.user_name,
        protocol_name: variables.protocol_name,
      });
      return res.status(200).json(data.insert_organizations_one.circles[0]);
    }
  } catch (e) {
    return res.status(401).json({
      error: '401',
      message: e.message || 'Unexpected error',
    });
  }
}
