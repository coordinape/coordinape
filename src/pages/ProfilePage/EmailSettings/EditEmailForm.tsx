import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';

import { useToast } from '../../../hooks';
import { Trash2 } from '../../../icons/__generated';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';
import { Awaited } from '../../../types/shim';
import { Button, Flex, Link, Panel, Text, TextField } from 'ui';

const getEmails = async () => {
  const { emails } = await client.query(
    {
      emails: [
        {
          order_by: [
            {
              primary: order_by.desc,
            },
            {
              verified_at: order_by.asc,
            },
            {
              email: order_by.desc,
            },
          ],
        },
        {
          email: true,
          verified_at: true,
          primary: true,
        },
      ],
    },
    {
      operationName: 'getEmails',
    }
  );
  return emails;
};

export const EditEmailForm = () => {
  const [emailToAdd, setEmailToAdd] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const [showSuccessEmail, setShowSuccessEmail] = useState<string | undefined>(
    undefined
  );

  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  const { data: emails } = useQuery('emails', async () => {
    return getEmails();
  });

  useEffect(() => {
    if (emails) {
      for (const e of emails) {
        if (e.verified_at && e.email == showSuccessEmail) {
          setShowSuccessEmail(undefined);
        }
      }
    }
  }, [emails]);
  const addEmail = async () => {
    if (emailToAdd) {
      setAdding(true);
      try {
        await client.mutate(
          {
            addEmail: [
              {
                payload: { email: emailToAdd },
              },
              {
                success: true,
              },
            ],
          },
          {
            operationName: 'addEmail',
          }
        );
        setEmailToAdd('');
        setShowSuccessEmail(emailToAdd);
        showSuccess(`Email verification sent to ${emailToAdd}`);
        await queryClient.invalidateQueries('emails');
      } catch (e: any) {
        showError(e);
      } finally {
        setAdding(false);
      }
    }
  };

  return (
    <>
      <Text h2>Email Addresses</Text>
      <Flex
        column
        css={{ my: '$md', '>*': { borderBottom: '1px solid $borderDim' } }}
      >
        {emails === undefined ? (
          <Text>Loading</Text>
        ) : (
          emails.map(e => (
            <EmailRow
              e={e}
              key={e.email}
              showCheckVerify={setShowSuccessEmail}
            />
          ))
        )}
      </Flex>
      <Text css={{ my: '$md' }}>
        Connect an email address to your account to receive notifications and
        prove membership in a domain. You can add multiple email addresses but
        you will only receive notifications on your primary address.
      </Text>
      <Flex>
        <TextField
          placeholder="add email address"
          css={{ mr: '$md', flexGrow: 1 }}
          value={emailToAdd}
          onChange={e => setEmailToAdd(e.target.value)}
        />
        <Button color="cta" onClick={() => addEmail()} disabled={adding}>
          Add Email
        </Button>
      </Flex>
      {showSuccessEmail && (
        <Panel neutral css={{ mt: '$lg' }}>
          <Text>
            Check your email for {showSuccessEmail} and click the Verify Email
            button.
          </Text>
        </Panel>
      )}
    </>
  );
};

const EmailRow = ({
  e,
  showCheckVerify,
}: {
  e: Awaited<ReturnType<typeof getEmails>>[number];
  showCheckVerify(email: string): void;
}) => {
  const queryClient = useQueryClient();

  const { showError, showSuccess } = useToast();

  const makePrimary = async (email: string) => {
    try {
      await client.mutate(
        {
          setPrimaryEmail: [
            {
              payload: { email },
            },
            {
              success: true,
            },
          ],
        },
        {
          operationName: 'setPrimaryEmail',
        }
      );
      await queryClient.invalidateQueries('emails');
      showSuccess('Email set as primary');
    } catch (e) {
      showError(e);
    }
  };

  const deleteEmail = async (email: string) => {
    try {
      await client.mutate(
        {
          deleteEmail: [
            {
              payload: { email },
            },
            {
              success: true,
            },
          ],
        },
        {
          operationName: 'deleteEmail',
        }
      );
      await queryClient.invalidateQueries('emails');
      showSuccess('Email deleted');
    } catch (e) {
      showError(e);
    }
  };

  const resendVerify = async (email: string) => {
    try {
      await client.mutate(
        {
          addEmail: [
            {
              payload: { email },
            },
            {
              success: true,
            },
          ],
        },
        {
          operationName: 'addEmail',
        }
      );
      showSuccess(`Email verification re-sent to ${email}`);
      await queryClient.invalidateQueries('emails');
      showCheckVerify(email);
    } catch (e) {
      showError(e);
    }
  };

  return (
    <Flex alignItems="center" key={e.email} css={{ gap: '$md', py: '$md' }}>
      <Text semibold={e.primary} css={{ flexGrow: 1 }}>
        {e.email}
      </Text>
      {!e.verified_at && (
        <>
          <Text tag color={'warning'}>
            Not Verified
            <Link
              onClick={() => resendVerify(e.email)}
              css={{
                color: 'inherit',
                fontSize: '85%',
                fontWeight: 'normal',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Resend
            </Link>
          </Text>
        </>
      )}
      {e.primary && (
        <Text tag color={'secondary'}>
          primary
        </Text>
      )}
      {!e.primary && e.verified_at && (
        <Button
          color="secondary"
          size="xs"
          onClick={() => makePrimary(e.email)}
        >
          Make Primary
        </Button>
      )}
      <Button
        color="transparent"
        size="xs"
        onClick={() => deleteEmail(e.email)}
        css={{ p: 0, '&:hover, &:focus': { color: '$destructiveButton' } }}
      >
        <Trash2 />
      </Button>
    </Flex>
  );
};
