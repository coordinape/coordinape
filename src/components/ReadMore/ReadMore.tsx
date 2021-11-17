import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core';

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
  const [isHidden, setIsHidden] = useState(_isHidden);

  return (
    <div>
      <div className={isHidden ? textHidden : undefined}>{props.children}</div>
      {_isHidden && (
        <button className={linkButton} onClick={() => setIsHidden(!isHidden)}>
          {!isHidden ? 'see less' : 'see more'}
        </button>
      )}
    </div>
  );
};
