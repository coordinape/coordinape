import React from 'react';

import { makeStyles, Box, ButtonGroup, Button } from '@material-ui/core';

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
  custom?: string;
}

const tokens = {
  DAI: <DAIIcon height={25} width={22} />,
  USDC: <USDCIcon width={25} height={22} />,
  YFI: <YFIIcon width={25} height={22} />,
  SUSHI: <SushiIcon width={25} height={25} />,
  ALUSD: <AlusdIcon height={25} width={22} />,
  USDT: <USDTIcon height={25} width={25} />,
  ETH: <EthIcon height={32} width={32} />,
  OTHER: <></>,
} as { [K in TAssetEnum]: JSX.Element };

export const FormAssetSelector = ({
  value: { name, custom },
  onChange,
  label,
  subLabel,
  infoTooltip,
  errorText,
  error,
}: {
  value: IFormToken;
  onChange: (newValue: IFormToken) => void;
  label: string;
  subLabel: string;
  infoTooltip?: React.ReactNode;
  errorText?: string;
  error?: boolean;
}) => {
  const classes = useStyles();

  return (
    <div>
      <span>
        {label}
        <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>
      </span>
      <span>{subLabel}</span>
      <ButtonGroup
        id="buttontoken"
        variant="contained"
        color="default"
        className={classes.grouped}
      >
        {Object.entries(tokens).map(([key, Icon]) => (
          <Button
            key={key}
            className={classes.assetBtn}
            data-selected={name === key}
            onClick={() => onChange({ name: key as TAssetEnum })}
          >
            <span className={classes.btnSpan}>
              {Icon}
              {key}
            </span>
          </Button>
        ))}
      </ButtonGroup>

      <Box mt={3} mb={3}>
        <ApeTextField
          label="...or use a custom asset"
          className={name !== 'OTHER' ? classes.faded : undefined}
          error={error}
          disabled={name !== 'OTHER'}
          value={name === 'OTHER' ? custom : ''}
          placeholder="0x0000..."
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
    '& svg': {
      marginRight: '0.3em',
    },
  },
  grouped: {
    minWidth: 102,
    borderRadius: 8,
    fontWeight: 300,
    flexWrap: 'wrap',
    flexDirection: 'row',
    boxShadow: 'none',
  },
  redColor: {
    color: theme.colors.red,
  },
  faded: {
    opacity: 0.4,
  },
}));
