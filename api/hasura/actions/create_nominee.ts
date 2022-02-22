import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  insertNominee,
  getUserFromProfileIdWithCircle,
} from '../../../api-lib/createNomineeMutations';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { GraphQLError } from '../../../src/lib/gql/zeusHasuraAdmin';
import {
  createNomineeSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      input: { object: input },
      session_variables: sessionVariables,
    } = composeHasuraActionRequestBody(createNomineeSchemaInput).parse(
      req.body
    );
    if (sessionVariables.hasuraRole !== 'admin') {
      const { circle_id } = input;
      const profileId = sessionVariables.hasuraProfileId;
      const user = await getUserFromProfileIdWithCircle(profileId, circle_id);
      assert(user);
      // check if user exists in nominee table same circle and not expired
      //
      const nominee = await insertNominee(
        user.id,
        circle_id,
        input.address,
        input.name,
        input.description,
        user.circle.nomination_days_limit,
        user.circle.min_vouches
      );
      return res.status(200).json(nominee);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    } else if (err instanceof GraphQLError) {
      return res.status(422).json({
        code: 422,
        message: 'GQL Query Error',
        extensions: err.response.errors,
      });
    }
    return res.status(401).json({
      message: 'User does not belong to this circle',
      code: 401,
    });
  }
  return res.status(401).json({
    error: '401',
    message: 'Unexpected error',
  });
  // const { object }: MutationCreate_CircleArgs = req.body.input;
  // try {
  //     createCircleSchemaInput.parse(object);
  // } catch (err) {
  //     if (err instanceof z.ZodError) {
  //         return res.status(422).json({
  //             extensions: err.issues,
  //             message: 'Invalid input',
  //             code: '422',
  //         });
  //     }
  // }
  //
  // const client = new GraphQLClient(process.env.REACT_APP_HASURA_URL, {
  //     headers: { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET },
  // });
  // object.address = object.address.toLowerCase();
  // try {
  //     // attach new circle to existing organisation
  //     if (object.protocol_id) {
  //         const QUERY = gql`
  //     query ($address: String!, $protocol_id: Int!) {
  //       profiles(
  //         limit: 1
  //         where: {
  //           address: { _eq: $address }
  //           users: {
  //             role: { _eq: 1 }
  //             circle: { protocol_id: { _eq: $protocol_id } }
  //           }
  //         }
  //       ) {
  //         id
  //       }
  //     }
  //   `;
  //         let data = await client.request(QUERY, {
  //             address: object.address,
  //             protocol_id: object.protocol_id,
  //         });
  //         try {
  //             z.object({
  //                 profiles: z
  //                     .array(
  //                         z.object({
  //                             id: z.number(),
  //                         })
  //                     )
  //                     .nonempty({
  //                         message:
  //                             'Address is not an admin of any circles under this protocol',
  //                     }),
  //             }).parse(data);
  //         } catch (err) {
  //             if (err instanceof z.ZodError) {
  //                 return res.status(422).json({
  //                     extensions: err.issues,
  //                     message: 'Invalid input',
  //                     code: '422',
  //                 });
  //             }
  //         }
  //
  //         const INSERT_MUTATION = gql`
  //     mutation (
  //       $circle_name: String!
  //       $coordinape_address: String!
  //       $address: String!
  //       $user_name: String!
  //       $protocol_id: Int!
  //     ) {
  //       insert_circles_one(
  //         object: {
  //           name: $circle_name
  //           protocol_id: $protocol_id
  //           users: {
  //             data: [
  //               { name: $user_name, address: $address, role: 1 }
  //               {
  //                 name: "Coordinape"
  //                 address: $coordinape_address
  //                 role: 2
  //                 non_receiver: false
  //                 fixed_non_receiver: false
  //                 starting_tokens: 0
  //                 non_giver: true
  //                 give_token_remaining: 0
  //                 bio: "Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations."
  //               }
  //             ]
  //           }
  //         }
  //       ) {
  //         id
  //         name
  //         protocol_id
  //         team_sel_text
  //         alloc_text
  //         vouching
  //         min_vouches
  //         nomination_days_limit
  //         vouching_text
  //         logo
  //         default_opt_in
  //         team_selection
  //         only_giver_vouch
  //         auto_opt_out
  //       }
  //       insert_profiles(
  //         objects: [{ address: $address }, { address: $coordinape_address }]
  //         on_conflict: {
  //           constraint: profiles_address_key
  //           update_columns: address
  //         }
  //       ) {
  //         affected_rows
  //       }
  //     }
  //   `;
  //
  //         data = await client.request(INSERT_MUTATION, {
  //             circle_name: object.circle_name,
  //             coordinape_address: process.env.COORDINAPE_USER_ADDRESS.toLowerCase(),
  //             address: object.address,
  //             user_name: object.user_name,
  //             protocol_id: object.protocol_id,
  //         });
  //         return res.status(200).json(data.insert_circles_one);
  //     } else {
  //         // create a new organisation
  //         const INSERT_MUTATION = gql`
  //     mutation (
  //       $protocol_name: String!
  //       $circle_name: String!
  //       $coordinape_address: String!
  //       $address: String!
  //       $user_name: String!
  //     ) {
  //       insert_organizations_one(
  //         object: {
  //           name: $protocol_name
  //           circles: {
  //             data: {
  //               name: $circle_name
  //               users: {
  //                 data: [
  //                   { name: $user_name, address: $address, role: 1 }
  //                   {
  //                     name: "Coordinape"
  //                     address: $coordinape_address
  //                     role: 2
  //                     non_receiver: false
  //                     fixed_non_receiver: false
  //                     starting_tokens: 0
  //                     non_giver: true
  //                     give_token_remaining: 0
  //                     bio: "Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations."
  //                   }
  //                 ]
  //               }
  //             }
  //           }
  //         }
  //       ) {
  //         circles(order_by: { id: desc }, limit: 1) {
  //           id
  //           name
  //           protocol_id
  //           team_sel_text
  //           alloc_text
  //           vouching
  //           min_vouches
  //           nomination_days_limit
  //           vouching_text
  //           logo
  //           default_opt_in
  //           team_selection
  //           only_giver_vouch
  //           auto_opt_out
  //         }
  //       }
  //       insert_profiles(
  //         objects: [{ address: $address }, { address: $coordinape_address }]
  //         on_conflict: {
  //           constraint: profiles_address_key
  //           update_columns: address
  //         }
  //       ) {
  //         affected_rows
  //       }
  //     }
  //   `;
  //
  //         const data = await client.request(INSERT_MUTATION, {
  //             circle_name: object.circle_name,
  //             coordinape_address: process.env.COORDINAPE_USER_ADDRESS.toLowerCase(),
  //             address: object.address,
  //             user_name: object.user_name,
  //             protocol_name: object.protocol_name,
  //         });
  //         return res.status(200).json(data.insert_organizations_one.circles[0]);
  //     }
  // } catch (e) {
  //     return res.status(401).json({
  //         error: '401',
  //         message: e.message || 'Unexpected error',
  //     });
  // }
}

export default verifyHasuraRequestMiddleware(handler);
