import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { updateMyProfile } from 'lib/gql/mutations';
import { isValidENS, zUsername } from 'lib/zod/formHelpers';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import * as z from 'zod';

import { LoadingModal } from 'components';
import { AvatarUpload, FormInputField, SkillToggles } from 'components/index';
import { SKILLS } from 'config/constants';
import { useToast } from 'hooks';
import { useFetchManifest } from 'hooks/legacyApi';
import { useMyProfile } from 'recoilState';
import {
  Box,
  Button,
  Flex,
  Form,
  MarkdownPreview,
  Modal,
  Panel,
  Text,
  TextArea,
} from 'ui';
import { normalizeError } from 'utils/reporting';

const schema = z
  .object({
    name: zUsername,
    bio: z.string(),
    description: z.string().optional(),
    skills: z.array(z.string()),
    twitter_username: z.string(),
    github_username: z.string(),
    telegram_username: z.string(),
    discord_username: z.string(),
    medium_username: z.string(),
    website: z.string(),
  })
  .strict();

type EditProfileFormSchema = z.infer<typeof schema>;

const sectionHeader = {
  fontSize: '$md',
  fontWeight: '$semibold',
  padding: '0 0 $sm',
  margin: '$xl 0 $md',
  borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
  width: '60%',
  minWidth: '300px',
  textAlign: 'center',
};

export const EditProfileModal = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [showMarkdown, setShowMarkDown] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showError } = useToast();

  // FIXME replace this with react-query
  const myProfile = useMyProfile();

  const bioFieldRef = useRef<HTMLTextAreaElement>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty },
  } = useForm<EditProfileFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: myProfile.name ?? '',
      bio: myProfile.bio ?? '',
      skills: myProfile.skills ?? [],
      twitter_username: myProfile.twitter_username ?? '',
      github_username: myProfile.github_username ?? '',
      telegram_username: myProfile.telegram_username ?? '',
      discord_username: myProfile.discord_username ?? '',
      medium_username: myProfile.medium_username ?? '',
      website: myProfile.website ?? '',
    },
  });

  const fetchManifest = useFetchManifest();

  const { field: skillsField } = useController({
    name: 'skills',
    control,
    defaultValue: myProfile?.skills ?? [],
  });

  const { field: bioField } = useController({
    name: 'bio',
    control,
    defaultValue: myProfile?.bio ?? '',
  });

  useEffect(() => {
    if (!showMarkdown) {
      bioFieldRef.current?.focus();
    }
    if (showMarkdown && (!bioField || bioField.value.length === 0)) {
      setShowMarkDown(false);
    }
  }, [showMarkdown]);

  const updateProfileMutation = useMutation(updateMyProfile, {
    onMutate: () => {
      setIsSaving(true);
    },
    onSettled: () => {
      setIsSaving(false);
    },
    onSuccess: async () => {
      fetchManifest();
      onClose();
    },
    onError: err => {
      const error = normalizeError(err);
      if (error.message.includes('valid_website')) {
        showError('provide a valid website starting with https:// or http://');
      } else {
        showError(error.message);
      }
    },
  });

  const onSubmit: SubmitHandler<EditProfileFormSchema> = async params => {
    if (params.name.endsWith('.eth')) {
      const validENS = await isValidENS(params.name, myProfile.address);
      if (!validENS) {
        setError(
          'name',
          {
            message: `The ENS ${params.name} doesn't resolve to your current address: ${myProfile.address}.`,
          },
          { shouldFocus: true }
        );
        return;
      }
    }

    //make sure that the old skills are replaced
    params.skills = params.skills.filter(skill => SKILLS.includes(skill));

    // skills is an array here but the backend expects a json encoded array
    const fixedParams: Omit<typeof params, 'skills' | 'website'> & {
      skills: string;
      website: string | null;
    } = { ...params, skills: JSON.stringify(params.skills) };

    if (fixedParams.website == '') {
      fixedParams.website = null;
    }
    updateProfileMutation.mutate(fixedParams);
  };

  return (
    <Modal
      onOpenChange={open => {
        if (!open) {
          onClose();
        }
      }}
      open={open}
      css={{
        maxWidth: '1140px',
        padding: '$lg $4xl $lg',
        overflow: 'auto',
        maxHeight: '90vh',
      }}
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Panel ghost css={{ alignItems: 'center' }}>
          <Text h2>Edit Profile</Text>
          <Flex css={{ columnGap: '$lg', '@sm': { flexDirection: 'column' } }}>
            <Flex column css={{ alignItems: 'center' }}>
              <Text p css={sectionHeader}>
                Profile Image
              </Text>
              <AvatarUpload original={myProfile.avatar} />
            </Flex>
            <Flex column css={{ alignItems: 'center' }}>
              <Text p css={sectionHeader}>
                Profile Name
              </Text>
              <FormInputField
                css={{ width: '250px' }}
                id="name"
                name="name"
                control={control}
                defaultValue={myProfile?.name ?? ''}
                showFieldErrors
              />
            </Flex>
          </Flex>
          <Text p css={sectionHeader}>
            Select Your Interests
          </Text>
          <Flex
            css={{
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <SkillToggles
              value={skillsField.value}
              onChange={skillsField.onChange}
            />
          </Flex>
          <Text p css={sectionHeader}>
            Biography
          </Text>
          {showMarkdown ? (
            <Box
              tabIndex={0}
              css={{ borderRadius: '$3', width: '100%' }}
              onClick={() => {
                setShowMarkDown(false);
              }}
              onKeyDown={e => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowMarkDown(false);
                }
              }}
            >
              <MarkdownPreview display source={bioField.value} />
            </Box>
          ) : (
            <Box css={{ position: 'relative', width: '100%' }}>
              <TextArea
                autoSize
                ref={bioFieldRef}
                name={bioField.name}
                value={bioField.value}
                onChange={bioField.onChange}
                css={{
                  pb: '$xl',
                  width: '100%',
                  resize: 'vertical',
                }}
                placeholder="Tell us what you're working on"
                rows={6}
                onBlur={() => {
                  bioField.onBlur();
                  if (bioField.value && bioField.value?.length > 0)
                    setShowMarkDown(true);
                }}
                onFocus={e => {
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length
                  );
                }}
              />
              <Text
                inline
                size="small"
                color="secondary"
                css={{
                  position: 'absolute',
                  right: '$sm',
                  bottom: '$sm',
                }}
              >
                Markdown Supported
              </Text>
            </Box>
          )}
          <Text p css={sectionHeader}>
            Links
          </Text>
          <Flex
            css={{
              flexWrap: 'wrap',
              justifyContent: 'center',
              '& > *': {
                margin: '$md',
              },
            }}
          >
            <FormInputField
              id="twitter_username"
              name="twitter_username"
              control={control}
              defaultValue={myProfile?.twitter_username ?? ''}
              label="Twitter"
              placeholder="Enter username"
            />
            <FormInputField
              id="github_username"
              name="github_username"
              control={control}
              defaultValue={myProfile?.github_username ?? ''}
              placeholder="Enter username"
              label="Github"
            />
            <FormInputField
              id="telegram_username"
              name="telegram_username"
              control={control}
              defaultValue={myProfile?.telegram_username ?? ''}
              placeholder="Enter username"
              label="Telegram"
            />
            <FormInputField
              id="discord_username"
              name="discord_username"
              control={control}
              defaultValue={myProfile?.discord_username ?? ''}
              placeholder="Username#xxxx"
              label="Discord"
            />
            <FormInputField
              id="medium_username"
              name="medium_username"
              control={control}
              defaultValue={myProfile?.medium_username ?? ''}
              placeholder="Enter username"
              label="Medium"
            />
            <FormInputField
              id="website"
              name="website"
              control={control}
              defaultValue={myProfile?.website ?? ''}
              placeholder="https://website.com"
              label="Website"
            />
          </Flex>
          <Button disabled={!isDirty} color="cta" type="submit">
            Save
          </Button>
          {isSaving && <LoadingModal visible />}
        </Panel>
      </Form>
    </Modal>
  );
};
