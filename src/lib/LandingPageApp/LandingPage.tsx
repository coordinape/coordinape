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

import AlchemistLogo from 'assets/svgs/landing-page/alchemist-logo.svg';
import BanklessLogo from 'assets/svgs/landing-page/bankless-logo.svg';
import Cre8rDaoLogo from 'assets/svgs/landing-page/cre8rdao-logo.svg';
import CreamLogo from 'assets/svgs/landing-page/cream-logo.svg';
import DaoHausLogo from 'assets/svgs/landing-page/daohaus-logo.svg';
import GitcoinLogo from 'assets/svgs/landing-page/gitcoin-logo.svg';
import GraphCard from 'assets/svgs/landing-page/graph-card.png';
import HistoryCard from 'assets/svgs/landing-page/history-card.png';
import MetacartelLogo from 'assets/svgs/landing-page/metacartel-logo.svg';
import PoolTogetherLogo from 'assets/svgs/landing-page/pooltogether-logo.svg';
import ProfileCard from 'assets/svgs/landing-page/profile-card.png';
import RaribleLogo from 'assets/svgs/landing-page/rarible-logo.svg';
import Splash from 'assets/svgs/landing-page/splash.svg';
import SushiswapLogo from 'assets/svgs/landing-page/sushiswap-logo.svg';
import YearnLogo from 'assets/svgs/landing-page/yearn-logo.svg';
import { CoordinapeLogo } from 'components';
import { DocsIcon, TwitterIcon, MediumIcon, DiscordIcon } from 'icons';
import {
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_TWITTER,
  EXTERNAL_URL_MEDIUM_ARTICLE,
  EXTERNAL_URL_DISCORD,
} from 'routes/paths';
import { APP_URL_OPEN_WALLET, APP_URL_CREATE_CIRCLE } from 'utils/domain';

import { colors } from './createLandingPageTheme';

const VALUE_PROP_REWARD =
  'Gift Circles allow DAO members to collectively reward each other making community payments more equitable and transparent.';
const VALUE_PROP_INCENTIVIZE =
  'Circle contributors directly recognize each other’s value, building a more cohesive and productive community.';
const VALUE_PROP_SCALE =
  'Understand how value moves through your organization and move more decisions and resources to the community.';

const useStyles = makeStyles(theme => ({
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
    maxWidth: 848,
    marginTop: 132,
    padding: '0 23px 0',
    [theme.breakpoints.down('sm')]: {
      marginTop: 115,
    },
  },
  headerButtons: {
    width: '100%',
    marginTop: 76,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& button:first-child': {
      marginRight: theme.spacing(3),
      [theme.breakpoints.down('xs')]: {
        margin: theme.spacing(0, 0, 1),
      },
    },
    '& button': {
      width: 240,
      height: 48,
    },
  },
  button: {
    minWidth: 240,
    height: 48,
  },
  logo: {
    color: theme.palette.text.primary,
  },
  walletButton: {
    marginTop: 20,
    marginRight: 11,
  },
  descriptionContainer: {
    width: '100%',
    marginTop: 82,
    marginBottom: 63,
    padding: theme.spacing(0, 18),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 44,
      marginBottom: 25,
      padding: theme.spacing(0, 3),
    },
  },
  descriptionUnderlineBox: {
    padding: theme.spacing(0, 10, 1.5),
    textAlign: 'center',
    borderBottom: '0.5px solid rgba(81, 99, 105, 0.7)',
    marginBottom: 61,
    opacity: 0.9,
    whiteSpace: 'pre-line',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 23,
    },
  },
  descriptionText: {
    marginTop: 0,
    marginBottom: 61,
    fontSize: 34,
    fontWeight: 300,
    maxWidth: 1055,
    color: theme.colors.text,
    whiteSpace: 'pre-line',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 23,
      fontSize: 24,
    },
  },
  descriptionEmoji: {
    margin: 0,
    fontSize: 70,
    fontWeight: 400,
  },
  valuePropContainer: {
    backgroundColor: colors.almostWhite,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  underlineBox: {
    textAlign: 'center',
    margin: theme.spacing(0, 5),
    padding: theme.spacing(9, 1, 1.5),
    borderBottom: '0.5px solid rgba(81, 99, 105, 0.7)',
    marginBottom: 87,
    opacity: 0.9,
    whiteSpace: 'pre-line',
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
    maxWidth: 850,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    padding: '140px 32px',
    '& > *:first-child': {
      marginBottom: '11px',
    },
    '& p': {
      fontSize: 20,
      fontWeight: 300,
      marginTop: 0,
      marginBottom: '20px',
    },
    '& button': {
      marginTop: '16px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '90px 11px',
    },
  },
  partnerContainer: {
    backgroundColor: colors.almostWhite,
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
      marginBottom: 23,
    },
    '& p': {
      fontSize: 18,
      fontWeight: 400,
      color: theme.colors.black,
      opacity: 0.4,
    },
    [theme.breakpoints.down('sm')]: {
      margin: '30px 10px 0',
      '& > img': {
        marginBottom: '8px',
        width: 40,
        height: 40,
      },
      '& p': {
        fontSize: 12,
      },
    },
  },
  footer: {
    backgroundColor: colors.almostWhite,
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
  name: string;
}

const Partner = ({ imageSrc, name }: IPartnerProps) => {
  const classes = useStyles();
  return (
    <div className={classes.partner}>
      <img src={imageSrc} alt="logo" />
      <Typography variant="body2">{name}</Typography>
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
              <Button
                className={classes.walletButton}
                variant="outlined"
                color="default"
                size="small"
              >
                Launch Coordinape
              </Button>
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
            <a href={EXTERNAL_URL_DISCORD} rel="noreferrer" target="_blank">
              <Button
                variant="contained"
                color="default"
                disableElevation
                startIcon={<DiscordIcon />}
              >
                Join our Discord
              </Button>
            </a>
            <a href={APP_URL_CREATE_CIRCLE}>
              <Button variant="contained" color="primary" disableElevation>
                Start a Circle
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className={classes.descriptionContainer}>
        <Box className={classes.descriptionUnderlineBox}>
          <Typography variant="subtitle1">Why Coordinape?</Typography>
        </Box>
        <p className={classes.descriptionText}>
          The promise of DAOs is decentralized collaboration, with teams of
          people working together to solve big problems and sharing in the
          rewards of their efforts.{'\n\n'}On this new frontier we face new
          kinds of coordination problems. We need to compensate and recognize
          each other for the effort and passion we pour into DAOs.{'\n\n'}
          Coordinape is a tool to do just that. We go beyond just paying people
          –we make the experience of working with DAOs more rewarding, human and
          fair.
        </p>
        <span
          role="img"
          aria-label="coordinape"
          className={classes.descriptionEmoji}
        >
          🤝 🦍
        </span>
      </div>
      <div className={classes.valuePropContainer}>
        <Box className={classes.underlineBox}>
          <Typography variant="subtitle1">
            How can Coordinape help your DAO?
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
            color="primary"
            disableElevation
            className={classes.button}
          >
            Read Our Medium Article
          </Button>
        </a>
      </div>
      <div className={classes.partnerContainer}>
        <Typography variant="h3">Our Alpha Partners</Typography>
        <div className={classes.partners}>
          <Partner
            imageSrc={YearnLogo}
            give={225300}
            epochs={8}
            name="Yearn Finance"
          />
          <Partner imageSrc={CreamLogo} give={0} epochs={0} name="CREAM" />
          <Partner
            imageSrc={SushiswapLogo}
            give={0}
            epochs={0}
            name="Sushiswap"
          />
          <Partner
            imageSrc={GitcoinLogo}
            give={2600}
            epochs={1}
            name="Gitcoin"
          />
        </div>
        <div className={classes.partners}>
          <div />
          <Partner
            imageSrc={PoolTogetherLogo}
            give={0}
            epochs={0}
            name="Pool Together"
          />
          <Partner
            imageSrc={Cre8rDaoLogo}
            give={0}
            epochs={0}
            name="CRE8R DAO"
          />
          <Partner imageSrc={DaoHausLogo} give={0} epochs={0} name="DAOhaus" />
          <div />
        </div>
        <div className={classes.partners}>
          <Partner imageSrc={RaribleLogo} give={0} epochs={0} name="Rarible" />
          <Partner
            imageSrc={BanklessLogo}
            give={0}
            epochs={0}
            name="Bankless"
          />
          <Partner
            imageSrc={MetacartelLogo}
            give={0}
            epochs={0}
            name="Metacartel"
          />
          <Partner
            imageSrc={AlchemistLogo}
            give={0}
            epochs={0}
            name="Alchemist"
          />
        </div>
      </div>
      <div className={classes.questionContainer}>
        <Typography variant="h3">
          Interested in starting your own circle?
        </Typography>
        {/* <p>
          We&apos;re launching a permisionless onchain version soon. In the
          meantime, come say hi in our Discord and let us know more about your
          project
        </p> */}
        <a href={APP_URL_CREATE_CIRCLE} rel="noreferrer" target="_blank">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            className={classes.button}
          >
            Start a Circle
          </Button>
        </a>
      </div>
      <div className={classes.footer}>
        <a href={EXTERNAL_URL_DOCS} rel="noreferrer" target="_blank">
          <Button startIcon={<DocsIcon />} className={classes.footerLink}>
            Docs
          </Button>
        </a>
        <a href={EXTERNAL_URL_DISCORD} rel="noreferrer" target="_blank">
          <Button startIcon={<DiscordIcon />} className={classes.footerLink}>
            Discord
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
