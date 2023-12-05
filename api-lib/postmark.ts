import fetch from 'node-fetch';

import { webAppURL } from '../src/config/webAppURL';
import { coLinksPaths } from '../src/routes/paths';

import { POSTMARK_SERVER_TOKEN } from './config';
import { adminClient } from './gql/adminClient';

const HELP_URL = 'https://docs.coordinape.com';
const API_BASE_URL = 'https://api.postmarkapp.com';
const FROM_EMAIL = 'support@coordinape.com';
const FROM_NAME = 'Coordinape';

const TEMPLATES = {
  VERIFY: 'verify_email',
  COLINKS_WAITLIST_VERIFY: 'colinks_waitlist_verify',
  COLINKS_WAITLIST_WELCOME: 'colinks_waitlist_welcome',
  EPOCH_ENDED: 'epoch_ended',
  EPOCH_STARTED: 'epoch_started',
  EPOCH_ENDING_SOON: 'epoch_ending_soon',
  WELCOME: 'welcome',
} as const;

type TemplateAliases = typeof TEMPLATES[keyof typeof TEMPLATES];

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
    input
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
    input
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
  const res = await sendEmail(params.email, TEMPLATES.VERIFY, input);
  return res;
}

// TODO: only send to verified primary emails
export async function sendEpochEndedEmail(params: {
  email: string;
  circle_name: string;
  circle_id: number;
  epoch_id: number;
  num_give_senders: number;
  num_notes_received: number;
}) {
  const input = {
    circle_name: params.circle_name,
    epoch_id: params.epoch_id,
    num_give_senders: params.num_give_senders,
    num_notes_received: params.num_notes_received,
    action_url: `${webAppURL('give')}/circles/${params.circle_id}/epochs`,
  };
  const res = await sendEmail(params.email, TEMPLATES.EPOCH_ENDED, input);
  return res;
}

export async function sendEpochEndingSoonEmail(params: {
  email: string;
  circle_name: string;
  circle_id: number;
  epoch_id: number;
}) {
  const input = {
    circle_name: params.circle_name,
    epoch_id: params.epoch_id,
    action_url: `${webAppURL('give')}/circles/${params.circle_id}/give`,
  };
  const res = await sendEmail(params.email, TEMPLATES.EPOCH_ENDING_SOON, input);
  return res;
}

export async function sendEpochStartedEmail(params: {
  email: string;
  circle_name: string;
  circle_id: number;
  epoch_id: number;
}) {
  const input = {
    circle_name: params.circle_name,
    epoch_id: params.epoch_id,
    action_url: `${webAppURL('give')}/circles/${params.circle_id}/give`,
  };
  const res = await sendEmail(params.email, TEMPLATES.EPOCH_STARTED, input);
  return res;
}

async function sendEmail(
  to: string,
  templateAlias: TemplateAliases,
  templateModel: Record<string, unknown>
) {
  const response = await fetch(`${API_BASE_URL}/email/withTemplate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: to,
      TemplateAlias: templateAlias,
      TemplateModel: { ...BASE_INPUT, ...templateModel },
    }),
  });
  // TODO: better error handling
  if (!response.ok) {
    console.error(await response.text());
    throw new Error('failed to send email');
  }
  return response;
}
