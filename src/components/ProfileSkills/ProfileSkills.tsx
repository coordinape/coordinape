import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';

import { IUser } from 'types';

const useStyles = makeStyles(theme => ({
  skillItem: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.2, 1.7),
    background: theme.colors.lightBlue,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.white,
    borderRadius: 4,
  },
  adminSkillItem: {
    background: theme.colors.darkBlue,
  },
}));

export const ProfileSkills = ({
  user,
  max = 3,
}: {
  user: IUser;
  max: number;
}) => {
  const classes = useStyles();
  const skills = user?.profile?.skills ?? ([] as string[]);

  return (
    <>
      {skills.length > 0 &&
        skills.slice(0, max).map(skill => (
          <div key={skill} className={classes.skillItem}>
            {skill}
          </div>
        ))}
      {user?.role == 1 ? (
        <div
          key="Admin"
          className={clsx(classes.skillItem, classes.adminSkillItem)}
        >
          Admin
        </div>
      ) : undefined}
    </>
  );
};
