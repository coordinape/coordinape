import { Navigate, useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { Button, makeStyles } from '@material-ui/core';

import { rMyProfile, rSelectedCircle } from 'recoilState/app';
import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_LANDING_PAGE,
  EXTERNAL_URL_TWITTER,
  paths,
} from 'routes/paths';
import { Box } from 'ui';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    color: theme.colors.text,
    margin: 0,
  },
  subTitle: {
    margin: 0,
    padding: theme.spacing(0, 5),
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.text,
  },
  welcomeSection: {
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.colors.text,
  },
  startCircle: {
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
}));

export const DefaultPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const myProfile = useRecoilValueLoadable(rMyProfile).valueMaybe();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();

  // still loading
  if (!myProfile) return null;

  if (!selectedCircle) {
    return (
      <Box
        css={{
          maxWidth: '700px',
          mx: 'auto',
          pt: '$2xl',
          px: '$lg',
          textAlign: 'center',
        }}
      >
        <p className={classes.title}>Welcome!</p>
        <div className={classes.welcomeSection}>
          <p className={classes.welcomeText}>
            This wallet isn&apos;t associated with a circle.
          </p>
          <p className={classes.welcomeText}>
            If you are supposed to be part of a circle already, contact your
            circle&apos;s admin to make sure they added this address:{' '}
            {myProfile.address}
          </p>
          <p className={classes.welcomeText}>Or, create a new circle.</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(paths.createCircle)}
            className={classes.startCircle}
          >
            Start a Circle
          </Button>
        </div>
        <Footer />
      </Box>
    );
  }

  return <Navigate to="/circles" replace />;
};

const Footer = () => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      pt: '$2xl',
      pb: '$xl',
      '> a': {
        padding: '$md 0',
        color: '$text',
        textDecoration: 'none',
        fontWeight: '$bold',
        fontSize: '$large',
      },
    }}
  >
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_LANDING_PAGE}>
      coordinape.com
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_DISCORD}>
      Discord
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_TWITTER}>
      Twitter
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_DOCS}>
      Docs
    </a>
  </Box>
);

export default DefaultPage;
