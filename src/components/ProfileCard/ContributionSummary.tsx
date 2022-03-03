import { FC } from 'react';

import { makeStyles, Typography } from '@material-ui/core';

import { ContributionUser } from 'hooks/useContributions';
import { DeworkLogo, RightArrowIcon } from 'icons';

interface Props {
  contributions: ContributionUser;
}

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1, 0),
    color: theme.colors.text,
  },
  list: {
    borderRadius: 8,
    backgroundColor: theme.colors.white,
  },
  title: {
    textTransform: 'uppercase',
    color: theme.colors.lightText,
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)',
    padding: theme.spacing(0.25, 1),
    marginBottom: theme.spacing(1),
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    textDecoration: 'none',
    transition: 'all 200ms ease-out',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  rowTitle: {
    flex: 1,
    margin: theme.spacing(0, 0.5, 0, 1),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  moreIcon: {
    color: theme.colors.mediumGray,
  },
}));

export const ContributionSummary: FC<Props> = ({ contributions }) => {
  const classes = useStyles();
  if (!contributions.contributions.length) return null;
  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.title}>
        Contributions ({contributions.contributions.length})
      </Typography>
      {contributions.contributions.map((contribution, index) => (
        <a
          key={index}
          href={contribution.link}
          target="_blank"
          rel="noreferrer"
          className={classes.row}
        >
          <DeworkLogo size="md" />
          <Typography variant="body1" className={classes.rowTitle}>
            {contribution.title}
          </Typography>
          <RightArrowIcon size="md" className={classes.moreIcon} />
        </a>
      ))}
    </div>
  );
};
