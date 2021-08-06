import { ReactComponent as CoinbaseSVG } from 'assets/svgs/wallet/coinbase.svg';
import { ReactComponent as FormaticSVG } from 'assets/svgs/wallet/fortmatic.svg';
import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { ReactComponent as PortisSVG } from 'assets/svgs/wallet/portis.svg';
import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';
import { ConnectorNames } from 'utils/enums';

export const LOGGER_ID = 'flama';

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const TOKEN_PRICE_DECIMALS = 18;
export const WEIGHT_DECIMALS = 18;

export const MAX_NAME_LENGTH = 20;
export const MAX_BIO_LENGTH = 560;

export const WALLET_ICONS: { [key in ConnectorNames]: React.ElementType } = {
  [ConnectorNames.Injected]: MetaMaskSVG,
  [ConnectorNames.WalletConnect]: WalletConnectSVG,
  [ConnectorNames.WalletLink]: CoinbaseSVG,
  [ConnectorNames.Fortmatic]: FormaticSVG,
  [ConnectorNames.Portis]: PortisSVG,
};

export const SKILLS = [
  { id: 0, name: 'Community Mgmt' },
  { id: 1, name: 'Discord' },
  { id: 2, name: 'Social Media' },
  { id: 3, name: 'Governance' },
  { id: 4, name: 'Budget Mgmt' },
  { id: 5, name: 'Compensation' },
  { id: 6, name: 'Grants' },
  { id: 7, name: 'Solidity' },
  { id: 8, name: 'Web3' },
  { id: 9, name: 'Front End' },
  { id: 10, name: 'Back End' },
  { id: 11, name: 'UX' },
  { id: 12, name: 'UI' },
  { id: 13, name: 'Product Design' },
  { id: 14, name: 'Full-Stack' },
  { id: 15, name: 'Dev Ops' },
  { id: 16, name: 'Project Mgmt' },
  { id: 17, name: 'Security' },
  { id: 18, name: 'Memes' },
  { id: 19, name: 'Art' },
  { id: 20, name: 'NFTs' },
  { id: 21, name: 'Graphics' },
  { id: 22, name: 'Branding' },
  { id: 23, name: '3D' },
  { id: 24, name: 'Video' },
  { id: 25, name: 'Communications' },
  { id: 26, name: 'Translation' },
  { id: 27, name: 'Docs' },
  { id: 28, name: 'Writing' },
  { id: 29, name: 'Podcasting' },
  { id: 30, name: 'Strategy' },
  { id: 31, name: 'Treasury Mgmt' },
  { id: 32, name: 'Contract Audits' },
  { id: 33, name: 'Multisig' },
];
