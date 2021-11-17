import { makeStyles, ButtonGroup, Button } from '@material-ui/core';

import { AlusdIcon } from 'icons/AlusdIcon';
import { DAIIcon } from 'icons/DAIIcon';
import { EthIcon } from 'icons/EthIcon';
import { SushiIcon } from 'icons/SushiIcon';
import { USDCIcon } from 'icons/USDCIcon';
import { USDTIcon } from 'icons/USDTIcon';
import { YFIIcon } from 'icons/YFIIcon';

const useStyles = makeStyles(theme => ({
  assetBox: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '70%',
  },
  assetBtn: {
    flex: '1 0 21%',
    height: '50px',
    width: '150px',
    margin: theme.spacing(2, 2),
    fontSize: 15,
    fontWeight: 400,
    textDecoration: 'none',
    position: 'relative',
    backgroundColor: theme.colors.ultraLightGray,
    padding: theme.spacing(1, 1),
    borderRadius: '20px',
    color: theme.colors.text,
    alignItems: 'center',
    border: 'none',
    '&:not(:last-child)': {
      borderRight: 'none',
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    '&:not(:first-child)': {
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.ultraLightGray,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.ultraLightGray,
        },
      },
    },
  },
  btnSpan: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.3em',
  },
  grouped: {
    minWidth: 102,
    borderRadius: 8,
    fontWeight: 300,
    flexWrap: 'wrap',
    flexDirection: 'row',
    boxShadow: 'none',
  },
  inactive: {
    color: theme.colors.text,
    background: theme.colors.lightBackground,
    '&:hover': {
      background: theme.colors.lightBlue + '80',
      color: theme.colors.white,
    },
  },
  active: {
    color: theme.colors.white,
    background: theme.colors.lightBlue,
    '&:hover': {
      background: theme.colors.lightBlue,
    },
  },
}));

interface AssetDisplay {
  setAsset: React.Dispatch<React.SetStateAction<string>>;
}

export default function AssetDisplay({ setAsset }: AssetDisplay) {
  const classes = useStyles();

  const handleAssetSelect = (asset: string) => {
    setAsset(asset);
  };

  return (
    <div className={classes.assetBox}>
      <ButtonGroup
        id="buttontoken"
        variant="contained"
        color="default"
        className={classes.grouped}
      >
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('dai')}
        >
          <span className={classes.btnSpan}>
            <DAIIcon height={25} width={22} className={classes.icon} />
            DAI
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('usdc')}
        >
          <span className={classes.btnSpan}>
            <USDCIcon width={25} height={22} className={classes.icon} />
            USDC
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('yfi')}
        >
          <span className={classes.btnSpan}>
            <YFIIcon width={25} height={22} className={classes.icon} />
            YFI
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('sushi')}
        >
          <span className={classes.btnSpan}>
            <SushiIcon width={25} height={25} className={classes.icon} />
            Sushi
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('alUsd')}
        >
          <span className={classes.btnSpan}>
            <AlusdIcon height={25} width={22} className={classes.icon} />
            alUSD
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('usdt')}
        >
          <span className={classes.btnSpan}>
            <USDTIcon height={25} width={25} className={classes.icon} />
            USDT
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('eth')}
        >
          <span className={classes.btnSpan}>
            <EthIcon height={32} width={32} className={classes.icon} />
            ETH
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          onClick={() => handleAssetSelect('other')}
        >
          <span className={classes.btnSpan}>Other</span>
        </Button>
      </ButtonGroup>
    </div>
  );
}
