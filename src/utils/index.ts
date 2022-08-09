export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export const numberWithCommas = (x: number | string | undefined) => {
  if (!x) return '0';
  const [beforeDot, afterDot] = x.toString().split('.');
  return (
    beforeDot.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (afterDot ? '.' + afterDot : '')
  );
};
