import assert from 'assert';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { z } from 'zod';

import { FormInputField } from '../../components';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useToast } from '../../hooks';
import { Check } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button, Flex, Text } from '../../ui';
import { useAuthStore } from '../auth';

const INVITE_REDEEM_QUERY_KEY = 'myInviteStatus';
export const RedeemInviteCode = () => {
  const profileId = useAuthStore(state => state.profileId);

  const redeemSchema = z.object({ code: z.string().min(11) });

  const [loading, setLoading] = useState(false);

  type RedeemParams = z.infer<typeof redeemSchema>;

  const queryClient = useQueryClient();
  const { showError } = useToast();

  // nb: keeping this form scaffolding for now, despite having removed username -g
  // we might add more stuff to the form and i don't want to have to rebuild it
  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm<RedeemParams>({
    resolver: zodResolver(redeemSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  assert(profileId);

  const { data: redeemed } = useQuery([INVITE_REDEEM_QUERY_KEY], async () => {
    const { profiles_by_pk } = await client.query(
      {
        profiles_by_pk: [
          {
            id: profileId,
          },
          {
            invite_code_redeemed: true,
          },
        ],
      },
      {
        operationName: 'getMyInviteStatus',
      }
    );
    return !!profiles_by_pk?.invite_code_redeemed;
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
      console.log({ success }, { error });
      if (success) {
        queryClient.invalidateQueries([INVITE_REDEEM_QUERY_KEY]);
      } else {
        console.log('hello');
        showError(error);
      }
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  if (redeemed === undefined) {
    return <LoadingIndicator />;
  }

  if (redeemed) {
    return (
      <Flex css={{ gap: '$md' }}>
        <Check color={'complete'} />
        <Text>Successfully redeemed invite code.</Text>
      </Flex>
    );
  }

  return (
    <form onSubmit={handleSubmit(redeemCode)}>
      <Flex column css={{ gap: '$md' }}>
        <Flex column css={{ gap: '$xs' }}>
          <Text variant="label">Invite Code</Text>
          <FormInputField
            id="name"
            name="code"
            placeholder={'Enter your invite code'}
            control={control}
            defaultValue={''}
            showFieldErrors
          />
        </Flex>
        <Button
          type="submit"
          color="cta"
          fullWidth
          disabled={loading || !isValid}
        >
          Redeem Invite Code
        </Button>
      </Flex>
    </form>
  );
};
