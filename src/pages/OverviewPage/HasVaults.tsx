import { Button, makeStyles, Grid } from '@material-ui/core';

import CircleCard from './CircleCard';

const useStyles = makeStyles(theme => ({
  editTxt: {
    color: theme.colors.lightBlue,
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    fontSize: 14,
  },
  twoLineCell: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    lineHeight: 1.5,
  },
  twoLineCellTitle: {
    fontWeight: 600,
    fontSize: 14,
  },
  twoLineCellSubtitle: {
    fontWeight: 700,
    fontSize: 20,
  },
  twoLineCellActionTitle: {
    fontWeight: 600,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  twoLineCellActionSubtitle: {
    fontWeight: 300,
    fontSize: 18,
  },
  vaultCard: {
    display: 'grid',
    flexDirection: 'column',
    background: theme.colors.white,
    gridTemplateColumns: '1fr 1fr',
    minHeight: 82,
    boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
  },
  ActionCard: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.white,
    minHeight: 82,
    boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4, 4),
    margin: theme.spacing(4, 0),
  },
  withVaults: {
    minHeight: 668,
    display: 'grid',
    alignContent: 'space-between',
    justifyItems: 'stretch',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    columnGap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'start',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  overviewTitle: {
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: 700,
    marginRight: '1em',
  },
  horizontalDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  depositWithdrawBtns: {
    margin: '0 0.25em 0 0.25em',
  },
  vaultsSecondaryh4: {
    color: theme.colors.lightBlue,
    fontSize: 15,
    fontWeight: 300,
    margin: 0,
    padding: theme.spacing(0, 0.5, 0),
  },
  noVaultsSubtitle: {
    color: theme.colors.mediumGray,
    fontSize: 15,
    fontWeight: 300,
  },
  infoIcon: {
    height: 20,
    width: 20,
    marginBottom: 0,
  },
  totalValue: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  number: {
    color: theme.colors.black,
    fontSize: 24,
    margin: 0,
    fontWeight: 600,
    paddingRight: 8,
  },
  noVaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  epochsTable: {
    flexGrow: 4,
    marginBottom: theme.spacing(8),
  },
  newTable: {
    flexGrow: 4,
    height: 288,
    marginTop: -80,
    paddingTop: 0,
  },
  tablePlaceholderTitle: {
    fontSize: 20,
    lineHeight: 1.2,
    color: theme.colors.text,
    opacity: 0.7,
  },
  noVaultsInterior: {
    height: 288,
    display: 'flex',
    borderRadius: 8,
    background: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: -80,
    gridTemplateColumns: '1fr',
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  gridItem: {
    margin: 5,
  },
}));

export default function HasVaults() {
  const classes = useStyles();

  return (
    <div className={classes.withVaults}>
      <div>
        <div className={classes.horizontalDisplay}>
          <h2 className={classes.overviewTitle}>Total funds</h2>
        </div>
        <div className={classes.totalValue}>
          <div className={classes.number}>$25,752,238.73</div>
        </div>
        <div className={classes.vaultCard}>
          <div className={classes.twoLineCell}>
            <span className={classes.twoLineCellTitle}>USDC Vault</span>
            <span className={classes.twoLineCellSubtitle}>200,000 USDC</span>
          </div>
          <div className={classes.editTxt}>View Vault</div>
        </div>
        <div className={classes.vaultCard}>
          <div className={classes.twoLineCell}>
            <span className={classes.twoLineCellTitle}>USDC Vault</span>
            <span className={classes.twoLineCellSubtitle}>200,000 USDC</span>
          </div>
          <div className={classes.editTxt}>View Vault</div>
        </div>
        <div className={classes.vaultCard}>
          <div className={classes.twoLineCell}>
            <span className={classes.twoLineCellTitle}>USDC Vault</span>
            <span className={classes.twoLineCellSubtitle}>200,000 USDC</span>
          </div>
          <div className={classes.editTxt}>View Vault</div>
        </div>
      </div>
      <div>
        <div className={classes.verticalDisplay}>
          <h2 className={classes.overviewTitle}>Circles</h2>
          {/* Turn this into a .map with all circle objects: */}
          <Grid container xs={12} justify="center" spacing={2}>
            <Grid item xs={5}>
              <CircleCard
                name={'The winners'}
                epochTitle={'1'}
                startDays={'3'}
                startTime={'4'}
              />
            </Grid>
            <Grid item xs={5}>
              <CircleCard
                name={'The Losers'}
                epochTitle={'2'}
                startDays={'3'}
                startTime={'4'}
              />
            </Grid>
            <Grid item xs={5}>
              <CircleCard
                name={'The Sinners'}
                epochTitle={'3'}
                startDays={'3'}
                startTime={'4'}
              />
            </Grid>
            <Grid item xs={5}>
              <CircleCard
                name={'The Saints'}
                epochTitle={'4'}
                startDays={'3'}
                startTime={'4'}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <div>
        <div className={classes.horizontalDisplay}>
          <h2 className={classes.overviewTitle}>Action Items</h2>
        </div>
        <div className={classes.ActionCard}>
          <div className={classes.twoLineCell}>
            <span className={classes.twoLineCellActionTitle}>
              Yearn Community Epoch 11
            </span>
            <span className={classes.twoLineCellActionSubtitle}>
              Epoch 11 was scheduled to start on November 23 but has not yet
              been funded.
            </span>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.depositWithdrawBtns}
            >
              Fund Epoch
            </Button>
          </div>
        </div>
        <div className={classes.ActionCard}>
          <div className={classes.twoLineCell}>
            <span className={classes.twoLineCellActionTitle}>Strategists</span>
            <span className={classes.twoLineCellActionSubtitle}>
              Epoch 22 ended with 16 people sending 1600 total GIVE. A circle
              admin must confirm the epoch details in order to distribute funds.
            </span>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.depositWithdrawBtns}
            >
              Confirm and Distribute Funds
            </Button>
          </div>
        </div>
        <div className={classes.ActionCard}>
          <div className={classes.twoLineCell}>
            <span className={classes.twoLineCellActionTitle}>
              Yearn Community Epoch 11
            </span>
            <span className={classes.twoLineCellActionSubtitle}>
              Epoch 11 was scheduled to start on November 23 but has not yet
              been funded.
            </span>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.depositWithdrawBtns}
            >
              Fund Epoch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
