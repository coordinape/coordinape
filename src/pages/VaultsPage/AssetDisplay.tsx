import { useState } from 'react';

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
    '&[data-selected=true]': {
      backgroundColor: theme.colors.lightGray,
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
}));

interface AssetDisplay {
  setAsset: React.Dispatch<React.SetStateAction<string>>;
}

export default function AssetDisplay({ setAsset }: AssetDisplay) {
  const classes = useStyles();
  const [selectedButton, setSelectedButton] = useState('');

  const handleAssetSelect = (asset: string) => {
    setSelectedButton(asset);
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
          data-selected={selectedButton === 'dai' ? true : false}
          onClick={() => handleAssetSelect('dai')}
        >
          <span className={classes.btnSpan}>
            <DAIIcon height={25} width={22} className={classes.icon} />
            DAI
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'usdc' ? true : false}
          onClick={() => handleAssetSelect('usdc')}
        >
          <span className={classes.btnSpan}>
            <USDCIcon width={25} height={22} className={classes.icon} />
            USDC
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'yfi' ? true : false}
          onClick={() => handleAssetSelect('yfi')}
        >
          <span className={classes.btnSpan}>
            <YFIIcon width={25} height={22} className={classes.icon} />
            YFI
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'sushi' ? true : false}
          onClick={() => handleAssetSelect('sushi')}
        >
          <span className={classes.btnSpan}>
            <SushiIcon width={25} height={25} className={classes.icon} />
            Sushi
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'alUsd' ? true : false}
          onClick={() => handleAssetSelect('alUsd')}
        >
          <span className={classes.btnSpan}>
            <AlusdIcon height={25} width={22} className={classes.icon} />
            alUSD
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'usdt' ? true : false}
          onClick={() => handleAssetSelect('usdt')}
        >
          <span className={classes.btnSpan}>
            <USDTIcon height={25} width={25} className={classes.icon} />
            USDT
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'eth' ? true : false}
          onClick={() => handleAssetSelect('eth')}
        >
          <span className={classes.btnSpan}>
            <EthIcon height={32} width={32} className={classes.icon} />
            ETH
          </span>
        </Button>
        <Button
          className={classes.assetBtn}
          data-selected={selectedButton === 'other' ? true : false}
          onClick={() => handleAssetSelect('other')}
        >
          <span className={classes.btnSpan}>Other</span>
        </Button>
      </ButtonGroup>
    </div>
  );
}
