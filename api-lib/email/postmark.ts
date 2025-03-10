import { webAppURL } from '../../src/config/webAppURL';
import { coLinksPaths } from '../../src/routes/paths';
import { POSTMARK_SERVER_TOKEN } from '../config';
import { adminClient } from '../gql/adminClient';
import { BaseHttpError } from '../HttpError';

import { EmailType, genToken } from './unsubscribe';

const HELP_URL = 'https://docs.coordinape.com';
const API_BASE_URL = 'https://api.postmarkapp.com';
const FROM_EMAIL_GIFT = 'support@coordinape.com';
const FROM_EMAIL_COLINKS = 'colinks@coordinape.com';
const FROM_NAME_GIFT = 'Coordinape';
const FROM_NAME_COLINKS = 'CoLinks';

const TEMPLATES = {
  VERIFY: 'verify_email',
  COLINKS_VERIFY: 'colinks_verify_email',
  COLINKS_WAITLIST_VERIFY: 'colinks_waitlist_verify',
  COLINKS_WAITLIST_WELCOME: 'colinks_waitlist_welcome',
  COLINKS_WAITLIST_INVITED: 'colinks_waitlist_invited',
  COLINKS_NOTIFICATIONS: 'colinks_notification',
  COLINKS_BIG_QUESTION: 'colinks_big_question',
  EPOCH_ENDED: 'epoch_ended',
  EPOCH_STARTED: 'epoch_started',
  EPOCH_ENDING_SOON: 'epoch_ending_soon',
  WELCOME: 'welcome',
  DAILY_SPACECAR: 'daily_spacecar',
  REPORT_HOURLY: 'report_hourly',
} as const;

type TemplateAliases = (typeof TEMPLATES)[keyof typeof TEMPLATES];

// get base url for staging, prod, or localhost

const BASE_INPUT = {
  help_url: HELP_URL,
};

// TODO: use this function
export async function fetchVerifiedEmail(profileId: number) {
  const { emails } = await adminClient.query(
    {
      emails: [
        {
          where: {
            profile_id: { _eq: profileId },
            verified_at: { _is_null: false },
            primary: { _eq: true },
          },
          limit: 1,
        },
        {
          email: true,
        },
      ],
    },
    {
      operationName: 'postmark__fetchVerifiedEmail',
    }
  );

  return emails[0]?.email;
}

export async function sendCoLinksWaitlistWelcomeEmail(params: {
  email: string;
}) {
  const input = {
    action_url: webAppURL('colinks') + coLinksPaths.wizard,
  };
  const res = await sendEmail(
    params.email,
    TEMPLATES.COLINKS_WAITLIST_WELCOME,
    input,
    'colinks'
  );
  return res;
}
export async function sendCoLinksWaitlistVerifyEmail(params: {
  email: string;
  verification_code: string;
}) {
  const input = {
    action_url:
      webAppURL('colinks') +
      coLinksPaths.verifyWaitList(params.verification_code),
  };
  const res = await sendEmail(
    params.email,
    TEMPLATES.COLINKS_WAITLIST_VERIFY,
    input,
    'colinks'
  );
  return res;
}

export async function sendCoLinksWaitlistInvitedEmail(params: {
  email: string;
  inviteCode: string;
}) {
  const input = {
    action_url: webAppURL('colinks') + coLinksPaths.wizard,
    invite_code: params.inviteCode,
  };
  const res = await sendEmail(
    params.email,
    TEMPLATES.COLINKS_WAITLIST_INVITED,
    input,
    'colinks'
  );
  return res;
}

export async function sendCoLinksNotificationsEmail(params: {
  email: string;
  profile_id: number;
}) {
  const token = genToken(
    params.profile_id.toString(),
    params.email,
    EmailType.COLINKS_NOTIFICATION
  );
  const input = {
    action_url: webAppURL('colinks') + coLinksPaths.notifications,
    unsubscribe_url: webAppURL('colinks') + '/email/unsubscribe/' + token,
  };
  // eslint-disable-next-line no-console
  console.log('sending email to', params.email, 'with', { input });
  const res = await sendEmail(
    params.email,
    TEMPLATES.COLINKS_NOTIFICATIONS,
    input,
    'colinks'
  );
  return res;
}

export async function sendCoLinksBigQuestionEmail(params: {
  email: string;
  profile_id: number;
  big_question_id: number;
  big_question_prompt: string;
}) {
  const token = genToken(
    params.profile_id.toString(),
    params.email,
    EmailType.COLINKS_HOT_HAPPENINGS
  );
  const input = {
    action_url:
      webAppURL('colinks') +
      coLinksPaths.bigQuestion(params.big_question_id.toString()),
    unsubscribe_url: webAppURL('colinks') + '/email/unsubscribe/' + token,
    big_question_prompt: params.big_question_prompt,
    big_question_image_url:
      webAppURL('colinks') +
      '/api/og/bqimage/' +
      params.big_question_id.toString(),
  };
  // eslint-disable-next-line no-console
  console.log('sending big question email to', params.email, 'with', { input });
  const res = await sendEmail(
    params.email,
    TEMPLATES.COLINKS_BIG_QUESTION,
    input,
    'colinks'
  );
  return res;
}

export async function sendDailySpacecar(params: {
  email: string;
  today_buy_tx_count: number;
  today_sell_tx_count: number;
  today_give_count: number;
  today_new_users: number;
  today_new_colinks_users: number;
  today_tx_count: number;
  today_new_cosouls: number;
  today_posts: number;
  today_reactions: number;
  today_replies: number;
  total_give_count: number;
  total_buy_tx_count: number;
  total_sell_tx_count: number;
  total_users: number;
  total_colinks_users: number;
  total_tx_count: number;
  total_cosouls: number;
  total_posts: number;
  total_reactions: number;
  total_replies: number;
  total_links: number;
}) {
  const res = await sendEmail(
    params.email,
    TEMPLATES.DAILY_SPACECAR,
    params,
    'colinks'
  );
  return res;
}

export async function sendHourlyReport(params: {
  email: string;
  new_users: number;
}) {
  const res = await sendEmail(
    params.email,
    TEMPLATES.REPORT_HOURLY,
    params,
    'colinks'
  );
  return res;
}

export async function sendVerifyEmail(params: {
  name: string;
  email: string;
  verification_code: string;
  coLinks: boolean;
}) {
  const input = {
    name: params.name,
    action_url:
      webAppURL(params.coLinks ? 'colinks' : 'give') +
      '/email/verify/' +
      params.verification_code,
  };
  const res = await sendEmail(
    params.email,
    params.coLinks ? TEMPLATES.COLINKS_VERIFY : TEMPLATES.VERIFY,
    input,
    params.coLinks ? 'colinks' : 'gift_circle'
  );
  return res;
}

// TODO: only send to verified primary emails
export async function sendEpochEndedEmail(params: {
  email: string;
  circle_name: string;
  circle_id: number;
  epoch_id: number;
  profile_id: number;
  num_give_senders: number;
  num_notes_received: number;
}) {
  const token = genToken(
    params.profile_id.toString(),
    params.email,
    EmailType.CIRCLE_NOTIFICATION
  );

  const input = {
    circle_name: params.circle_name,
    epoch_id: params.epoch_id,
    num_give_senders: params.num_give_senders,
    num_notes_received: params.num_notes_received,
    action_url: `${webAppURL('give')}/circles/${params.circle_id}/epochs`,
    unsubscribe_url: webAppURL('give') + '/email/unsubscribe/' + token,
  };
  const res = await sendEmail(
    params.email,
    TEMPLATES.EPOCH_ENDED,
    input,
    'gift_circle'
  );
  return res;
}

export async function sendEpochEndingSoonEmail(params: {
  email: string;
  circle_name: string;
  circle_id: number;
  epoch_id: number;
  profile_id: number;
}) {
  const token = genToken(
    params.profile_id.toString(),
    params.email,
    EmailType.CIRCLE_NOTIFICATION
  );

  const input = {
    circle_name: params.circle_name,
    epoch_id: params.epoch_id,
    action_url: `${webAppURL('give')}/circles/${params.circle_id}/give`,
    unsubscribe_url: webAppURL('give') + '/email/unsubscribe/' + token,
  };
  const res = await sendEmail(
    params.email,
    TEMPLATES.EPOCH_ENDING_SOON,
    input,
    'gift_circle'
  );
  return res;
}

export async function sendEpochStartedEmail(params: {
  email: string;
  circle_name: string;
  circle_id: number;
  epoch_id: number;
  profile_id: number;
}) {
  const token = genToken(
    params.profile_id.toString(),
    params.email,
    EmailType.CIRCLE_NOTIFICATION
  );

  const input = {
    circle_name: params.circle_name,
    epoch_id: params.epoch_id,
    action_url: `${webAppURL('give')}/circles/${params.circle_id}/give`,
    unsubscribe_url: webAppURL('give') + '/email/unsubscribe/' + token,
  };
  const res = await sendEmail(
    params.email,
    TEMPLATES.EPOCH_STARTED,
    input,
    'gift_circle'
  );
  return res;
}

async function sendEmail(
  to: string,
  templateAlias: TemplateAliases,
  templateModel: Record<string, unknown>,
  from: 'colinks' | 'gift_circle'
) {
  const response = await fetch(`${API_BASE_URL}/email/withTemplate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify({
      From:
        from === 'colinks'
          ? `${FROM_NAME_COLINKS} <${FROM_EMAIL_COLINKS}>`
          : `${FROM_NAME_GIFT} <${FROM_EMAIL_GIFT}>`,
      To: to,
      TemplateAlias: templateAlias,
      TemplateModel: { ...BASE_INPUT, ...templateModel },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const error = new BaseHttpError('failed to send email');
    error.message += `: ${errorBody}`;
    error.httpStatus = JSON.parse(errorBody).ErrorCode ?? response.status;
    console.error(error);
    throw error;
  }
  return response;
}
