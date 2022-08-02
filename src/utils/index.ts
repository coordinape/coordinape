export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export const numberWithCommas = (x: number | string | undefined) => {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
};
