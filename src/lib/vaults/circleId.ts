import { utils } from 'ethers';

const PREFIX = 'circle';
const VERSION = '1';
const DELIMITER = '-';

export const encodeCircleId = (circleId: number) => {
  const label = `${PREFIX}${DELIMITER}${VERSION}${DELIMITER}${circleId}`;
  return utils.formatBytes32String(label);
};

export const decodeCircleId = (value: string) => {
  const label = utils.parseBytes32String(value);

  // version is not used yet
  const [prefix, , id] = label.split(DELIMITER);

  if (prefix !== PREFIX) {
    throw new Error('Could not decode circle ID');
  }

  return Number(id);
};
