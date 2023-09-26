import { useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';

import { useToast } from '../../hooks';
import { Check, Trash2 } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Box, Button, Flex, Modal, Text, TextField } from '../../ui';

export const EditEmailModal = () => {
  const [emailToAdd, setEmailToAdd] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const { showError } = useToast();
  const queryClient = useQueryClient();

  const { data: emails } = useQuery('emails', async () => {
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
  });

  const makePrimary = async (email: string) => {
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
  };

  const deleteEmail = async (email: string) => {
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
  };

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
        await queryClient.invalidateQueries('emails');
      } catch (e: any) {
        showError(e);
      } finally {
        setAdding(false);
      }
    }
  };

  return (
    <Modal
      // onOpenChange={
      // open => {
      // if (!open) {
      //   onClose();
      // }
      // }}
      open={true}
      // css={{
      //   maxWidth: '1140px',
      //   padding: '$lg $4xl $lg',
      //   overflow: 'auto',
      //   maxHeight: '90vh',
      // }}
    >
      <Text h2>Email Addresses</Text>
      {emails === undefined ? (
        <Text>Loading</Text>
      ) : (
        emails.map(e => (
          <Flex key={e.email} css={{ gap: '$md' }}>
            <Box css={{ width: '$md' }}>{e.primary ? <Check /> : ''}</Box>
            <Box>{e.email}</Box>
            <Box>{e.verified_at ? <Check /> : 'unverified'}</Box>
            {!e.primary && e.verified_at && (
              <Button onClick={() => makePrimary(e.email)}>Make Primary</Button>
            )}
            <Button onClick={() => deleteEmail(e.email)}>
              <Trash2 />
            </Button>
          </Flex>
        ))
      )}
      <Flex>
        <TextField
          placeholder="add email address"
          css={{ mr: '$md' }}
          value={emailToAdd}
          onChange={e => setEmailToAdd(e.target.value)}
        />
        <Button onClick={() => addEmail()} disabled={adding}>
          Add Email
        </Button>
      </Flex>
    </Modal>
  );
};
