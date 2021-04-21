import { LoadingModal } from 'components';
import { useConnectedWeb3Context } from 'contexts/connectedWeb3';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ICircle, IUser, Maybe } from 'types';
import { IEpoch } from 'types/models/epoch.model';

export interface IUserInfoData {
  circle: Maybe<ICircle>;
  epoch: Maybe<IEpoch>;
  me: Maybe<IUser>;
  users: IUser[];
}

const UserInfoContext = React.createContext<
  IUserInfoData & {
    refreshUserInfo: () => Promise<void>;
    setCircle: (circle: Maybe<ICircle>) => void;
  }
>({
  circle: null,
  epoch: null,
  me: null,
  users: [],
  setCircle: () => {},
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
    circle: null,
    epoch: null,
    me: null,
    users: [],
  });
  const { account } = useConnectedWeb3Context();
  const [isLoading, setLoading] = useState<boolean>(false);

  // Set Circle
  const setCircle = (circle: Maybe<ICircle>) => {
    setState((prev) => ({ ...prev, circle: circle }));
  };

  // Get Users
  const getUsers = async () => {
    if (account && state.circle) {
      try {
        const epochs = await getApiService().getEpochs();
        const me = await getApiService().getMe(account);
        const users = await getApiService().getUsers();

        setState((prev) => ({
          ...prev,
          epoch: epochs.sort(
            (a, b) => +new Date(b.start_date) - +new Date(a.start_date)
          )[0],
          me: me,
          users: users.filter(
            (user) => user.address.toLowerCase() !== account?.toLowerCase()
          ),
        }));
      } catch (error) {
        setState((prev) => ({ ...prev, epoch: null, me: null, users: [] }));
      }
    } else {
      setState((prev) => ({ ...prev, epoch: null, me: null, users: [] }));
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, state.circle]);

  // Return
  return (
    <UserInfoContext.Provider
      value={{ ...state, setCircle, refreshUserInfo: getUsers }}
    >
      {props.children}
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </UserInfoContext.Provider>
  );
};
