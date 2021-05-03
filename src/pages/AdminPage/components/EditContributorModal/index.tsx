import {
  Button,
  Hidden,
  MenuItem,
  Modal,
  Select,
  makeStyles,
} from '@material-ui/core';
import { ReactComponent as SaveAdminSVG } from 'assets/svgs/button/save-admin.svg';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { getApiService } from 'services/api';
import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing(2.5, 6),
    width: 648,
    height: 490,
    borderRadius: theme.spacing(1),
    outline: 'none',
    background: theme.colors.white,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subContent: {
    margin: theme.spacing(1, 5),
    display: 'flex',
    flexDirection: 'column',
  },
  subContainer: {
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    justifyContent: 'space-between',
  },
  topContainer: {
    width: '45%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  input: {
    padding: theme.spacing(1.5),
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    background: theme.colors.background,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  selectRoot: {
    padding: theme.spacing(0.8),
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    background: theme.colors.background,
    borderRadius: theme.spacing(1),
  },
  select: {
    paddingLeft: theme.spacing(10),
  },
  selectIcon: {
    marginRight: theme.spacing(10),
    fill: theme.colors.text,
  },
  menuItem: {
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
  },
  menuItemSelected: {
    background: `${theme.colors.third} !important`,
  },
  saveButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(10),
    padding: theme.spacing(1.5, 3),
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.colors.red,
    borderRadius: theme.spacing(1),
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      background: theme.colors.red,
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
    '&:disabled': {
      color: theme.colors.lightRed,
      background: theme.colors.mediumRed,
    },
  },
  saveAdminIconWrapper: {
    width: theme.spacing(1.25),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  user?: IUser;
}

export const EditContributorModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, user, visible } = props;
  const { library } = useConnectedWeb3Context();
  const { addUser, circle, me } = useUserInfo();
  const [contributorName, setContributorName] = useState<string>(
    user?.name || ''
  );
  const [contributorNonGive, setContributorNonGive] = useState<number>(
    user?.non_giver || 0
  );
  const [contributorAddress, setContributorAddress] = useState<string>(
    user?.address || ''
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  // onChange ContributorName
  const onChangeContributorName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContributorName(e.target.value);
  };

  // onChange ContributorAddress
  const onChangeContributorAddress = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContributorAddress(e.target.value);
  };

  // onClick SaveContributor
  const onClickSaveContributor = async () => {
    if (me?.address) {
      setLoading(true);
      try {
        const newUser = await (user
          ? getApiService().updateUsers(
              me.address,
              contributorName,
              user.address,
              contributorAddress,
              contributorNonGive,
              library
            )
          : getApiService().postUsers(
              me.address,
              contributorName,
              contributorAddress,
              contributorNonGive,
              library
            ));
        addUser(newUser);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Something went wrong!',
          { variant: 'error' }
        );
      }
      setLoading(false);
    }
  };

  // Return
  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <div className={classes.content}>
        <p className={classes.title}>{user ? 'Edit' : 'Add'} Contributor</p>
        <div className={classes.subContent}>
          <div className={classes.subContainer}>
            <div className={classes.topContainer}>
              <p className={classes.subTitle}>Contributor Name</p>
              <input
                className={classes.input}
                onChange={onChangeContributorName}
                value={contributorName}
              />
            </div>
            <div className={classes.topContainer}>
              <p className={classes.subTitle}>
                Can They {circle?.token_name || 'GIVE'}?
              </p>
              <Select
                className={classes.selectRoot}
                classes={{
                  select: classes.select,
                  icon: classes.selectIcon,
                }}
                disableUnderline
                onChange={({ target: { value } }) =>
                  setContributorNonGive(value as number)
                }
                value={contributorNonGive}
              >
                {[0, 1].map((value) => (
                  <MenuItem
                    className={classes.menuItem}
                    classes={{ selected: classes.menuItemSelected }}
                    key={value}
                    value={value}
                  >
                    {value === 0 ? 'Yes' : 'No'}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className={classes.bottomContainer}>
            <p className={classes.subTitle}>Contributor ETH address</p>
            <input
              className={classes.input}
              onChange={onChangeContributorAddress}
              value={contributorAddress}
            />
          </div>
        </div>
        <Button
          className={classes.saveButton}
          disabled={
            contributorName.length === 0 ||
            contributorAddress.length === 0 ||
            !ethers.utils.isAddress(contributorAddress)
          }
          onClick={onClickSaveContributor}
        >
          <Hidden smDown>
            <div className={classes.saveAdminIconWrapper}>
              <SaveAdminSVG />
            </div>
          </Hidden>
          Save
        </Button>
        {isLoading && (
          <LoadingModal onClose={() => {}} text="" visible={isLoading} />
        )}
      </div>
    </Modal>
  );
};
