import React, { createContext, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { webAppURL } from '../../config/webAppURL';
import { coLinksPaths } from '../../routes/paths';
import { Text } from '../../ui';
import { useAuthStore } from '../auth';
import { getCoLinksContract } from '../cosoul/contracts';
import { useNotificationCount } from '../notifications/useNotificationCount';

import { useCoLinksNavQuery } from './useCoLinksNavQuery';
import { TOS_UPDATED_AT } from './wizard/WizardTerms';

// Define the context's type
interface CoLinksContextType {
  coLinksReadOnly?: CoLinks;
  address?: string;
  awaitingWallet: boolean;
  setAwaitingWallet(b: boolean): void;
}

const initialState: CoLinksContextType = {
  awaitingWallet: false,
  setAwaitingWallet: () => {},
};

// Create the context
const CoLinksContext = createContext<CoLinksContextType>(initialState);

type CoLinksProviderProps = {
  children: React.ReactNode;
};

// Define the provider component
const CoLinksProvider: React.FC<CoLinksProviderProps> = ({ children }) => {
  const address = useAuthStore(state => state.address);
  const navigate = useNavigate();
  const location = useLocation();
  const [awaitingWallet, setAwaitingWallet] = useState(false);
  const { data } = useCoLinksNavQuery();

  // TODO: on correct chain needs to be checked for the wizard
  // useEffect(() => {
  //   if (!onCorrectChain) {
  //     navigate(
  //       coLinksPaths.wizard +
  //         '?redirect=' +
  //         encodeURIComponent(location.pathname),
  //       {
  //         replace: true,
  //       }
  //     );
  //   }
  // }, [onCorrectChain]);

  useEffect(() => {
    if (data) {
      if (data?.profile) {
        if (!data.profile.invite_code_redeemed_at) {
          navigate(coLinksPaths.wizard);
        } else if (!data.profile.tos_agreed_at) {
          navigate(coLinksPaths.wizard);
        } else if (!data.profile.cosoul) {
          // show the mint button
          navigate(coLinksPaths.wizard);
        } else if (!data.profile.links_held) {
          // redirect to wizard so they can buy their own link
          // we might already be on the wizard
          if (location.pathname !== coLinksPaths.wizard) {
            navigate(coLinksPaths.wizard);
          }
        } else {
          const tosAgreedAt = new Date(data.profile.tos_agreed_at);
          const tosUpdatedAt = new Date(TOS_UPDATED_AT);
          if (tosAgreedAt < tosUpdatedAt) {
            navigate(coLinksPaths.wizard);
          }
        }
      }
    }
  }, [data]);

  const { count: notificationCount } = useNotificationCount();
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (notificationCount !== undefined && notificationCount > 0) {
      link.href = webAppURL('colinks') + '/imgs/logo/colinks-favicon-noti.png';
    } else {
      link.href = webAppURL('colinks') + '/imgs/logo/colinks-favicon.png';
    }
  }, [notificationCount]);

  // TODO: handle these cases
  // if (!chainId) {
  //   return <Text>Not connected</Text>;
  // }
  //
  // if (!onCorrectChain) {
  //   return <LoadingIndicator />;
  // }

  if (data === undefined) {
    return (
      <Text>
        <div>LOL</div>
        <LoadingIndicator />
      </Text>
    );
  }

  if (!data) {
    return <Text>Loading...</Text>;
  }
  const coLinksReadOnly = getCoLinksContract();
  if (!coLinksReadOnly) {
    return <Text>CoLinks not available.</Text>;
  }

  return (
    <CoLinksContext.Provider
      value={{
        coLinksReadOnly,
        address,
        awaitingWallet,
        setAwaitingWallet,
      }}
    >
      {children}
    </CoLinksContext.Provider>
  );
};

export { CoLinksProvider, CoLinksContext };
