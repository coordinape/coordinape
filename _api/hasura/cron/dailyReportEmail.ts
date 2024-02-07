import type { VercelRequest, VercelResponse } from '@vercel/node';

import { sendDailySpacecar } from '../../../api-lib/email/postmark';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { IN_PRODUCTION } from '../../../src/config/env';

export const EMAIL_FOR_REPORTS = 'core@coordinape.com';

async function handler(_: VercelRequest, res: VercelResponse) {
  if (!IN_PRODUCTION) {
    return res.status(200).json({ success: true });
  }
  const dayAgo = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toISOString();

  try {
    const {
      // @ts-ignore
      today_buys,
      // @ts-ignore
      today_sells,
      // @ts-ignore
      today_new_users,
      // @ts-ignore
      today_replies,
      // @ts-ignore
      today_reactions,
      // @ts-ignore
      today_posts,
      // @ts-ignore
      today_cosouls,
      // @ts-ignore
      total_links,
      // @ts-ignore
      total_buys,
      // @ts-ignore
      total_sells,
      // @ts-ignore
      total_users,
      // @ts-ignore
      total_replies,
      // @ts-ignore
      total_reactions,
      // @ts-ignore
      total_posts,
      // @ts-ignore
      total_cosouls,
    } = await adminClient.query(
      {
        __alias: {
          today_buys: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: true },
                  created_at: {
                    _gte: dayAgo,
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          today_sells: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: false },
                  created_at: {
                    _gte: dayAgo,
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          today_new_users: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: true },
                  supply: { _eq: 1 },
                  created_at: {
                    _gte: dayAgo,
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          today_replies: {
            replies_aggregate: [
              {
                where: {
                  created_at: {
                    _gte: dayAgo,
                  },
                  activity: {
                    private_stream: { _eq: true },
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          today_reactions: {
            reactions_aggregate: [
              {
                where: {
                  created_at: {
                    _gte: dayAgo,
                  },
                  activity: {
                    private_stream: { _eq: true },
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          today_posts: {
            activities_aggregate: [
              {
                where: {
                  created_at: {
                    _gte: dayAgo,
                  },
                  private_stream: { _eq: true },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          today_cosouls: {
            cosouls_aggregate: [
              {
                where: {
                  created_at: {
                    _gte: dayAgo,
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_buys: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: true },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_sells: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: false },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_users: {
            link_tx_aggregate: [
              {
                where: {
                  buy: { _eq: true },
                  supply: { _eq: 1 },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_replies: {
            replies_aggregate: [
              {
                where: {
                  activity: {
                    private_stream: { _eq: true },
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_reactions: {
            reactions_aggregate: [
              {
                where: {
                  activity: {
                    private_stream: { _eq: true },
                  },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_posts: {
            activities_aggregate: [
              {
                where: {
                  private_stream: { _eq: true },
                },
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_cosouls: {
            cosouls_aggregate: [
              {
                where: {},
              },
              { aggregate: { count: [{}, true] } },
            ],
          },
          total_links: {
            link_holders_aggregate: [
              {},
              // @ts-ignore
              { aggregate: { sum: [{}, { amount: true }] } },
            ],
          },
        },
      },
      {
        operationName: 'postmark__sendDailyReport',
      }
    );

    await sendDailySpacecar({
      email: EMAIL_FOR_REPORTS,
      today_buy_tx_count: today_buys.aggregate?.count ?? 0,
      today_sell_tx_count: today_sells.aggregate?.count ?? 0,
      total_links: total_links.aggregate?.sum ?? 0,
      today_new_users: today_new_users.aggregate?.count ?? 0,
      today_tx_count:
        (today_buys.aggregate?.count ?? 0) +
        (today_sells.aggregate?.count ?? 0),
      today_new_cosouls: today_cosouls.aggregate?.count ?? 0,
      today_posts: today_posts.aggregate?.count ?? 0,
      today_reactions: today_reactions.aggregate?.count ?? 0,
      today_replies: today_replies.aggregate?.count ?? 0,
      total_buy_tx_count: total_buys.aggregate?.count ?? 0,
      total_sell_tx_count: total_sells.aggregate?.count ?? 0,
      total_users: total_users.aggregate?.count ?? 0,
      total_tx_count:
        (total_buys.aggregate?.count ?? 0) +
        (total_sells.aggregate?.count ?? 0),
      total_cosouls: total_cosouls.aggregate?.count ?? 0,
      total_posts: total_posts.aggregate?.count ?? 0,
      total_reactions: total_reactions.aggregate?.count ?? 0,
      total_replies: total_replies.aggregate?.count ?? 0,
    });
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export default verifyHasuraRequestMiddleware(handler);
