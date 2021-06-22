import React from 'react';

import Transparent from 'assets/transparent.gif';

interface IProps {
  w?: number;
  h?: number;
}

export const Spacer = ({ w = 1, h = 1 }: IProps) => (
  <img src={Transparent} width={w} height={h} alt="" role="presentation" />
);
