import { ReactComponent as CoinbaseSVG } from 'assets/svgs/wallet/coinbase.svg';
import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';

// TODO: why does this error?
// import { EConnectorNames } from 'types';
enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
}

export const LOGGER_ID = 'flama';

export const TOKEN_PRICE_DECIMALS = 18;
export const WEIGHT_DECIMALS = 18;

export const MAX_NAME_LENGTH = 20;
export const MAX_BIO_LENGTH = 560;

export const USER_ROLE_ADMIN = 1;
export const USER_ROLE_COORDINAPE = 2;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const WALLET_ICONS: { [key in EConnectorNames]: typeof MetaMaskSVG } = {
  [EConnectorNames.Injected]: MetaMaskSVG,
  [EConnectorNames.WalletConnect]: WalletConnectSVG,
  [EConnectorNames.WalletLink]: CoinbaseSVG,
};

export const SKILLS = [
  'Community Mgmt',
  'Discord',
  'Social Media',
  'Governance',
  'Budget Mgmt',
  'Compensation',
  'Grants',
  'Solidity',
  'Web3',
  'Front End',
  'Back End',
  'UX',
  'UI',
  'Product Design',
  'Full-Stack',
  'Dev Ops',
  'Project Mgmt',
  'Security',
  'Memes',
  'Art',
  'NFTs',
  'Graphics',
  'Branding',
  '3D',
  'Video',
  'Communications',
  'Translation',
  'Docs',
  'Writing',
  'Podcasting',
  'Strategy',
  'Treasury Mgmt',
  'Contract Audits',
  'Multisig',
  'Data Analysis',
  'Risk',
  'Tokenomics',
  'Contributor Experience',
];
