import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { formatCustomDate } from '../../../../api-lib/dateTimeHelpers';
import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { uploadCsv } from '../../../../api-lib/s3';
import { GHOUL_CONTRACT } from '../../cron/fetchNFTOwners.ts';

import { hasGhoulNft } from './createCoLinksGive.ts';

const skillCsvInput = z
  .object({
    skill: z.string(),
  })
  .strict();

const LIMIT = 10000;

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, skillCsvInput);

  const { skill } = payload;

  const userValues = await generateCsvValues(skill, skill === 'bones', LIMIT);

  const nftAddress = '0xyep';

  const headers = [
    'name',
    'address',
    'received',
    'received_last_24_hours',
    'received_last_7_days',
    'received_last_30_days',
    'sent',
  ];
  if (nftAddress) {
    headers.push('nft_address');
    headers.push('has_nft');
  }
  let csvText = `${headers.join(',')}\r\n`;
  userValues.forEach(rowValues => {
    csvText += `${rowValues.join(',')}\r\n`;
  });
  const fileName = `give-${skill}-date-${formatCustomDate(
    DateTime.now(),
    'ddLLyy'
  )}.csv`;
  const result = await uploadCsv(
    `give/${skill}/${uuidv4()}/${fileName}`,
    csvText
  );

  res.status(200).json({
    file: result.Location,
  });
}

export async function generateCsvValues(
  skill: string,
  ghoulCheck: boolean,
  limit: number
) {
  assert(skill, 'No Skill Found');

  const { colinks_gives_skill_count } = await adminClient.query(
    {
      colinks_gives_skill_count: [
        {
          where: {
            skill: {
              _ilike: skill,
            },
          },
          order_by: [
            {
              gives: order_by.desc_nulls_last,
            },
            {
              target_profile_public: {
                name: order_by.asc_nulls_last,
              },
            },
          ],
          limit: limit,
        },
        {
          target_profile_public: {
            name: true,
            address: true,
            id: true,
            colinks_give_sent_skill_count: [
              {
                where: {
                  skill: { _eq: skill },
                },
              },
              {
                gives_sent: true,
              },
            ],
          },
          gives: true,
          gives_last_24_hours: true,
          gives_last_7_days: true,
          gives_last_30_days: true,
          // TODO: give sent
        },
      ],
    },
    {
      operationName: 'getGiveCSV_' + skill,
    }
  );

  return await Promise.all(
    colinks_gives_skill_count
      ?.filter(u => !!u.target_profile_public)
      .map(async u => {
        assert(u.target_profile_public);

        const nft = ghoulCheck
          ? [
              GHOUL_CONTRACT.address,
              await hasGhoulNft(u.target_profile_public.id),
            ]
          : [];
        const rowValues: (string | number)[] = [
          u.target_profile_public.name,
          u.target_profile_public.address,
          u.gives,
          u.gives_last_24_hours,
          u.gives_last_7_days,
          u.gives_last_30_days,
          u.target_profile_public.colinks_give_sent_skill_count?.[0]
            ?.gives_sent ?? 0,
          ...nft,
        ];
        return rowValues;
      }) || []
  );
}

export default handler;
