import { Role } from 'lib/users';

import { ReactComponent as CoinbaseSVG } from 'assets/svgs/wallet/coinbase.svg';
import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';

// TODO: why does this error?
// import { EConnectorNames } from 'types';
export enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
}

export const MAX_BIO_LENGTH = 1200;

// DEPRECATED -- use `Role` directly
export const USER_ROLE_ADMIN = Role.ADMIN;
export const USER_ROLE_COORDINAPE = Role.COORDINAPE;

export const USER_COORDINAPE_ADDRESS =
  '0xfad763da9051953fea58c2304395719a3b6ba361';

export const ZERO_UINT =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const WALLET_ICONS: { [key in EConnectorNames]: typeof MetaMaskSVG } = {
  [EConnectorNames.Injected]: MetaMaskSVG,
  [EConnectorNames.WalletConnect]: WalletConnectSVG,
  [EConnectorNames.WalletLink]: CoinbaseSVG,
};

export const SKILLS = [
  'People & Governance',
  'Development & Engineering',
  'Growth & Marketing',
  'DAO Teams',
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

export const DISTRIBUTION_TYPE = {
  GIFT: 1,
  FIXED: 2,
  COMBINED: 3,
};
