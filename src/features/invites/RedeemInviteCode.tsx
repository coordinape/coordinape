import assert from 'assert';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { z } from 'zod';

import { FormInputField } from '../../components';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { OrBar } from '../../components/OrBar';
import { useToast } from '../../hooks';
import { Check } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button, Flex, Panel, Text } from '../../ui';
import { useAuthStore } from '../auth';
import { QUERY_KEY_COLINKS_NAV } from '../colinks/useCoLinksNavQuery';

import { WaitListForm } from './WaitListForm';

export const panelStyles = {
  gap: '$md',
  p: '$lg',
  transition: 'all 0.1s ease-in-out',
  border: '0.5px solid $borderDim',
  '@media screen and (max-height: 735px)': {
    p: '$md',
  },
};
export const INVITE_REDEEM_QUERY_KEY = 'myInviteStatus';
export const RedeemInviteCode = ({
  setRedeemedInviteCode,
}: {
  setRedeemedInviteCode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const profileId = useAuthStore(state => state.profileId);

  const [loading, setLoading] = useState(false);
  const [inviteCodeFormActive, setInviteCodeFormActive] = useState(true);

  const redeemSchema = z.object({ code: z.string().min(11) });
  type RedeemParams = z.infer<typeof redeemSchema>;

  const queryClient = useQueryClient();
  const { showError } = useToast();

  const {
    handleSubmit: handleRedeemSubmit,
    formState: { isValid: isRedeemValid },
    control: redeemControl,
  } = useForm<RedeemParams>({
    resolver: zodResolver(redeemSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  assert(profileId);

  const { data } = useQuery([INVITE_REDEEM_QUERY_KEY], async () => {
    const { profiles_by_pk } = await client.query(
      {
        profiles_by_pk: [
          {
            id: profileId,
          },
          {
            invite_code_redeemed_at: true,
            invite_code_requested_at: true,
            invite_code_sent_at: true,
          },
        ],
      },
      {
        operationName: 'getMyInviteStatus',
      }
    );
    return {
      redeemed: !!profiles_by_pk?.invite_code_redeemed_at,
      requested: !!profiles_by_pk?.invite_code_requested_at,
      code_sent: !!profiles_by_pk?.invite_code_sent_at,
    };
  });

  const redeemCode: SubmitHandler<RedeemParams> = async params => {
    try {
      setLoading(true);
      const {
        redeemInviteCode: { success, error },
      } = await client.mutate(
        {
          redeemInviteCode: [
            { payload: { code: params.code } },
            {
              success: true,
              error: true,
            },
          ],
        },
        { operationName: 'redeemInviteCode' }
      );
      if (success) {
        queryClient.invalidateQueries([QUERY_KEY_COLINKS_NAV]);
        queryClient.invalidateQueries([INVITE_REDEEM_QUERY_KEY]);
      } else {
        showError(error);
      }
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.redeemed) {
      setRedeemedInviteCode(true);
    }
  }, [data]);

  if (data === undefined) {
    return <LoadingIndicator />;
  }

  if (data?.redeemed) {
    return (
      <Flex css={{ gap: '$md' }}>
        <Panel success css={{ width: '100%' }}>
          <Text semibold css={{ gap: '$sm' }}>
            <Check color={'complete'} />
            Successfully redeemed invite code.
          </Text>
        </Panel>
      </Flex>
    );
  }

  return (
    <Flex column css={{ gap: '$sm' }}>
      <form
        onSubmit={handleRedeemSubmit(redeemCode)}
        id="code_form"
        key="code_form"
      >
        <Panel
          onFocus={() => {
            setInviteCodeFormActive(true);
          }}
          css={{
            ...panelStyles,
            outline: inviteCodeFormActive ? '1.5px solid $borderFocus' : 'none',
            background: inviteCodeFormActive
              ? `linear-gradient(.1turn, color-mix(in srgb, $cta 30%, $background), $surface 60%)`
              : 'transparent',
          }}
        >
          <Flex column css={{ gap: '$xs' }}>
            <Text
              variant="label"
              css={{ color: inviteCodeFormActive ? '$text' : '$secondaryText' }}
            >
              Have an Invite Code?
            </Text>
            <FormInputField
              key="code_field"
              inputProps={{
                autoFocus: true,
                type: 'text',
                autoComplete: 'off',
              }}
              id="code"
              name="code"
              css={{ input: { background: '$surfaceNested' } }}
              placeholder={'Enter your invite code'}
              control={redeemControl}
              defaultValue={''}
              showFieldErrors
            />
          </Flex>
          <Button
            type="submit"
            color="cta"
            fullWidth
            disabled={loading || !isRedeemValid}
          >
            Redeem Invite Code
          </Button>
        </Panel>
      </form>
      <OrBar css={{ my: '$xs' }}>Or Join the Wait List</OrBar>
      <WaitListForm
        codeSent={data.code_sent}
        requested={data.requested}
        inviteCodeFormActive={inviteCodeFormActive}
        setInviteCodeFormActive={setInviteCodeFormActive}
      />
    </Flex>
  );
};
