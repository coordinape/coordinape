import React, { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import * as z from 'zod';

import { SkillToggles, AvatarUpload, FormInputField } from 'components/index';
import { useApiWithProfile } from 'hooks';
import { useMyProfile } from 'recoilState/app';
import {
  Box,
  Button,
  Flex,
  Form,
  MarkdownPreview,
  Modal,
  Text,
  TextArea,
} from 'ui';

const schema = z
  .object({
    avatar: z.any(),
    bio: z.string(),
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
  fontWeight: '$bold',
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

  const myProfile = useMyProfile();
  const { updateMyProfile } = useApiWithProfile();

  const bioFieldRef = useRef<HTMLTextAreaElement>(null);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<EditProfileFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
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
  const onSubmit: SubmitHandler<EditProfileFormSchema> = async params => {
    // skills is an array here but the backend expects a json encoded array
    const fixedParams: Omit<typeof params, 'skills' | 'website'> & {
      skills: string;
      website: string | null;
    } = { ...params, skills: JSON.stringify(params.skills) };

    if (fixedParams.website == '') {
      fixedParams.website = null;
    }
    try {
      await updateMyProfile(fixedParams);
      onClose();
    } catch (e: unknown) {
      console.warn(e);
    }
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
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text h2>Edit Profile</Text>
        <Text p css={sectionHeader}>
          Profile Image
        </Text>
        <AvatarUpload original={myProfile.avatar} />

        <Text p css={sectionHeader}>
          Select Your Skills
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
            <MarkdownPreview source={bioField.value} />
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
        <Button disabled={!isDirty} color="primary" type="submit">
          Save
        </Button>
      </Form>
    </Modal>
  );
};
