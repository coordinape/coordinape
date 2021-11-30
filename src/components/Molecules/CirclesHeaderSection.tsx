import React, { useMemo } from 'react';

import { groupBy, toPairs } from 'lodash';

import { makeStyles, Theme } from '@material-ui/core';

import { CircleButton } from 'components';
import { useMe, useCircle } from 'hooks';

const useStyles = makeStyles<Theme>(theme => ({
  subSubHeader: {
    fontStyle: 'italic',
    margin: theme.spacing(0.7, 0, 0, 5),
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 300,
    [theme.breakpoints.down('xs')]: {
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '30px',
      color: theme.colors.text,
      margin: 0,
    },
  },
}));

export const CirclesHeaderSection = (props: {
  variant?: string;
  handleOnClick?(): void;
}) => {
  const classes = useStyles();
  const { myCircles } = useMe();
  const { selectAndFetchCircle, selectedCircle } = useCircle();

  const groupedCircles = useMemo(
    () => toPairs(groupBy(myCircles, c => c.protocol.name)),
    [myCircles]
  );

  return (
    <>
      {groupedCircles.map(([protocolName, circles], idx) => (
        <React.Fragment key={idx}>
          <span className={classes.subSubHeader}>{protocolName}</span>
          {circles.map(circle => (
            <CircleButton
              key={circle.id}
              circle={circle}
              selected={selectedCircle?.id === circle.id}
              onClick={() => {
                if (props.handleOnClick) {
                  props.handleOnClick();
                }
                selectedCircle?.id !== circle.id &&
                  selectAndFetchCircle(circle.id);
              }}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};
