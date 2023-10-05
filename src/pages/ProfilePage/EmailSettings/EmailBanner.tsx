import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { Link, Text } from 'ui';

import { EmailModal } from './EmailModal';

const getEmails = async () => {
  const { emails } = await client.query(
    {
      emails: [
        {
          order_by: [
            {
              email: order_by.desc,
            },
          ],
        },
        {
          email: true,
          verified_at: true,
        },
      ],
    },
    {
      operationName: 'getEmails',
    }
  );
  return emails;
};

const getVerifiedEmails = async () => {
  const { emails } = await client.query(
    {
      emails: [
        { where: { verified_at: { _is_null: false } } },
        {
          email: true,
          verified_at: true,
        },
      ],
    },
    {
      operationName: 'getEmails',
    }
  );
  return emails;
};

export const EmailBanner = () => {
  const { data: emails } = useQuery('emails', async () => {
    return getEmails();
  });
  const { data: verifiedEmails } = useQuery('verifiedEmails', async () => {
    return getVerifiedEmails();
  });
  return (
    <>
      {emails?.length && verifiedEmails?.length == 0 && (
        <Text tag color="warning" css={{ borderRadius: 0, p: '$sm' }}>
          <EmailModal>
            <Link inlineLink>Verify your email address</Link>
          </EmailModal>
        </Text>
      )}
    </>
  );
};
