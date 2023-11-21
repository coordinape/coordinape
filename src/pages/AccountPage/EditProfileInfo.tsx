import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from 'features/auth';
import { client } from 'lib/gql/client';
import { updateMyProfile } from 'lib/gql/mutations';
import { isValidENS, zUsername } from 'lib/zod/formHelpers';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { z } from 'zod';

import { QUERY_KEY_NAV } from '../../features/nav';
import { AvatarUpload, FormInputField, LoadingModal } from 'components';
import { useToast } from 'hooks';
import { Button, Flex, Form, Text } from 'ui';
import { normalizeError } from 'utils/reporting';

const sectionHeader = {
  fontSize: '$md',
  fontWeight: '$semibold',
  padding: '0 0 $sm',
  margin: '$md 0 $md',
  borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
  width: '60%',
  minWidth: '300px',
};

const schema = z
  .object({
    name: zUsername,
  })
  .strict();

type EditProfileNameFormSchema = z.infer<typeof schema>;

export const EditProfileInfo = () => {
  const profileId = useAuthStore(state => state.profileId) ?? -1;
  const { data, refetch } = useQuery(['userName', profileId], async () => {
    const { profiles_by_pk } = await client.query(
      {
        profiles_by_pk: [
          { id: profileId },
          { name: true, avatar: true, address: true },
        ],
      },
      {
        operationName: 'editProfileInfo__getInfo',
      }
    );
    if (!profiles_by_pk) return undefined;
    return {
      name: profiles_by_pk.name,
      avatar: profiles_by_pk.avatar,
      address: profiles_by_pk.address,
    };
  });

  if (!data) return <LoadingModal visible />;

  return <EditProfileInfoForm userData={data} refetchData={refetch} />;
};
const EditProfileInfoForm = ({
  userData,
  refetchData,
}: {
  userData: {
    name: string;
    avatar?: string;
    address: string;
  };
  refetchData: () => void;
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showError, showSuccess } = useToast();

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty },
  } = useForm<EditProfileNameFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: userData.name ?? '',
    },
  });

  const updateProfileMutation = useMutation(updateMyProfile, {
    onMutate: () => {
      setIsSaving(true);
    },
    onSettled: () => {
      setIsSaving(false);
      showSuccess('Name saved');
    },
    onSuccess: async () => {
      refetchData();
      queryClient.invalidateQueries([QUERY_KEY_NAV]);
    },
    onError: err => {
      const error = normalizeError(err);
      showError(error.message);
    },
  });

  const onSubmit: SubmitHandler<EditProfileNameFormSchema> = async params => {
    if (params.name.endsWith('.eth')) {
      const validENS = await isValidENS(params.name, userData.address);
      if (!validENS) {
        setError(
          'name',
          {
            message: `The ENS ${params.name} doesn't resolve to your current address: ${userData.address}.`,
          },
          { shouldFocus: true }
        );
        return;
      }
    }

    updateProfileMutation.mutate(params);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {isSaving && <LoadingModal visible={true} />}
      <Flex
        css={{
          '@sm': { flexDirection: 'column' },
        }}
      >
        <Flex column>
          <Text p css={sectionHeader}>
            Avatar
          </Text>
          <AvatarUpload original={userData.avatar} />
        </Flex>
        <Flex column>
          <Text p css={sectionHeader}>
            Name
          </Text>
          <Flex css={{ gap: '$sm' }}>
            <FormInputField
              css={{ width: '250px' }}
              id="name"
              name="name"
              control={control}
              defaultValue={userData.name}
              showFieldErrors
            />
            <Button
              disabled={!isDirty || isSaving}
              color="cta"
              type="submit"
              css={{ maxHeight: '$1xl' }}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Form>
  );
};
