import React, { useEffect, FunctionComponent } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { Button, Hidden, makeStyles, Popover } from '@material-ui/core';

import { WALLET_ICONS } from 'config/constants';
import { useApiBase } from 'hooks';
import { useWalletAuth, useMyAddressLoadable } from 'recoilState/app';
import { useSetWalletModalOpen } from 'recoilState/ui';
import { getApiService } from 'services/api';
import { shortenAddress } from 'utils';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2),
  },
  popover: {
    marginTop: theme.spacing(1),
    borderRadius: 8,
    boxShadow: 'none',
  },
}));

export const WalletButton = () => {
  const classes = useStyles();

  const web3Context = useWeb3React<Web3Provider>();

  const { fetchManifest, updateAuth, logout, navigateDefault } = useApiBase();
  const setWalletModalOpen = useSetWalletModalOpen();
  const myAddressLoadable = useMyAddressLoadable();
  const { address, connectorName, authTokens } = useWalletAuth();
  const haveAuthToken =
    !!address && web3Context.account === address && address in authTokens;

  useEffect(() => {
    if (myAddressLoadable.state === 'hasValue' && myAddressLoadable.contents) {
      fetchManifest().then(navigateDefault);
    }
  }, [myAddressLoadable]);

  useEffect(() => {
    getApiService().setProvider(web3Context.library);

    if (address && web3Context.account && web3Context.account !== address) {
      updateAuth({
        address: web3Context.account,
        web3Context: web3Context,
      });
    }
  }, [web3Context, address]);

  const disconnect = () => {
    web3Context.deactivate();
    logout();
  };

  const connectedAddress = web3Context.account;
  if (!connectedAddress) {
    return (
      <Button
        variant="outlined"
        color="default"
        size="small"
        onClick={() => setWalletModalOpen(true)}
      >
        Connect your wallet
      </Button>
    );
  }

  const Icon = connectorName ? WALLET_ICONS?.[connectorName] : undefined;

  if (!haveAuthToken) {
    return (
      <>
        <Button
          variant="outlined"
          color="default"
          size="small"
          onClick={() =>
            updateAuth({
              address: connectedAddress,
              web3Context: web3Context,
            })
          }
          className={classes.button}
        >
          Login to Coordinape
        </Button>

        <ConnectedButton
          Icon={Icon}
          disconnect={disconnect}
          address={connectedAddress}
        />
      </>
    );
  }

  return (
    <ConnectedButton Icon={Icon} disconnect={disconnect} address={address} />
  );
};

const ConnectedButton = ({
  Icon,
  disconnect,
  address,
}: {
  Icon?: FunctionComponent;
  disconnect: () => void;
  address: string;
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<
    HTMLButtonElement | undefined
  >();

  return (
    <>
      <Button
        variant="outlined"
        color="default"
        size="small"
        startIcon={
          Icon ? (
            <Hidden smDown>
              <Icon />
            </Hidden>
          ) : undefined
        }
        onClick={event => setAnchorEl(event.currentTarget)}
      >
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
        <Button
          variant="contained"
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
