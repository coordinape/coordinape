import React, { useState } from 'react';

import { ethers } from 'ethers';

import { Button, Modal, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useValSelectedCircle } from 'recoilState';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing(2.5, 6),
    width: 648,
    height: 570,
    borderRadius: theme.spacing(1),
    outline: 'none',
    background: theme.colors.white,
    position: 'relative',
  },
  closeButton: {
    color: theme.colors.mediumGray,
    top: 0,
    right: 0,
    position: 'absolute',
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: 0,
    fontSize: 30,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: theme.spacing(1),
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subContent: {
    margin: theme.spacing(4, 0),
    display: 'flex',
    justifyContent: 'space-between',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    width: '47%',
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
    background: theme.colors.lightBackground,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  textarea: {
    padding: theme.spacing(1.5),
    height: 97,
    resize: 'none',
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    background: theme.colors.lightBackground,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  nominateButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(6),
    padding: theme.spacing(0.7, 3),
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
}));

export const NewNominateModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const circle = useValSelectedCircle();
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const nominateDescription = circle
    ? `The ${circle.name} Circle requires ${
        circle.min_vouches
      } people total to vouch for a new member and nominations are live for ${
        circle.nomination_days_limit
      } ${(circle.nomination_days_limit || 0) > 1 ? 'days' : 'day'}. ${
        (circle.min_vouches || 0) > 2
          ? `If a nomination does not receive ${
              circle.min_vouches - 1
            } additional ${
              circle.min_vouches > 3 ? 'vouches' : 'vouch'
            } in that period, the nomination fails.`
          : ''
      }`
    : '';
  const nominateDirty =
    name.length == 0 ||
    description.length == 0 ||
    !ethers.utils.isAddress(address);

  // onChange Name
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // onChange Address
  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // onChange Description
  const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // onClick NewNominate
  const onClickNewNominate = async () => {};

  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <div className={classes.content}>
        <IconButton
          className={classes.closeButton}
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <p className={classes.title}>Nominate New Member</p>
        <p className={classes.description}>{nominateDescription}</p>
        <div className={classes.subContent}>
          <div className={classes.container}>
            <p className={classes.subTitle}>Name</p>
            <input
              className={classes.input}
              onChange={onChangeName}
              value={name}
            />
          </div>
          <div className={classes.container}>
            <p className={classes.subTitle}>ETH Address</p>
            <input
              className={classes.input}
              onChange={onChangeAddress}
              value={address}
            />
          </div>
        </div>
        <div className={classes.bottomContainer}>
          <p className={classes.subTitle}>
            Why are you nominating this person?
          </p>
          <textarea
            className={classes.textarea}
            maxLength={280}
            placeholder="Tell us why the person should be added to the circle, such as what they have achieved or what they will do in the future, I need some better helper text here please feel free to edit."
            onChange={onChangeDescription}
            value={description}
          />
        </div>
        <Button
          className={classes.nominateButton}
          disabled={nominateDirty}
          onClick={onClickNewNominate}
        >
          Nominate Member
        </Button>
      </div>
    </Modal>
  );
};

export default NewNominateModal;
