import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { sendCoLinksBigQuestionEmail } from '../../../api-lib/email/postmark';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { BaseHttpError, errorResponse } from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { IN_DEVELOPMENT } from '../../../src/config/env';

import { unverifyUserEmail } from './colinksNotificationEmails';

export const isRejected = (
  response: PromiseSettledResult<unknown>
): response is PromiseRejectedResult => response.status === 'rejected';

async function sendEmailAndUpdateProfile({
  profileId,
  email,
  bigQuestionId,
  bigQuestionPrompt,
}: {
  profileId: number;
  email: string;
  bigQuestionId: number;
  bigQuestionPrompt: string;
}) {
  await sendCoLinksBigQuestionEmail({
    email,
    profile_id: profileId,
    big_question_id: bigQuestionId,
    big_question_prompt: bigQuestionPrompt,
  });
  await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: profileId },
          _set: {
            last_emailed_big_question_id: bigQuestionId,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'bigQuestionEmails__updateLastEmailed' }
  );
  return;
}

async function getEligibleUsersWithEmails(big_question_id: number) {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            colinks_product_emails: { _eq: true },
            links: { _gt: 0 },
            emails: {
              verified_at: { _is_null: false },
            },
            _or: [
              { last_emailed_big_question_id: { _neq: big_question_id } },
              { last_emailed_big_question_id: { _is_null: true } },
            ],
          },
          limit: 100,
        },
        {
          id: true,
          last_emailed_big_question_id: true,
          emails: [
            {
              where: {
                primary: { _eq: true },
                verified_at: { _is_null: false },
              },
            },
            { email: true },
          ],
        },
      ],
    },
    { operationName: 'bigQuestionEmails__getEligibleUsers' }
  );

  // eslint-disable-next-line no-console
  console.log(`found ${profiles.length} profiles this batch`, profiles);
  return profiles;
}

async function getActiveBigQuestion() {
  // start sending big question emails 24 hours after big question goes live
  const now = DateTime.now();
  const published_before = now.minus({ hours: 24 });

  const { big_questions } = await adminClient.query(
    {
      big_questions: [
        {
          where: {
            _and: [
              { publish_at: { _lt: published_before.toISO() } },
              { expire_at: { _gt: now.toISO() } },
            ],
          },
          limit: 1,
        },
        {
          id: true,
          prompt: true,
        },
      ],
    },
    { operationName: 'bigQuestionEmails__getActiveBigQuestion' }
  );

  return big_questions.pop();
}

async function handler(req: VercelRequest, res: VercelResponse) {
  if (IN_DEVELOPMENT) {
    return res.status(200).json({ success: true });
  }

  const big_question = await getActiveBigQuestion();

  if (!big_question) {
    console.error('No active big question found');
    return res.status(200).json({ success: true });
  }

  const profiles = await getEligibleUsersWithEmails(big_question.id);

  // email and update last emailed big question id
  try {
    const responses = await Promise.allSettled(
      profiles.map(async profile => {
        if (!profile.emails?.[0]?.email) {
          // eslint-disable-next-line no-console
          console.log('no email for profile', { profile });
          return;
        }
        try {
          await sendEmailAndUpdateProfile({
            profileId: profile.id,
            email: profile.emails[0].email,
            bigQuestionId: big_question.id,
            bigQuestionPrompt: big_question.prompt,
          });
          return;
        } catch (e) {
          if (e instanceof BaseHttpError && e.httpStatus === 406) {
            unverifyUserEmail({
              profileId: profile.id,
              email: profile.emails[0].email,
            });
          }
          return Promise.reject(e);
        }
      })
    );
    const errors = responses.filter(isRejected);

    if (errors.length > 0) {
      const errorMessages = errors.map(err => {
        if (err.reason instanceof Error) {
          return err.reason.stack;
        } else {
          return String(err.reason);
        }
      });
      console.error(
        `Error sending colinks big question emails emails: ${errorMessages.join('\n')}`
      );
      throw new Error(errorMessages.join('\n'));
    }
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export default verifyHasuraRequestMiddleware(handler);
