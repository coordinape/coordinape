import React, { useState } from 'react';

import { makeStyles, ClickAwayListener } from '@material-ui/core';

import { ApeInfoTooltip } from 'components/ApeInfoTooltip/ApeInfoTooltip';
import useMobileDetect from 'hooks/useMobileDetect';
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
  const [openTooltip, setOpenTooltip] = useState(false);
  const { isMobile } = useMobileDetect();

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  return (
    <span>
      <div className={_isHidden ? textHidden : undefined}>{props.children}</div>
      {_isHidden && (
        <>
          {isMobile ? (
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <ApeInfoTooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={handleTooltipClose}
                  open={openTooltip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  component={
                    <button onClick={handleTooltipOpen} className={linkButton}>
                      See more
                    </button>
                  }
                  placement="top"
                >
                  {props.children}
                </ApeInfoTooltip>
              </div>
            </ClickAwayListener>
          ) : (
            <ApeInfoTooltip
              component={<button className={linkButton}>See more</button>}
            >
              {props.children}
            </ApeInfoTooltip>
          )}
        </>
      )}
    </span>
  );
};
