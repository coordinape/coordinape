import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { QUERY_KEY_COLINKS_NAV } from 'features/colinks/useCoLinksNavQuery';
import { isValidENS, zUsername } from 'lib/zod/formHelpers';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';

import { QUERY_KEY_NAV } from '../../features/nav/getNavData';
import { useToast } from '../../hooks';
import { Box, Button, Flex, Form, Text, TextField } from '../../ui';
import { normalizeError } from '../../utils/reporting';
import { QUERY_KEY_CREATE_CIRCLE } from 'pages/CreateCirclePage/queries';
import { QUERY_KEY_PROFILE_BY_ADDRESS } from 'pages/JoinPage/queries';
import { shortenAddressWithFrontLength } from 'utils';

import { QUERY_KEY_MAIN_HEADER } from './getMainHeaderData';
import { updateProfileNameMutation } from './mutations';

const userNameSchema = z.object({ name: zUsername });
type UserNameFormSchema = z.infer<typeof userNameSchema>;

export const CreateUserNameForm = ({
  address,
  hideWalletAddress,
  name,
}: {
  address?: string;
  hideWalletAddress?: boolean;
  name?: string;
}) => {
  const { showError } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    setValue,

    formState: { errors, isValid },
  } = useForm<UserNameFormSchema>({
    resolver: zodResolver(userNameSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      name: name ?? '',
    },
  });

  useEffect(() => {
    if (name && name != '') {
      setValue('name', name ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [name]);

  const profileNameMutation = useMutation(updateProfileNameMutation, {
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
      queryClient.invalidateQueries(QUERY_KEY_PROFILE_BY_ADDRESS);
      queryClient.invalidateQueries(QUERY_KEY_NAV);
      queryClient.invalidateQueries(QUERY_KEY_COLINKS_NAV);
      queryClient.invalidateQueries(QUERY_KEY_CREATE_CIRCLE);
    },
    onError: err => {
      setLoading(false);
      const error = normalizeError(err);
      setError('name', {
        type: 'server',
        message: error.message,
      });
      showError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const onSubmit: SubmitHandler<UserNameFormSchema> = async data => {
    if (data.name.endsWith('.eth')) {
      const validENS = await isValidENS(data.name, address);
      if (!validENS) {
        setError(
          'name',
          {
            message: `The ENS ${data.name} doesn't resolve to your current address: ${address}.`,
          },
          { shouldFocus: true }
        );
        return;
      }
    }
    await profileNameMutation.mutate(data.name);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/*<Text p as="p">*/}
      {/*  Please set the name that will be displayed for this account.*/}
      {/*</Text>*/}
      <Flex
        column
        css={{
          alignItems: 'flex-start',
          // mt: '$lg',
          gap: '$md',
        }}
      >
        <Box>
          <Text variant="label" css={{ mb: '$xs' }}>
            Name
          </Text>
          <TextField
            placeholder="Name"
            fullWidth
            inPanel
            autoComplete="off"
            error={errors.name !== undefined}
            {...register(`name`)}
          />
          <Box>
            {errors.name && (
              <Text variant="formError" css={{ mt: '$sm', textAlign: 'left' }}>
                {errors.name.message}
              </Text>
            )}
          </Box>
        </Box>
        {!hideWalletAddress && (
          <Box>
            <Text variant="label" css={{ mb: '$xs' }}>
              Wallet Address
            </Text>
            <Text
              tag
              color="neutral"
              css={{
                width: '100%',
                overflowWrap: 'anywhere',
                fontFamily: 'monospace',
              }}
            >
              {address && shortenAddressWithFrontLength(address, 6)}
            </Text>
          </Box>
        )}
        <Box css={{ mt: '$sm' }}>
          <Button type="submit" color="cta" disabled={loading || !isValid}>
            Submit
          </Button>
        </Box>
      </Flex>
    </Form>
  );
};
