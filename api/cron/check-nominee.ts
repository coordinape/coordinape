import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GraphQLClient, gql } from 'graphql-request';

/*

        $expired_nominees = $this->model->with('circle','nominations')->where('ended',0)->pastExpiryDate()->get();
        foreach($expired_nominees as $nominee) {
            $nominee->ended = 1;
            $nominee->save();
            $nominations = count($nominee->nominations);
            $nominee_name = Utils::cleanStr($nominee->name);
            $message = "Nominee $nominee_name has only received $nominations vouch(es) and has failed";
            $nominee->circle->notify(new SendSocialMessage($message, true));
        }

*/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(process.env);

    const client = new GraphQLClient(process.env.REACT_APP_HASURA_URL, {
      headers: { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET },
    });

    const QUERY = gql`
      query {
        nominees
      }
    `;

    const data = await client.request(QUERY);

    console.log('***** DATA *****');
    console.log(data);

    res.status(200).json({});
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
