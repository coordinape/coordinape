import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from 'features/auth';
import { QUERY_KEY_COLINKS_NAV } from 'features/colinks/useCoLinksNavQuery';
import { client } from 'lib/gql/client';
import { updateMyProfile } from 'lib/gql/mutations';
import {
  isValidENS,
  zDescription,
  zUsername,
  zWebsite,
} from 'lib/zod/formHelpers';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { z } from 'zod';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { QUERY_KEY_NAV } from '../../features/nav';
import { AvatarUpload, FormInputField, LoadingModal } from 'components';
import { useToast } from 'hooks';
import { Button, Flex, Form, Text } from 'ui';
import { normalizeError } from 'utils/reporting';

const schema = z
  .object({
    name: zUsername,
    description: zDescription,
    website: zWebsite,
  })
  .strict();

type EditProfileNameFormSchema = z.infer<typeof schema>;

export const EditProfileInfo = ({
  vertical = false,
  preloadProfile,
}: {
  vertical?: boolean;
  preloadProfile?: {
    name: string;
    avatar?: string;
    description?: string;
  };
}) => {
  const profileId = useAuthStore(state => state.profileId) ?? -1;
  const { data, refetch } = useQuery(['userName', profileId], async () => {
    const { profiles_by_pk } = await client.query(
      {
        profiles_by_pk: [
          { id: profileId },
          {
            name: true,
            avatar: true,
            address: true,
            description: true,
            website: true,
          },
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
      description: profiles_by_pk.description,
      website: profiles_by_pk.website,
    };
  });

  if (!data) return <LoadingIndicator />;

  return (
    <Flex column>
      <EditProfileInfoForm
        userData={data}
        refetchData={refetch}
        vertical={vertical}
        preloadProfile={preloadProfile}
      />
    </Flex>
  );
};
const EditProfileInfoForm = ({
  userData,
  refetchData,
  vertical,
  preloadProfile,
}: {
  userData: {
    name: string;
    avatar?: string;
    description?: string;
    address: string;
    website?: string;
  };
  vertical: boolean;
  preloadProfile?: {
    name: string;
    avatar?: string;
    description?: string;
  };
  refetchData: () => void;
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showError, showSuccess } = useToast();

  const queryClient = useQueryClient();

  const hasPresetName = userData?.name?.startsWith('New User');

  const name = hasPresetName
    ? preloadProfile?.name
      ? preloadProfile.name
      : ''
    : userData.name
      ? userData.name
      : preloadProfile?.name;
  const description = userData.description
    ? userData.description
    : preloadProfile?.description;

  const website = userData.website;

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { isDirty, isValid },
  } = useForm<EditProfileNameFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name,
      description,
      website,
    },
  });

  const updateProfileMutation = useMutation(updateMyProfile, {
    onMutate: () => {
      setIsSaving(true);
    },
    onSettled: () => {
      setIsSaving(false);
    },
    onSuccess: async () => {
      showSuccess('Profile Saved');
      refetchData();
      queryClient.invalidateQueries([QUERY_KEY_NAV]);
      queryClient.invalidateQueries([QUERY_KEY_COLINKS_NAV]);
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

  const watchName = watch('name');
  const nameIsEmpty = watchName === '' || watchName === undefined;

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
      <Flex column css={{ gap: '$md' }}>
        <Flex
          css={{
            gap: '$md',
            ...(vertical
              ? { flexDirection: 'column' }
              : {
                  '>div': {
                    alignItems: 'flex-start',
                  },
                }),
            '@sm': { flexDirection: 'column', gap: '$md' },
          }}
        >
          <Flex column css={{ gap: '$md' }}>
            <Flex
              column
              css={{
                gap: '$sm',
                alignItems: 'flex-start',
                width: '100%',
                minWidth: '250px',
                '>div': {
                  width: '100%',
                },
              }}
            >
              <Flex css={{ justifyContent: 'space-between' }}>
                <Text variant="label">Name</Text>
                {!name && (
                  <Text size="xs" color="warning">
                    Required
                  </Text>
                )}
              </Flex>
              <FormInputField
                id="name"
                name="name"
                control={control}
                defaultValue={name}
                showFieldErrors
                placeholder="Name"
              />
            </Flex>
          </Flex>
          <Flex column css={{ gap: '$sm', alignItems: 'flex-start' }}>
            <Text variant="label">Avatar</Text>
            <AvatarUpload
              original={
                userData.avatar ? userData.avatar : preloadProfile?.avatar
              }
            />
          </Flex>
        </Flex>
        <Flex
          column
          css={{ justifyContent: 'space-between', gap: '$md', flexGrow: 1 }}
        >
          <Flex
            column
            css={{
              gap: '$sm',
              width: '100%',
            }}
          >
            <Flex
              css={{
                justifyContent: 'space-between',
              }}
            >
              <Text variant="label">Description</Text>
            </Flex>
            <FormInputField
              id="description"
              name="description"
              textArea={true}
              control={control}
              defaultValue={description}
              showFieldErrors
              placeholder={'Tell people about yourself'}
            />
          </Flex>
          <Flex
            column
            css={{
              gap: '$sm',
              width: '100%',
            }}
          >
            <Flex
              css={{
                justifyContent: 'space-between',
              }}
            >
              <Text variant="label">Website</Text>
            </Flex>
            <FormInputField
              id="website"
              name="website"
              textArea={false}
              control={control}
              defaultValue={website}
              showFieldErrors
              placeholder={'https://myspace.com/cryptochad12'}
            />
          </Flex>
        </Flex>
        <Flex css={{ gap: '$sm' }}>
          <Button
            disabled={(!isDirty && !preloadProfile) || isSaving || !isValid}
            color="cta"
            type="submit"
          >
            Save
          </Button>
          {nameIsEmpty && (
            <Text size="xs" color="warning">
              Please fill out {nameIsEmpty && 'name'}
            </Text>
          )}
        </Flex>
      </Flex>
    </Form>
  );
};
