import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';
import fetch from 'node-fetch';

import {
  HASURA_GRAPHQL_ADMIN_SECRET,
  NODE_HASURA_URL,
} from '../../../api-lib/config';
import {
  insertContributionActivity,
  insertNewEpochActivity,
  insertNewUserActivity,
} from '../../../api-lib/event_triggers/activity';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

import { insertEpochEndActivity, insertEpochStartActivity } from './epochs';

Settings.defaultZone = 'utc';

const START_DATE = `2023-01-01`;
const BATCH_SIZE = 500;

async function handler(req: VercelRequest, res: VercelResponse) {
  // start with epochs
  const { epochs_handled } = await buildEpochsActivity();
  if (epochs_handled.length != 0) {
    // still working on epochs
    return res.status(200).json({
      message: `processed ${epochs_handled.length} epochs. still waiting to do users and contributions`,
      epochs_handled,
    });
  }

  // done w/ epochs!
  const { users_handled } = await buildUsersActivity();
  if (users_handled.length != 0) {
    // still working on users
    return res.status(200).json({
      message: `processed ${users_handled.length} users. still waiting to do contributions`,
      users_handled,
    });
  }

  // done w/ users!
  const { contributions_handled } = await buildContributionsActivity();
  if (contributions_handled.length != 0) {
    // still working on contributions
    return res.status(200).json({
      message: `processed ${contributions_handled.length} contributions`,
      users_handled,
    });
  }

  return res.status(200).json({
    message: `nothing left to do - this cron can be disabled`,
  });
}

const buildEpochsActivity = async () => {
  const sql = `select e.id,e.circle_id,o.id,e.start_date,e.end_date,e.created_at,e.created_by from epoches e 
join circles c on c.id = e.circle_id 
join organizations o on o.id=c.organization_id 
left outer join activities a on (a.epoch_id=e.id) 
where e.start_date > '${START_DATE}' AND c.deleted_at is null AND a.id is null 
order by e.id asc limit ${BATCH_SIZE}`;

  const results = await runSql(sql);
  const epochs = results.map(a => {
    const endDate = DateTime.fromISO(a[4]);
    // console.log(a);
    return {
      id: parseInt(a[0]),
      circle_id: parseInt(a[1]),
      organization_id: parseInt(a[2]),
      start_date: a[3],
      end_date: endDate <= DateTime.now() ? a[4] : undefined,
      created_at: a[5],
      created_by: a[6] != 'NULL' ? parseInt(a[6]) : undefined,
    };
  });

  for (const e of epochs) {
    await insertNewEpochActivity({
      epoch_id: e.id,
      circle_id: e.circle_id,
      organization_id: e.organization_id,
      actor_profile_id: e.created_by,
      created_at: e.created_at,
    });
    await insertEpochStartActivity(e);
    if (e.end_date) {
      await insertEpochEndActivity(e);
    }
  }

  return { epochs_handled: epochs.map(e => e.id) };
};

const buildUsersActivity = async () => {
  const sql = `select u.id, u.circle_id, o.id, p.id, u.created_at from users u
 join circles c on c.id = u.circle_id join organizations o on o.id=c.organization_id 
 join profiles p on p.address=u.address 
 left outer join activities a on (a.user_id=u.id) 
 where u.created_at > '${START_DATE}' AND u.deleted_at is null AND c.deleted_at is null AND a.id is null 
 order by u.id asc limit ${BATCH_SIZE}`;

  const results = await runSql(sql);
  const users = results.map(a => ({
    user_id: parseInt(a[0]),
    circle_id: parseInt(a[1]),
    organization_id: parseInt(a[2]),
    target_profile_id: parseInt(a[3]),
    created_at: a[4],
  }));

  for (const u of users) {
    await insertNewUserActivity(u);
  }

  return { users_handled: users.map(u => u.user_id) };
};

const buildContributionsActivity = async () => {
  const sql = `select b.id, b.circle_id, o.id, p.id, b.created_at from contributions b
 join circles c on c.id = b.circle_id 
 join organizations o on o.id=c.organization_id 
 join users u on u.id=b.user_id 
 join profiles p on p.address=u.address 
 left outer join activities a on (a.contribution_id=b.id) 
 where b.created_at > '${START_DATE}' AND b.deleted_at is null AND 
 u.deleted_at is null AND c.deleted_at is null AND a.id is null 
 order by b.id asc limit ${BATCH_SIZE}`;

  const results = await runSql(sql);
  const contributions = results.map(a => ({
    contribution_id: parseInt(a[0]),
    circle_id: parseInt(a[1]),
    organization_id: parseInt(a[2]),
    actor_profile_id: parseInt(a[3]),
    created_at: a[4],
  }));

  for (const c of contributions) {
    await insertContributionActivity(c);
  }

  return { contributions_handled: contributions.map(c => c.contribution_id) };
};

const runSql = async (sql: string) => {
  const sqlObject = {
    type: 'run_sql',
    args: {
      source: 'default',
      sql,
    },
  };

  const sqlQueryUrl = NODE_HASURA_URL.replace('v1/graphql', 'v2/query');
  const res = await fetch(sqlQueryUrl, {
    method: 'POST',
    body: JSON.stringify(sqlObject),
    headers: {
      'X-Hasura-Role': 'admin',
      'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
    },
  });
  const j: { result: string[][] } = await res.json();
  // console.log(j);
  const results = j.result;
  results.shift();
  return results;
};

export default verifyHasuraRequestMiddleware(handler);
