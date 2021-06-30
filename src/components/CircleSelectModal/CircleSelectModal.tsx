import React from 'react';

import { useRecoilValue } from 'recoil';

import { Button, Modal, makeStyles } from '@material-ui/core';

import { useCircle, useCircleEpoch } from 'hooks';
import { rMyCircles } from 'recoilState';

import { ICircle } from 'types';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    outline: 'none',
    backgroundColor: theme.colors.white,
    minWidth: 700,
    maxWidth: 800,
    maxHeight: '80vh',
    borderRadius: theme.spacing(1),
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    userSelect: `none`,
    [theme.breakpoints.down('sm')]: {
      minWidth: 350,
      maxWidth: 350,
    },
  },
  header: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: 700,
  },
  circleLabel: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.border,
    border: 'solid',
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: theme.colors.border,
  },
  circleContainer: {
    marginTop: theme.spacing(1),
    paddingBottom: theme.spacing(10),
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  circle: {
    margin: theme.spacing(2),
    width: 150,
    height: 150,
    borderRadius: 75,
    background: theme.colors.background,
  },
  circleContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  circleTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.2,
    color: theme.colors.secondary,
  },
  circleDescription: {
    fontSize: 9,
    fontWeight: 400,
    textAlign: 'center',
    color: theme.colors.text,
  },
  indicator: { color: theme.colors.primary },
}));

export const CircleButton = ({
  circle,
  onClick,
}: {
  circle: ICircle;
  onClick: () => void;
}) => {
  const classes = useStyles();
  const { timingMessage } = useCircleEpoch(circle.id);

  return (
    <Button className={classes.circle} key={circle.id} onClick={onClick}>
      <div className={classes.circleContent}>
        <span className={classes.circleTitle}>
          {circle.protocol.name} / {circle.name}
        </span>
        <span className={classes.circleDescription}>{timingMessage}</span>
      </div>
    </Button>
  );
};

export const CircleSelectModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { selectCircle } = useCircle();

  const myCircles = useRecoilValue(rMyCircles);

  return (
    <Modal className={classes.modal} open={visible} onClose={onClose}>
      <div className={classes.content}>
        {myCircles.length > 0 ? (
          <>
            <div className={classes.header}>
              <span className={classes.title}>Welcome back!</span>
              <span className={classes.circleLabel}>Select a Circle</span>
            </div>
            <div className={classes.circleContainer}>
              {myCircles?.map((circle) => (
                <CircleButton
                  key={circle.id}
                  circle={circle}
                  onClick={() => {
                    selectCircle(circle.id);
                    onClose();
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={classes.header}>
            <span className={classes.title}>
              Sorry, you have no authorized Circles
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
