import { AlusdIcon } from 'icons/AlusdIcon';
import { DAIIcon } from 'icons/DAIIcon';
import { EthIcon } from 'icons/EthIcon';
import { SushiIcon } from 'icons/SushiIcon';
import { USDCIcon } from 'icons/USDCIcon';
import { USDTIcon } from 'icons/USDTIcon';
import { YFIIcon } from 'icons/YFIIcon';

import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
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
}))

interface AssetDisplay {
    setAsset: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function AssetDisplay({setAsset}: AssetDisplay){
    const classes = useStyles();

    const handleAssetSelect = (asset: string) => {
        setAsset(asset);
      };


return (
    <div className={classes.assetBox}>
        <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('DAI')}
      >
        <span className={classes.btnSpan}>
          <DAIIcon height={25} width={22} className={classes.icon} />
          DAI
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('USDC')}
      >
        <span className={classes.btnSpan}>
          <USDCIcon width={25} height={22} className={classes.icon} />
          USDC
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('YFI')}
      >
        <span className={classes.btnSpan}>
          <YFIIcon width={25} height={22} className={classes.icon} />
          YFI
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('Sushi')}
      >
        <span className={classes.btnSpan}>
          <SushiIcon width={25} height={25} className={classes.icon} />
          Sushi
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('alUSD')}
      >
        <span className={classes.btnSpan}>
          <AlusdIcon height={25} width={22} className={classes.icon} />
          alUSD
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('USDT')}
      >
        <span className={classes.btnSpan}>
          <USDTIcon height={25} width={25} className={classes.icon} />
          USDT
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('ETH')}
      >
        <span className={classes.btnSpan}>
          <EthIcon height={32} width={32} className={classes.icon} />
          ETH
        </span>
        </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('other')}
      >
        <span className={classes.btnSpan}>Other</span>
        </button>
    </div>
)
}