import fetch from 'node-fetch';

import { IN_PREVIEW, IN_PRODUCTION } from '../src/config/env';

import { POSTMARK_SERVER_TOKEN } from './config';

const HELP_URL = 'https://docs.coordinape.com';
const API_BASE_URL = 'https://api.postmarkapp.com';
const FROM_EMAIL = 'support@coordinape.com';
const FROM_NAME = 'Coordinape';

const TEMPLATE_VERIFY = 'verify_email';
const TEMPLATE_WELCOME = 'welcome';
type TemplateAliases = typeof TEMPLATE_VERIFY | typeof TEMPLATE_WELCOME;

// get base url for staging, prod, or localhost
export const URL_BASE = IN_PRODUCTION
  ? 'https://app.coordinape.com'
  : IN_PREVIEW
  ? `https://${process.env.VERCEL_BRANCH_URL}`
  : 'http://localhost:3000';

const BASE_INPUT = {
  help_url: HELP_URL,
};

export async function sendVerifyEmail(params: {
  name: string;
  email: string;
  verification_code: string;
}) {
  const input = {
    name: params.name,
    action_url: URL_BASE + '/api/email/verify/' + params.verification_code,
  };
  const res = await sendEmail(params.email, TEMPLATE_VERIFY, input);
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
