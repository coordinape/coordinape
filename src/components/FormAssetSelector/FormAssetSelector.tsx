import React from 'react';

import { makeStyles, Box, Button } from '@material-ui/core';

import { ApeInfoTooltip, ApeTextField } from 'components';
import { TAssetEnum } from 'config/networks';
import {
  AlusdIcon,
  DAIIcon,
  EthIcon,
  SushiIcon,
  USDCIcon,
  USDTIcon,
  YFIIcon,
} from 'icons';

export interface IFormToken {
  name: TAssetEnum;
  custom: string;
}

const tokens = {
  DAI: <DAIIcon height={25} width={22} />,
  USDC: <USDCIcon width={25} height={22} />,
  YFI: <YFIIcon width={25} height={22} />,
  SUSHI: <SushiIcon width={25} height={25} />,
  ALUSD: <AlusdIcon height={25} width={22} />,
  USDT: <USDTIcon height={25} width={25} />,
  WETH: <EthIcon height={32} width={32} />, // Todo: replace with WETH icon
  OTHER: <></>,
} as { [K in TAssetEnum]: JSX.Element };

export const FormAssetSelector = ({
  value: { name, custom },
  onChange,
  onBlur,
  label,
  subLabel,
  infoTooltip,
  errorText,
  error,
}: {
  value: IFormToken;
  onChange: (newValue: IFormToken) => void;
  onBlur: () => void;
  label: string;
  subLabel: string;
  infoTooltip?: React.ReactNode;
  errorText?: string;
  error?: boolean;
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        {label}
        <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>
      </div>
      <div className={classes.subLabel}>{subLabel}</div>
      <div className={classes.grouped}>
        {Object.entries(tokens).map(([key, Icon]) => (
          <Button
            key={key}
            color="secondary"
            className={classes.assetBtn}
            data-selected={name === key}
            onClick={() => onChange({ name: key as TAssetEnum, custom: '' })}
          >
            <span className={classes.btnSpan}>
              {Icon}
              {key}
            </span>
          </Button>
        ))}
      </div>

      <Box mt={3} mb={3}>
        <ApeTextField
          label="...or use a custom asset"
          className={name !== 'OTHER' ? classes.faded : undefined}
          error={error}
          disabled={name !== 'OTHER'}
          value={name === 'OTHER' ? custom : ''}
          placeholder="0x0000..."
          onBlur={onBlur}
          onChange={({ target: { value: custom } }) =>
            onChange({ name: 'OTHER', custom })
          }
        />
      </Box>

      {!!errorText && <div className={classes.redColor}>{errorText}</div>}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.5,
  },
  subLabel: {
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),
  },
  grouped: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 300,
    boxShadow: 'none',
  },
  assetBtn: {
    height: '37px',
    margin: theme.spacing(1, 0.5),
    fontSize: 15,
    fontWeight: 400,
    padding: theme.spacing(0.6, 1.5),
    borderRadius: 20,
    color: theme.colors.text,
    backgroundColor: theme.colors.ultraLightGray,
    '&[data-selected=true]': {
      color: theme.colors.white,
      backgroundColor: `${theme.colors.text}80`,
    },
    '&:hover': {
      backgroundColor: `${theme.colors.text}80`,
      color: theme.colors.white,
    },
  },
  btnSpan: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      margin: theme.spacing(0, 0.3, 0, -1),
    },
  },

  redColor: {
    color: theme.colors.red,
  },
  faded: {
    opacity: 0.4,
  },
}));
