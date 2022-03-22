import React, { FunctionComponent } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { makeStyles, Popover } from '@material-ui/core';

import { WALLET_ICONS } from 'config/constants';
import { useApiBase } from 'hooks';
import { useWalletAuth } from 'recoilState/app';
import { useSetWalletModalOpen } from 'recoilState/ui';
import { Box, Button } from 'ui';
import { shortenAddress } from 'utils';

const useStyles = makeStyles(theme => ({
  popover: {
    marginTop: theme.spacing(1),
    borderRadius: 8,
    boxShadow: 'none',
  },
}));

export const WalletButton = () => {
  const web3Context = useWeb3React<Web3Provider>();

  const { updateAuth, logout } = useApiBase();
  const setWalletModalOpen = useSetWalletModalOpen();
  const { address, connectorName, authTokens } = useWalletAuth();
  const haveAuthToken =
    !!address && web3Context.account === address && address in authTokens;

  const disconnect = () => {
    web3Context.deactivate();
    logout();
  };

  const connectedAddress = web3Context.account;
  if (!connectedAddress) {
    return (
      <Button
        color="oldGray"
        size="small"
        onClick={() => setWalletModalOpen(true)}
      >
        Connect your wallet
      </Button>
    );
  }

  const Icon = connectorName ? WALLET_ICONS?.[connectorName] : undefined;

  return (
    <ConnectedButton
      Icon={Icon}
      disconnect={disconnect}
      address={connectedAddress}
      onLogin={
        !haveAuthToken
          ? () =>
              updateAuth({
                address: connectedAddress,
                web3Context: web3Context,
              })
          : undefined
      }
    />
  );
};

const ConnectedButton = ({
  Icon,
  disconnect,
  address,
  onLogin,
}: {
  Icon?: FunctionComponent;
  disconnect: () => void;
  address: string;
  onLogin?: () => void;
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<
    HTMLButtonElement | undefined
  >();

  return (
    <>
      <Button
        color="oldGray"
        size="small"
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        {Icon && (
          <Box css={{ mr: '$sm', display: 'flex' }}>
            <Icon />
          </Box>
        )}
        {shortenAddress(address)}
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.popover,
        }}
        onClose={() => setAnchorEl(undefined)}
        open={!!anchorEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {onLogin && (
          <Button color="oldGray" size="small" onClick={onLogin}>
            Login
          </Button>
        )}
        <Button
          color="oldGray"
          size="small"
          onClick={() => {
            disconnect();
            setAnchorEl(undefined);
          }}
        >
          Disconnect
        </Button>
      </Popover>
    </>
  );
};
