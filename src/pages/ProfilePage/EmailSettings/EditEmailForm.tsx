import assert from 'assert';
import { useEffect, useState } from 'react';

import { useAuthStore } from 'features/auth';
import { useQuery, useQueryClient } from 'react-query';

import { useToast } from '../../../hooks';
import { Trash2 } from '../../../icons/__generated';
import { order_by } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';
import { Awaited } from '../../../types/shim';
import { Button, HR, CheckBox, Flex, Link, Panel, Text, TextField } from 'ui';

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

const updateEmailSettings = async (
  profileId: number,
  settings: { app_emails: boolean; product_emails: boolean }
) => {
  return await client.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: profileId },
          _set: settings,
        },
        {
          id: true,
          app_emails: true,
          product_emails: true,
        },
      ],
    },
    {
      operationName: 'updateAppEmails',
    }
  );
};

const getEmailSettings = async (profileId: number) => {
  const { profiles_by_pk } = await client.query(
    {
      profiles_by_pk: [
        { id: profileId },
        { app_emails: true, product_emails: true },
      ],
    },
    {
      operationName: 'getEmailSettings',
    }
  );
  assert(profiles_by_pk);
  return profiles_by_pk;
};

export const EditEmailForm = () => {
  const [emailToAdd, setEmailToAdd] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const [showSuccessEmail, setShowSuccessEmail] = useState<string | undefined>(
    undefined
  );

  const queryClient = useQueryClient();
  const profileId = useAuthStore(state => state.profileId);
  assert(profileId);

  const { showError, showSuccess } = useToast();

  const { data: email_settings } = useQuery(
    ['email_settings', profileId],
    () => {
      return getEmailSettings(profileId);
    },
    { enabled: !!profileId }
  );

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
      <Flex
        column
        css={{
          mb: '$md',
          '>*': { borderBottom: '1px solid $borderDim' },
        }}
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
      <Flex column css={{ my: '$lg' }}>
        <Text bold h2>
          Subscription settings
        </Text>
        <HR />
        {!!email_settings && (
          <Flex column>
            <Flex row>
              <CheckBox
                value={email_settings?.app_emails}
                label="Receive transactional email notifications"
                onChange={e => {
                  updateEmailSettings(profileId, {
                    ...email_settings,
                    app_emails: e,
                  });
                  queryClient.setQueryData(['email_settings', profileId], {
                    ...email_settings,
                    app_emails: e,
                  });
                }}
              ></CheckBox>
            </Flex>
            <Flex row>
              <CheckBox
                value={email_settings?.product_emails}
                label="Receive product update emails"
                onChange={e => {
                  updateEmailSettings(profileId, {
                    ...email_settings,
                    product_emails: e,
                  });
                  queryClient.setQueryData(['email_settings', profileId], {
                    ...email_settings,
                    product_emails: e,
                  });
                }}
              ></CheckBox>
            </Flex>
          </Flex>
        )}
        {showSuccessEmail && (
          <Panel neutral css={{ mt: '$lg' }}>
            <Text>
              Check your email for {showSuccessEmail} and click the Verify Email
              button.
            </Text>
          </Panel>
        )}
      </Flex>
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
    <Flex
      alignItems="center"
      key={e.email}
      css={{
        gap: '$md',
        py: '$md',
        '@sm': {
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '$sm',
        },
      }}
    >
      <Text semibold={e.primary} css={{ flexGrow: 1 }}>
        {e.email}
      </Text>
      <Flex
        css={{
          gap: '$md',
          // '@sm': { justifyContent: 'space-between', width: '100%' },
        }}
      >
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
    </Flex>
  );
};
