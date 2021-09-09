import React, { Suspense } from 'react';

import { makeStyles, Modal } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    color: '#00000080',
  },
}));

export const OverlaySuspense = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const classes = useStyles();

  return (
    <Suspense
      fallback={
        <Modal className={classes.modal} open>
          <div>Suspended while loading...</div>
        </Modal>
      }
    >
      {children}
    </Suspense>
  );
};

export default OverlaySuspense;
