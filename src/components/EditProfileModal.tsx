import React from 'react';

import { transparentize } from 'polished';

import { makeStyles } from '@material-ui/core';

import {
  FormModal,
  DeprecatedFormTextField,
  SkillToggles,
  AvatarUpload,
} from 'components/index';
import EditProfileForm from 'forms/EditProfileForm';
import { useApiWithProfile } from 'hooks';
import { useMyProfile } from 'recoilState/app';

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: transparentize(0.3, theme.colors.text),
    padding: theme.spacing(0, 0, 1),
    margin: theme.spacing(4, 0, 2),
    borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
    width: '60%',
    minWidth: 300,
    textAlign: 'center',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(2, 2, 2),
    },
  },
}));

export const EditProfileModal = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();

  const myProfile = useMyProfile();
  const { updateMyProfile, updateAvatar } = useApiWithProfile();

  return (
    <EditProfileForm.FormController
      source={myProfile}
      submit={async params => {
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
      }}
    >
      {({ fields, errors, changedOutput, handleSubmit }) => (
        <FormModal
          onClose={onClose}
          open={open}
          title="Edit Profile"
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          errors={errors}
          size="large"
        >
          <h2 className={classes.sectionHeader}>Profile Image</h2>
          <AvatarUpload original={myProfile.avatar} commit={updateAvatar} />

          <h2 className={classes.sectionHeader}>Select Your Skills</h2>
          <div className={classes.skillsContainer}>
            <SkillToggles
              value={fields.skills.value}
              onChange={fields.skills.onChange}
            />
          </div>

          <h2 className={classes.sectionHeader}>Biography</h2>
          <DeprecatedFormTextField
            {...fields.bio}
            fullWidth
            placeholder="Tell us what you're working on"
            multiline
            rows={6}
          />

          <h2 className={classes.sectionHeader}>Links</h2>
          <div className={classes.links}>
            <DeprecatedFormTextField
              {...fields.twitter_username}
              placeholder="Enter username"
              label="Twitter"
            />
            <DeprecatedFormTextField
              {...fields.github_username}
              placeholder="Enter username"
              label="Github"
            />
            <DeprecatedFormTextField
              {...fields.telegram_username}
              placeholder="Enter username"
              label="Telegram"
            />
            <DeprecatedFormTextField
              {...fields.discord_username}
              placeholder="Username#xxxx"
              label="Discord"
            />
            <DeprecatedFormTextField
              {...fields.medium_username}
              placeholder="Enter username"
              label="Medium"
            />
            <DeprecatedFormTextField
              {...fields.website}
              placeholder="https://website.com"
              label="Website"
            />
          </div>
        </FormModal>
      )}
    </EditProfileForm.FormController>
  );
};
