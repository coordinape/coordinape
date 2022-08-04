import { makeStyles, Typography } from '@material-ui/core';

import { DeworkLogo, RightArrowIcon, WonderLogo } from 'icons';

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
    color: theme.colors.secondaryText,
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
  },
  row: {
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.05)',
    padding: theme.spacing(0.25, 1),
    marginBottom: theme.spacing(0.5),
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
    color: theme.colors.secondaryText,
  },
}));

const renderIconInput = (type: string) => {
  if (type === 'wonder') {
    return <WonderLogo size="md" />;
  } else {
    return <DeworkLogo size="md" />;
  }
};

export function ContributionSummary({
  contributors,
}: {
  contributors: any;
}): JSX.Element | null {
  const classes = useStyles();
  if (
    !contributors[0]?.contributions?.length &&
    !contributors[1]?.contributions?.length
  )
    return null;

  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.title}>
        Contributions
      </Typography>
      {contributors.map((contributor: { contributions: any[]; type: string }) =>
        contributor?.contributions?.map((contribution: any, index: number) => {
          return (
            <a
              key={index}
              href={'http://app.wonderverse.xyz'}
              target="_blank"
              rel="noreferrer"
              className={classes.row}
            >
              {renderIconInput(contributor?.type)}
              <Typography variant="body2" className={classes.rowTitle}>
                {contribution.title}
              </Typography>
              <RightArrowIcon size="md" className={classes.moreIcon} />
            </a>
          );
        })
      )}
      {/* {contributors[0]?.contributions?.map(
        (contribution: any, index: number) => {
          return (
            <a
              key={index}
              href={'http://app.wonderverse.xyz'}
              target="_blank"
              rel="noreferrer"
              className={classes.row}
            >
              {renderIconInput(contributors[0].type)}
              <Typography variant="body2" className={classes.rowTitle}>
                {contribution.title}
              </Typography>
              <RightArrowIcon size="md" className={classes.moreIcon} />
            </a>
          );
        }
      )}
      {contributors[1]?.contributions?.map(
        (contribution: any, index: number) => (
          <a
            key={index}
            href={contribution.link}
            target="_blank"
            rel="noreferrer"
            className={classes.row}
          >
            {renderIconInput(contributors[1].type)}
            <Typography variant="body2" className={classes.rowTitle}>
              {contribution.title}
            </Typography>
            <RightArrowIcon size="md" className={classes.moreIcon} />
          </a>
        )
      )} */}
    </div>
  );
}
