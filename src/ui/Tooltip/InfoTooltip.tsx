import React from 'react';

import { Info } from '../../icons/__generated';

import { Tooltip } from './Tooltip';

export const InfoTooltip = ({
  children,
  size = 'sm',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md';
}) => (
  <Tooltip css={{ ml: '$xs' }} content={children}>
    <Info size={size} />
  </Tooltip>
);
