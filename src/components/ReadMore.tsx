import React from 'react';

import { makeStyles } from '@material-ui/core';

import { ApeInfoTooltip } from 'components/ApeInfoTooltip';

interface ReadMoreProps {
  /** this property decide to hide the text and show the options see more or see less*/
  isHidden?: boolean;
  /** this property is set for the string content*/
  children?: React.ReactNode;
}

const useStyles = makeStyles(() => ({
  textHidden: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    display: 'inline',
    margin: 0,
    padding: 0,
  },
}));
export const ReadMore: React.FC<ReadMoreProps> = (
  props: ReadMoreProps
): JSX.Element => {
  const { textHidden, linkButton } = useStyles();
  const _isHidden = props.isHidden ?? true;

  return (
    <span>
      <div className={_isHidden ? textHidden : undefined}>{props.children}</div>
      {_isHidden && (
        <ApeInfoTooltip
          component={<button className={linkButton}>See more</button>}
        >
          {props.children}
        </ApeInfoTooltip>
      )}
    </span>
  );
};
