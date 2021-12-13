import { Button, Modal, makeStyles } from '@material-ui/core';

import { useApiBase } from 'hooks';
import { useCircles, useEpochsStatus } from 'recoilState/app';

import { ICircle } from 'types';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(15, 10),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 4),
    },
  },
  content: {
    outline: 'none',
    maxHeight: '90vh',
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(5, 5, 0),
    userSelect: `none`,
    display: 'flex',
    flexDirection: 'column',
  },
  circleContainer: {
    marginTop: theme.spacing(1),
    paddingBottom: theme.spacing(10),
    width: '100%',
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    overflowY: 'auto',
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
    borderWidth: '0 0 1px 0',
    borderColor: theme.colors.border,
  },
  divider: {
    width: '100%',
    margin: theme.spacing(4, 0, 2),
    textAlign: 'center',
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

const CircleButton = ({
  circle,
  onClick,
}: {
  circle: ICircle;
  onClick: () => void;
}) => {
  const classes = useStyles();
  const { timingMessage } = useEpochsStatus(circle.id);

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
  const { selectAndFetchCircle } = useApiBase();
  const { myCircles, viewOnlyCircles } = useCircles();

  return (
    <Modal className={classes.modal} open={visible} onClose={onClose}>
      <div className={classes.content}>
        <div className={classes.header}>
          {myCircles.length > 0 ? (
            <>
              <span className={classes.title}>Welcome back!</span>
            </>
          ) : (
            <span className={classes.title}>
              Sorry, you have no authorized Circles
            </span>
          )}
        </div>
        <div className={classes.circleContainer}>
          <div className={classes.divider}>
            <span className={classes.circleLabel}>Select a Circle</span>
          </div>
          {myCircles?.map(circle => (
            <CircleButton
              key={circle.id}
              circle={circle}
              onClick={() =>
                selectAndFetchCircle(circle.id)
                  .then(onClose)
                  .catch(console.warn)
              }
            />
          ))}
          {viewOnlyCircles.length && (
            <>
              <div className={classes.divider}>
                <span className={classes.circleLabel}>Admin View</span>
              </div>
              {viewOnlyCircles.map(circle => (
                <CircleButton
                  key={circle.id}
                  circle={circle}
                  onClick={() =>
                    selectAndFetchCircle(circle.id)
                      .then(onClose)
                      .catch(console.warn)
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
