import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import { useController, useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';

import { LoadingModal } from '../../../components';
import { Box, Button, CheckBox, Form, Text, TextField, Panel } from 'ui';

import { API_PERMISSION_LABELS } from './constants';
import { generateCircleApiKey } from './mutations';
import { CircleApiKeysResponse } from './useCircleApiKeys';

const schema = z.object({
  name: z.string().max(64).min(5),
  read_circle: z.boolean(),
  update_circle: z.boolean(),
  read_nominees: z.boolean(),
  create_vouches: z.boolean(),
  read_pending_token_gifts: z.boolean(),
  update_pending_token_gifts: z.boolean(),
  read_member_profiles: z.boolean(),
  read_epochs: z.boolean(),
  read_contributions: z.boolean(),
  create_contributions: z.boolean(),
  manage_users: z.boolean(),
});

type FormSchema = z.infer<typeof schema>;
const resolver = zodResolver(schema);

type Props = {
  circleId: number;
  onSuccess: (apiKey: string) => void;
};
export const ApiKeyForm: FC<Props> = ({ circleId, onSuccess }) => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<FormSchema>({ resolver, mode: 'onBlur' });

  const queryClient = useQueryClient();

  const mutation = useMutation(generateCircleApiKey, {
    onSuccess: data => {
      queryClient.invalidateQueries('circle-api-keys');
      if (data?.circleApiKey) {
        const circleApiKey = data?.circleApiKey;
        queryClient.setQueryData<CircleApiKeysResponse[]>(
          ['circle-api-keys', circleId],
          oldKeys => {
            return [...(oldKeys || []), circleApiKey];
          }
        );
        onSuccess(data.api_key);
      }
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = data =>
    mutation.mutate({
      ...data,
      circle_id: circleId,
    });

  const { field: name } = useController({
    name: 'name',
    control,
    defaultValue: '',
  });

  const { field: readCircle } = useController({
    name: 'read_circle',
    control,
    defaultValue: false,
  });

  const { field: updateCircle } = useController({
    name: 'update_circle',
    control,
    defaultValue: false,
  });

  const { field: readEpochs } = useController({
    name: 'read_epochs',
    control,
    defaultValue: false,
  });

  const { field: readMemberProfiles } = useController({
    name: 'read_member_profiles',
    control,
    defaultValue: false,
  });

  const { field: readPendingTokenGifts } = useController({
    name: 'read_pending_token_gifts',
    control,
    defaultValue: false,
  });

  const { field: updatePendingTokenGifts } = useController({
    name: 'update_pending_token_gifts',
    control,
    defaultValue: false,
  });

  const { field: readNominees } = useController({
    name: 'read_nominees',
    control,
    defaultValue: false,
  });

  const { field: createVouches } = useController({
    name: 'create_vouches',
    control,
    defaultValue: false,
  });

  const { field: readContributions } = useController({
    name: 'read_contributions',
    control,
    defaultValue: false,
  });

  const { field: createContributions } = useController({
    name: 'create_contributions',
    control,
    defaultValue: false,
  });

  const { field: manageUsers } = useController({
    name: 'manage_users',
    control,
    defaultValue: false,
  });

  return (
    <Panel css={{ p: 0 }}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        css={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '$sm',
        }}
      >
        <Text p as="p" css={{ mb: '$md' }}>
          Circle API keys allow for third party apps to read data from and
          interact with your circle. You can configure specific permissions for
          each key.
        </Text>
        <Text variant="label" as="label" htmlFor="name">
          API Key Name
        </Text>
        <TextField
          id="name"
          placeholder={'What is this API key for?'}
          {...name}
        />
        <Box
          css={{
            display: 'flex',
            gap: '$sm',
            my: '$lg',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Text variant={'label'}>Read-only Permissions</Text>
          <CheckBox
            {...readCircle}
            label={API_PERMISSION_LABELS['read_circle']}
            infoTooltip={
              <>Allows reading your circle name, logo, and configuration.</>
            }
          />

          <CheckBox
            {...readEpochs}
            label={API_PERMISSION_LABELS['read_epochs']}
            infoTooltip={
              <>Allows reading information about historical epochs.</>
            }
          />
          <CheckBox
            {...readMemberProfiles}
            label={API_PERMISSION_LABELS['read_member_profiles']}
            infoTooltip={
              <>
                Allows reading member profiles (name, socials, avatars),
                excluding wallet addresses.
              </>
            }
          />
          <CheckBox
            {...readPendingTokenGifts}
            label={API_PERMISSION_LABELS['read_pending_token_gifts']}
            infoTooltip={
              <>
                Allows reading pending allocations in the current epoch
                (excluding notes).
              </>
            }
          />
          <CheckBox
            {...readNominees}
            label={API_PERMISSION_LABELS['read_nominees']}
            infoTooltip={<>Allows reading information about circle nominees.</>}
          />
          <CheckBox
            {...readContributions}
            label={API_PERMISSION_LABELS['read_contributions']}
            infoTooltip={
              <>Allows reading contributions added by members in the circle.</>
            }
          />
          <Text variant={'label'} css={{ mt: '$md' }}>
            Write Permissions
          </Text>

          <CheckBox
            {...updateCircle}
            label={API_PERMISSION_LABELS['update_circle']}
            infoTooltip={
              <>Allows updating your circle name, logo, and configuration.</>
            }
          />
          <CheckBox
            {...updatePendingTokenGifts}
            label={API_PERMISSION_LABELS['update_pending_token_gifts']}
            infoTooltip={
              <>
                Allows updating pending allocations in the current epoch on
                behalf of circle members.
              </>
            }
          />
          <CheckBox
            {...createVouches}
            label={API_PERMISSION_LABELS['create_vouches']}
            infoTooltip={
              <>Allows vouching for new nominees on behalf of circle members.</>
            }
          />
          <CheckBox
            {...createContributions}
            label={API_PERMISSION_LABELS['create_contributions']}
            infoTooltip={
              <>Allows adding contributions on behalf of circle members.</>
            }
          />
          <CheckBox
            {...manageUsers}
            label={API_PERMISSION_LABELS['manage_users']}
            infoTooltip={<>Allows adding and removing users from the circle.</>}
          />
        </Box>
        <Button
          size="large"
          color="primary"
          css={{ mt: '$lg', width: '100%' }}
          disabled={!isValid || mutation.isLoading}
        >
          Generate Key
        </Button>
        {!isEmpty(errors) && (
          <Text color="alert" css={{ mt: '$sm' }}>
            {Object.values(errors)
              .map(e => e.message)
              .join('. ')}
          </Text>
        )}
        {mutation.isError && (
          <Text color="alert" css={{ mt: '$sm' }}>
            {(mutation.error as Error).message}
          </Text>
        )}
        <LoadingModal visible={mutation.isLoading} />
      </Form>
    </Panel>
  );
};
