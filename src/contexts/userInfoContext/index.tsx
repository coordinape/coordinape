import { LoadingModal } from 'components';
import { useConnectedWeb3Context } from 'contexts/connectedWeb3';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { IUser, Maybe } from 'types';
import { IEpoch } from 'types/models/epoch.model';
import { isSubdomainAddress } from 'utils/domain';

export interface IUserInfoData {
  epoch: Maybe<IEpoch>;
  me: Maybe<IUser>;
  users: IUser[];
}

const UserInfoContext = React.createContext<
  IUserInfoData & {
    refreshUserInfo: () => Promise<void>;
  }
>({
  epoch: null,
  me: null,
  users: [],
  refreshUserInfo: () =>
    new Promise((resolve) => {
      resolve();
    }),
});

export const useUserInfo = () => {
  const context = React.useContext(UserInfoContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const UserInfoProvider = (props: IProps) => {
  const [state, setState] = useState<IUserInfoData>({
    epoch: null,
    me: null,
    users: [],
  });
  const { account } = useConnectedWeb3Context();
  const [isLoading, setLoading] = useState<boolean>(false);

  const getUsers = async () => {
    if (account && isSubdomainAddress()) {
      try {
        const epoches = await getApiService().getEpochs();
        const me = await getApiService().getMe(account);
        const users = await getApiService().getUsers();
        setState({
          epoch: epoches.sort(
            (a, b) => +new Date(b.start_date) - +new Date(a.start_date)
          )[0],
          me,
          users: users.filter(
            (user) => user.address.toLowerCase() !== account?.toLowerCase()
          ),
        });
      } catch (error) {
        setState({ epoch: null, me: null, users: [] });
      }
    } else {
      setState({ epoch: null, me: null, users: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <UserInfoContext.Provider value={{ ...state, refreshUserInfo: getUsers }}>
      {props.children}
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </UserInfoContext.Provider>
  );
};
