import React, { useState } from 'react';

import { Button, Hidden, Modal, makeStyles } from '@material-ui/core';

import { ReactComponent as SaveAdminSVG } from 'assets/svgs/button/save-admin.svg';
import { useUserInfo } from 'hooks';

import { ICircle } from 'types';

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
    display: 'flex',
    justifyContent: 'space-between',
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
    background: theme.colors.background,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  textarea: {
    padding: theme.spacing(1, 1.5),
    height: 97,
    resize: 'none',
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    background: theme.colors.background,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  saveButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(6),
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

export const EditCircleModal = ({
  circle,
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
  circle: ICircle;
}) => {
  const classes = useStyles();
  const { updateCircle } = useUserInfo();
  const [circleName, setCircleName] = useState<string>(circle.name);
  const [tokenName, setTokenName] = useState<string>(circle.token_name);
  const [teamSelText, setTeamSelText] = useState<string>(circle.team_sel_text);
  const [allocText, setAllocText] = useState<string>(circle.alloc_text);

  // onChange CircleName
  const onChangeCircleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCircleName(e.target.value);
  };

  // onChange TokenName
  const onChangeTokenName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(e.target.value);
  };

  // onChange TeamSelText
  const onChangeTeamSelText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTeamSelText(e.target.value);
  };

  // onChange AllocText
  const onChangeAllocText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAllocText(e.target.value);
  };

  // onClick SaveCircle
  const onClickSaveCircle = async () =>
    updateCircle({
      name: circleName,
      token_name: tokenName,
      team_sel_text: teamSelText,
      alloc_text: allocText,
    });

  const circleDirty =
    circleName !== circle.name ||
    tokenName !== circle.token_name ||
    teamSelText !== circle.team_sel_text ||
    allocText !== circle.alloc_text;

  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <div className={classes.content}>
        <p className={classes.title}>Edit Circle Settings</p>
        <div className={classes.subContent}>
          <div className={classes.container}>
            <p className={classes.subTitle}>Circle name</p>
            <input
              className={classes.input}
              onChange={onChangeCircleName}
              value={circleName}
            />
          </div>
          <div className={classes.container}>
            <p className={classes.subTitle}>Token name</p>
            <input
              className={classes.input}
              onChange={onChangeTokenName}
              value={tokenName}
            />
          </div>
        </div>
        <div className={classes.subContent}>
          <div className={classes.container}>
            <p className={classes.subTitle}>Teammate selection page text</p>
            <textarea
              className={classes.textarea}
              maxLength={280}
              onChange={onChangeTeamSelText}
              value={teamSelText}
            />
          </div>
          <div className={classes.container}>
            <p className={classes.subTitle}>Allocation page text</p>
            <textarea
              className={classes.textarea}
              maxLength={280}
              onChange={onChangeAllocText}
              value={allocText}
            />
          </div>
        </div>
        <Button
          className={classes.saveButton}
          disabled={!circleDirty}
          onClick={onClickSaveCircle}
        >
          <Hidden smDown>
            <div className={classes.saveAdminIconWrapper}>
              <SaveAdminSVG />
            </div>
          </Hidden>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default EditCircleModal;
