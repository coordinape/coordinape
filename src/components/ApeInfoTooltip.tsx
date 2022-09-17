import { ReactNode, useState } from 'react';

import clsx from 'clsx';

import { makeStyles, Tooltip, Zoom, TooltipProps } from '@material-ui/core';

import { ActionDialog } from 'components/index';
import useMobileDetect from 'hooks/useMobileDetect';
import { Info } from 'icons/__generated';
import { Link } from 'ui';

const useStyles = makeStyles(theme => ({
  tooltip: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 300,
    maxWidth: 240,
    padding: theme.spacing(1),
    margin: theme.spacing(0, 2),
    borderRadius: 8,
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
  },
  icon: {
    fontSize: 'inherit',
    verticalAlign: 'baseline',
    color: theme.colors.secondaryText,
    '&:hover': {
      color: theme.colors.text,
    },
  },
}));

export const ApeInfoTooltip = ({
  children,
  classes,
  className,
  ...props
}: { children: ReactNode; component?: ReactNode } & Omit<
  TooltipProps,
  'title' | 'children'
>) => {
  const localClasses = useStyles();
  const [openTooltip, setOpenTooltip] = useState(false);
  const { isMobile } = useMobileDetect();

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  return (
    <>
      {isMobile ? (
        <div>
          <Link
            css={{ display: 'inline-flex', alignItems: 'center' }}
            color="neutral"
            onClick={handleTooltipOpen}
          >
            <Info size="sm" />
          </Link>
          <ActionDialog open={openTooltip} onClose={handleTooltipClose}>
            {children}
          </ActionDialog>
        </div>
      ) : (
        <Tooltip
          title={<div>{children ?? 'blank'}</div>}
          placement="top-start"
          TransitionComponent={Zoom}
          leaveDelay={props.leaveDelay ?? 50} // Allows clickable links as content, transition-out animation prevents clicking without a slight delay
          classes={{
            ...classes,
            tooltip: clsx(localClasses.tooltip, classes?.tooltip),
          }}
          interactive
          {...props}
        >
          {props.component ? (
            <span>{props.component}</span>
          ) : (
            <Link
              css={{ display: 'inline-flex', alignItems: 'center' }}
              color="neutral"
              className={className}
            >
              <Info size="sm" />
            </Link>
          )}
        </Tooltip>
      )}
    </>
  );
};
