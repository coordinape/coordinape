import React from 'react';

import clsx from 'clsx';

import {
  makeStyles,
  useMediaQuery,
  Hidden,
  Typography,
  Button,
  Box,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import CreamLogo from 'assets/svgs/landing-page/cream-logo.svg';
import GitcoinLogo from 'assets/svgs/landing-page/gitcoin-logo.svg';
import GraphCard from 'assets/svgs/landing-page/graph-card.png';
import HistoryCard from 'assets/svgs/landing-page/history-card.png';
import ProfileCard from 'assets/svgs/landing-page/profile-card.png';
import Splash from 'assets/svgs/landing-page/splash.svg';
import SushiswapLogo from 'assets/svgs/landing-page/sushiswap-logo.svg';
import YearnLogo from 'assets/svgs/landing-page/yearn-logo.svg';
import { ConnectWalletButton, CoordinapeLogo } from 'components';
import {
  EXTERNAL_URL_TYPEFORM,
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_TWITTER,
  EXTERNAL_URL_MEDIUM_ARTICLE,
  AUTO_OPEN_WALLET_DIALOG_PARAMS,
} from 'config/constants';
import { DocsIcon, TwitterIcon, MediumIcon } from 'icons';
import { getAppUrl } from 'utils/domain';

const VALUE_PROP_REWARD =
  'Gift Circles allow DAO members to collectively reward eachother making community payments more equitable and transparent.';
const VALUE_PROP_INCENTIVIZE =
  'Circle contributors directly recognize eachother’s value, building a more cohesive and productive community.';
const VALUE_PROP_SCALE =
  'Understand how value moves through your organization and move more decisions and resources to the community.';

const APP_URL = getAppUrl();
const APP_URL_OPEN_WALLET = `${getAppUrl()}${AUTO_OPEN_WALLET_DIALOG_PARAMS}`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 600,
    width: '100%',
    backgroundImage: `url(${Splash})`,
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 104,
    width: '100%',
    padding: '27px 34px 0',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      height: 120,
      paddingTop: 71,
    },
  },
  headerTitle: {
    textAlign: 'center',
    width: '100%',
    marginTop: 132,
    padding: '0 23px 0',
    [theme.breakpoints.down('sm')]: {
      marginTop: 115,
    },
  },
  headerButtons: {
    width: '100%',
    marginTop: 55,
    display: 'flex',
    justifyContent: 'center',
    '& button:first-child': {
      marginRight: 20,
    },
    '& button': {
      width: 214,
    },
  },
  logo: {
    color: theme.palette.text.primary,
  },
  walletButton: {
    marginTop: 20,
    marginRight: 11,
  },
  valuePropContainer: {
    backgroundColor: theme.colors.almostWhite,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  underlineBox: {
    textAlign: 'center',
    padding: '72px 0 12px',
    borderBottom: '0.5px solid rgba(81, 99, 105, 0.7)',
    marginBottom: 147,
    opacity: 0.9,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 49,
    },
  },
  valueProps: {
    width: '100%',
    padding: '0 50px 0',
    maxWidth: 1055,
  },
  valuePropMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '104px',
    '& h4': {
      marginTop: '28px',
    },
    '& p': {
      marginTop: '8px',
    },
  },
  valuePropCardMobile: {
    width: 308,
    maxWidth: '100%',
  },
  valueProp: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    marginBottom: 115,
  },
  valuePropText: {
    maxWidth: '400px',
    '& p': {
      marginTop: '36px',
      paddingBottom: '50px',
    },
  },
  valuePropRight: {
    justifySelf: 'right',
    textAlign: 'right',
  },
  questionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '140px 12px',
    '& > *:first-child': {
      marginBottom: '23px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '90px 11px',
    },
  },
  partnerContainer: {
    backgroundColor: theme.colors.almostWhite,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '143px 0 166px',
    [theme.breakpoints.down('sm')]: {
      padding: '51px 0 91px',
    },
  },
  partners: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
  },
  partner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '90px 40px 0',
    '& > img': {
      marginBottom: '24px',
    },
    '& p': {
      color: theme.colors.black,
      opacity: 0.4,
    },
  },
  footer: {
    backgroundColor: theme.colors.almostWhite,
    padding: '80px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& button:not(:last-child)': {
        marginBottom: 80,
      },
    },
  },
  footerLink: {
    fontSize: 24,
    lineHeight: 1.3,
    fontWeight: 600,
    textDecoration: 'underline',
    fontFamily: theme.typography.fontFamily,
  },
}));

interface IValueProps {
  imageSrc: string;
  imgWidth: number;
  title: string;
  description: string;
  rightJustify?: boolean;
}

const ValueProp = ({
  imageSrc,
  imgWidth,
  title,
  description,
  rightJustify = false,
}: IValueProps) => {
  const theme = useTheme();
  const classes = useStyles();
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  if (isDownSm) {
    return (
      <div className={classes.valuePropMobile}>
        <div className={classes.valuePropCardMobile}>
          <img src={imageSrc} alt="screenshot" width={imgWidth} />
        </div>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
      </div>
    );
  }
  const text = (
    <Box
      className={clsx(classes.valuePropText, {
        [classes.valuePropRight]: rightJustify,
      })}
    >
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
  const image = (
    <Box justifySelf={rightJustify ? 'right' : 'left'}>
      <img src={imageSrc} alt="screenshot" width={imgWidth} />
    </Box>
  );

  return !rightJustify ? (
    <div className={classes.valueProp}>
      {image}
      {text}
    </div>
  ) : (
    <div className={classes.valueProp}>
      {text}
      {image}
    </div>
  );
};

interface IPartnerProps {
  imageSrc: string;
  give: number;
  epochs: number;
}

const Partner = ({ imageSrc, give, epochs }: IPartnerProps) => {
  const classes = useStyles();
  return (
    <div className={classes.partner}>
      <img src={imageSrc} alt="logo" />
      {/* <Typography variant="body2">{give} GIVE</Typography>
      <Typography variant="body2">distributed</Typography>
      <Typography variant="body2">over {epochs} Epochs</Typography> */}
    </div>
  );
};

const LandingPage = () => {
  const theme = useTheme();
  const classes = useStyles();
  // xs      sm       md       lg       xl
  // 0px     600px    960px    1280px   1920px
  const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.headerTop}>
          <CoordinapeLogo
            withTitle
            height={isDownXs ? 50 : 77}
            className={classes.logo}
          />
          <Hidden xsDown>
            <a href={APP_URL_OPEN_WALLET}>
              <ConnectWalletButton className={classes.walletButton} />
            </a>
          </Hidden>
        </div>
        <div className={classes.headerTitle}>
          <Typography variant="h2">Tools for DAOs that Do</Typography>
          <Typography variant="body1">
            Scale your community with tools to reward contributors, incentivize
            participation and manage resources
          </Typography>
          <div className={classes.headerButtons}>
            <a href={EXTERNAL_URL_TYPEFORM} rel="noreferrer" target="_blank">
              <Button
                variant="contained"
                color="secondary"
                size="small"
                disableElevation={isDownXs}
              >
                Get Started
              </Button>
            </a>

            <Hidden xsDown>
              <a href={APP_URL}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  disableElevation={isDownXs}
                >
                  Launch Coordinape
                </Button>
              </a>
            </Hidden>
          </div>
        </div>
      </div>
      <div className={classes.valuePropContainer}>
        <Box className={classes.underlineBox}>
          <Typography variant="subtitle1">
            What can Coordinape help you do?
          </Typography>
        </Box>
        <div className={classes.valueProps}>
          <ValueProp
            imageSrc={ProfileCard}
            imgWidth={isDownSm ? 243 : 366}
            title="Reward Contributors"
            description={VALUE_PROP_REWARD}
          />
          <ValueProp
            imageSrc={HistoryCard}
            imgWidth={isDownSm ? 314 : 356}
            title="Incentivize Participation"
            description={VALUE_PROP_INCENTIVIZE}
            rightJustify
          />
          <ValueProp
            imageSrc={GraphCard}
            imgWidth={isDownSm ? 263 : 397}
            title="Scale DAO Operations"
            description={VALUE_PROP_SCALE}
          />
        </div>
      </div>
      <div className={classes.questionContainer}>
        <Typography variant="h3">Want to Learn More?</Typography>
        <a href={EXTERNAL_URL_MEDIUM_ARTICLE} rel="noreferrer" target="_blank">
          <Button
            variant="contained"
            color="secondary"
            disableElevation={isDownXs}
          >
            Read our Medium Article
          </Button>
        </a>
      </div>
      <div className={classes.partnerContainer}>
        <Typography variant="h3">Our Alpha Partners</Typography>
        <div className={classes.partners}>
          <Partner imageSrc={YearnLogo} give={225300} epochs={8} />
          <Partner imageSrc={CreamLogo} give={0} epochs={0} />
          <Partner imageSrc={SushiswapLogo} give={0} epochs={0} />
          <Partner imageSrc={GitcoinLogo} give={2600} epochs={1} />
        </div>
      </div>
      <div className={classes.questionContainer}>
        <Typography variant="h3">
          Interested in starting your own circle?
        </Typography>
        <a href={EXTERNAL_URL_TYPEFORM} rel="noreferrer" target="_blank">
          <Button
            variant="contained"
            color="secondary"
            disableElevation={isDownXs}
          >
            Get Started
          </Button>
        </a>
      </div>
      <div className={classes.footer}>
        <a href={EXTERNAL_URL_DOCS} rel="noreferrer" target="_blank">
          <Button startIcon={<DocsIcon />} className={classes.footerLink}>
            Docs
          </Button>
        </a>
        <a href={EXTERNAL_URL_TWITTER} rel="noreferrer" target="_blank">
          <Button startIcon={<TwitterIcon />} className={classes.footerLink}>
            Twitter
          </Button>
        </a>
        <a href={EXTERNAL_URL_MEDIUM_ARTICLE} rel="noreferrer" target="_blank">
          <Button startIcon={<MediumIcon />} className={classes.footerLink}>
            Medium
          </Button>
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
