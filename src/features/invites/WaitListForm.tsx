import { Dispatch, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { z } from 'zod';

import { FormInputField } from '../../components';
import { client } from '../../lib/gql/client';
import { Button, Flex, Panel, Text } from '../../ui';
import { useToast } from 'hooks';

import { INVITE_REDEEM_QUERY_KEY, panelStyles } from './RedeemInviteCode';

export const WaitListForm = ({
  requested,
  codeSent,
  inviteCodeFormActive,
  setInviteCodeFormActive,
}: {
  codeSent: boolean;
  requested: boolean;
  inviteCodeFormActive: boolean;
  setInviteCodeFormActive: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const joinWaitListSchema = z.object({ email: z.string().email() });
  type JoinWaitListParams = z.infer<typeof joinWaitListSchema>;
  const [requestedInviteCode, setRequestedInviteCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const {
    handleSubmit: handleJoinSubmit,
    formState: { isValid: isJoinValid },
    control: joinControl,
  } = useForm<JoinWaitListParams>({
    resolver: zodResolver(joinWaitListSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const joinWaitList: SubmitHandler<JoinWaitListParams> = async params => {
    try {
      setLoading(true);
      const {
        requestInviteCode: { success, error },
      } = await client.mutate(
        {
          requestInviteCode: [
            { payload: { email: params.email } },
            {
              success: true,
              error: true,
            },
          ],
        },
        { operationName: 'requestInviteCode' }
      );
      if (success) {
        queryClient.invalidateQueries([INVITE_REDEEM_QUERY_KEY]);
        setRequestedInviteCode(true);
      } else {
        showError(error);
      }
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {codeSent ? (
        <Panel success>{`Check your email! We sent you an invite code.`}</Panel>
      ) : requested ? (
        <Panel
          success
        >{`Invite code requested. We'll be in touch soon.`}</Panel>
      ) : requestedInviteCode ? (
        <Panel
          warning
        >{`Check your email and click the verify link to secure your place.`}</Panel>
      ) : (
        <form
          onSubmit={handleJoinSubmit(joinWaitList)}
          id="email_form"
          key="email_form"
        >
          <Panel
            onFocus={() => {
              setInviteCodeFormActive(false);
            }}
            css={{
              ...panelStyles,
              outline: !inviteCodeFormActive
                ? '1.5px solid $borderFocus'
                : 'none',
              background: !inviteCodeFormActive
                ? `linear-gradient(.1turn, color-mix(in srgb, $cta 30%, $background), $surface 60%)`
                : 'transparent',
            }}
          >
            <Flex column css={{ gap: '$xs' }}>
              <Text
                variant="label"
                css={{
                  color: !inviteCodeFormActive ? '$text' : '$secondaryText',
                }}
              >
                Email Address
              </Text>
              <FormInputField
                key="email_field"
                id="email"
                name="email"
                inputProps={{ type: 'email', autoComplete: 'off' }}
                css={{ input: { background: '$surfaceNested' } }}
                placeholder={'Enter your email address'}
                control={joinControl}
                defaultValue={''}
                showFieldErrors
              />
            </Flex>
            <Button
              type="submit"
              color="cta"
              fullWidth
              disabled={loading || !isJoinValid}
            >
              Join Wait List
            </Button>
          </Panel>
        </form>
      )}
    </>
  );
};
