import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from 'features/auth';
import { client } from 'lib/gql/client';
import { updateMyProfile } from 'lib/gql/mutations';
import { isValidENS, zBio, zUsername } from 'lib/zod/formHelpers';
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
  width: '60%',
  minWidth: '300px',
};

const schema = z
  .object({
    name: zUsername,
    bio: zBio,
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
    bio?: string;
  };
}) => {
  const profileId = useAuthStore(state => state.profileId) ?? -1;
  const { data, refetch } = useQuery(['userName', profileId], async () => {
    const { profiles_by_pk } = await client.query(
      {
        profiles_by_pk: [
          { id: profileId },
          { name: true, avatar: true, address: true, bio: true },
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
      bio: profiles_by_pk.bio,
    };
  });

  if (!data) return <LoadingModal visible />;

  return (
    <EditProfileInfoForm
      userData={data}
      refetchData={refetch}
      vertical={vertical}
      preloadProfile={preloadProfile}
    />
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
    bio?: string;
    address: string;
  };
  vertical: boolean;
  preloadProfile?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  refetchData: () => void;
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showError, showSuccess } = useToast();

  const queryClient = useQueryClient();

  const name = userData.name ? userData.name : preloadProfile?.name;
  const bio = userData.bio ? userData.bio : preloadProfile?.bio;

  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty },
  } = useForm<EditProfileNameFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name,
      bio,
    },
  });

  const updateProfileMutation = useMutation(updateMyProfile, {
    onMutate: () => {
      setIsSaving(true);
    },
    onSettled: () => {
      setIsSaving(false);
      showSuccess('Profile Saved');
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
        paddingTop: '$md',
      }}
    >
      {isSaving && <LoadingModal visible={true} />}
      <Flex column>
        <Flex
          css={{
            ...(vertical ? { flexDirection: 'column', gap: '$md' } : {}),
            '@sm': { flexDirection: 'column', gap: '$md' },
          }}
        >
          <Flex column css={{ gap: '$md' }}>
            <Flex column css={{ gap: '$sm' }}>
              <Text p css={sectionHeader}>
                Name
              </Text>
              <FormInputField
                css={{ width: '250px' }}
                id="name"
                name="name"
                control={control}
                defaultValue={name}
                showFieldErrors
                placeholder="Name"
              />
            </Flex>
            <Flex column css={{ gap: '$sm' }}>
              <Text p css={sectionHeader}>
                Avatar
              </Text>
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
            <Flex column css={{ gap: '$sm' }}>
              <Text p css={sectionHeader}>
                Bio
              </Text>
              <FormInputField
                css={{ width: '250px' }}
                id="bio"
                name="bio"
                textArea={true}
                control={control}
                defaultValue={bio}
                showFieldErrors
                placeholder={'Tell people about yourself'}
              />
            </Flex>
            <Flex
              css={{
                justifyContent: 'flex-end',
                ...(vertical ? { justifyContent: 'flex-start' } : {}),
                '@sm': { justifyContent: 'flex-start' },
              }}
            >
              <Button
                disabled={(!isDirty && !preloadProfile) || isSaving}
                color="cta"
                type="submit"
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Form>
  );
};
