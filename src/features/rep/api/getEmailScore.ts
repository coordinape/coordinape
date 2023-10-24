import { adminClient } from '../../../../api-lib/gql/adminClient';

const EMAIL_SCORE_MAX = 100;
const EMAIL_SCORE_PER_DOMAIN = 50;

export const getEmailScore = async (profileId: number) => {
  const { emails } = await adminClient.query(
    {
      emails: [
        {
          where: {
            profile_id: { _eq: profileId },
          },
        },
        {
          email: true,
        },
      ],
    },
    {
      operationName: 'get_emails_for_score',
    }
  );

  // TODO: only score if they allow this domain name on their profile?
  const uniqueDomains: Set<string> = new Set();

  for (const email of emails) {
    const [, domain] = email.email.split('@');
    uniqueDomains.add(domain);
  }
  const score = Math.min(
    EMAIL_SCORE_MAX,
    uniqueDomains.size * EMAIL_SCORE_PER_DOMAIN
  );
  return score;
};
