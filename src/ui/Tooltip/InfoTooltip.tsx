import React from 'react';

import { Info } from '../../icons/__generated';

import { Tooltip } from './Tooltip';

export const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
  <Tooltip css={{ ml: '$xs' }} content={children}>
    <Info size="sm" />
  </Tooltip>
);
