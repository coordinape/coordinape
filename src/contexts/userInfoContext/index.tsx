import { LoadingModal } from 'components';
import { useConnectedWeb3Context } from 'contexts/connectedWeb3';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { IUser, Maybe } from 'types';

export interface IUserInfoData {
  me: Maybe<IUser>;
  users: IUser[];
}

const UserInfoContext = React.createContext<
  IUserInfoData & {
    refreshUserInfo: () => Promise<void>;
  }
>({
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
    me: null,
    users: [],
  });
  const { account } = useConnectedWeb3Context();
  const [isLoading, setLoading] = useState<boolean>(false);

  const getUsers = async () => {
    if (account) {
      try {
        const me = await getApiService().getMe(account);
        const users = await getApiService().getUsers();
        setState({
          me,
          users: users.filter(
            (user) => user.address.toLowerCase() !== account?.toLowerCase()
          ),
        });
      } catch (error) {
        setState({ me: null, users: [] });
      }
    } else {
      setState({ me: null, users: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsers();
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
