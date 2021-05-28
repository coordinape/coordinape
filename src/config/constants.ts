import { ReactComponent as CoinbaseSVG } from 'assets/svgs/wallet/coinbase.svg';
import { ReactComponent as FormaticSVG } from 'assets/svgs/wallet/fortmatic.svg';
import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { ReactComponent as PortisSVG } from 'assets/svgs/wallet/portis.svg';
import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';
import { ConnectorNames } from 'utils/enums';

export const STORAGE_KEY_CONNECTOR = 'CONNECTOR';
export const LOGGER_ID = 'flama';

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const TOKEN_PRICE_DECIMALS = 18;
export const WEIGHT_DECIMALS = 18;

export const MAX_GIVE_TOKENS = 100;
export const MAX_NAME_LENGTH = 20;
export const MAX_BIO_LENGTH = 140;

export const WALLET_ICONS: { [key in ConnectorNames]: React.ElementType } = {
  [ConnectorNames.Injected]: MetaMaskSVG,
  [ConnectorNames.WalletConnect]: WalletConnectSVG,
  [ConnectorNames.WalletLink]: CoinbaseSVG,
  [ConnectorNames.Fortmatic]: FormaticSVG,
  [ConnectorNames.Portis]: PortisSVG,
};

export const AUTO_OPEN_WALLET_DIALOG_PARAMS = '?open-wallet';
export const EXTERNAL_URL_TYPEFORM =
  'https://yearnfinance.typeform.com/to/egGYEbrC';
export const EXTERNAL_URL_DOCS = 'https://docs.coordinape.com';
export const EXTERNAL_URL_LANDING_PAGE = 'https://coordinape.com';
export const EXTERNAL_URL_DOCS_REGIFT = `${EXTERNAL_URL_DOCS}/welcome/new-feature-regift`;
export const EXTERNAL_URL_TWITTER = 'https://twitter.com/coordinape';
export const EXTERNAL_URL_MEDIUM_ARTICLE =
  'https://medium.com/iearn/decentralized-payroll-management-for-daos-b2252160c543';
