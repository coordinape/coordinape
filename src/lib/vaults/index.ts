import { utils } from 'ethers';

export const encodeCircleId = (circleId: number) => {
  return utils.formatBytes32String(circleId.toString());
};

export const decodeCircleId = (value: string) => {
  return Number(utils.parseBytes32String(value));
};
