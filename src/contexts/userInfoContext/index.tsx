import { LoadingModal } from 'components';
import { useConnectedWeb3Context } from 'contexts/connectedWeb3';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ICircle, IUser, Maybe } from 'types';
import { IEpoch } from 'types/models/epoch.model';

export interface IUserInfoData {
  circle: Maybe<ICircle>;
  pastEpochs: IEpoch[]; // Past Epochs
  epoch: Maybe<IEpoch>; // Current or Last Epoch
  epochs: IEpoch[]; // Upcoming Epochs
  me: Maybe<IUser>;
  users: IUser[];
}

const UserInfoContext = React.createContext<
  IUserInfoData & {
    setCircle: (circle: Maybe<ICircle>) => void;
    addEpoch: (epoch: IEpoch) => void;
    deleteEpoch: (id: number) => void;
    addUser: (user: IUser) => void;
    deleteUser: (id: number) => void;
    refreshUserInfo: () => Promise<void>;
  }
>({
  circle: null,
  pastEpochs: [],
  epoch: null,
  epochs: [],
  me: null,
  users: [],
  setCircle: () => {},
  addEpoch: () => {},
  deleteEpoch: () => {},
  addUser: () => {},
  deleteUser: () => {},
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
    pastEpochs: [],
    epoch: null,
    epochs: [],
    me: null,
    users: [],
  });
  const { account } = useConnectedWeb3Context();
  const [isLoading, setLoading] = useState<boolean>(false);

  // Set Circle
  const setCircle = (circle: Maybe<ICircle>) => {
    const circle_ = circle;
    if (circle_) {
      if (!circle_.team_sel_text) {
        circle_.team_sel_text = `Select the people you have been working with so you can thank them with ${circle_.token_name}`;
      }
      if (!circle_.alloc_text) {
        circle_.alloc_text = `Thank your teammates by allocating them ${circle_.token_name}`;
      }
    }
    setState((prev) => ({ ...prev, circle: circle_ }));
  };

  // Add Epoch
  const addEpoch = (newEpoch: IEpoch) => {
    setState((prev) => ({ ...prev, epochs: [...prev.epochs, newEpoch] }));
  };

  // Delete Epoch
  const deleteEpoch = (id: number) => {
    setState((prev) => ({
      ...prev,
      epochs: prev.epochs.filter((epoch) => epoch.id !== id),
    }));
  };

  // Add User
  const addUser = (newUser: IUser) => {
    if (newUser.id === state.me?.id) {
      setState((prev) => ({ ...prev, me: newUser }));
    } else {
      setState((prev) => ({
        ...prev,
        users: [
          ...prev.users.filter((user) => user.id !== newUser.id),
          newUser,
        ],
      }));
    }
  };

  // Delete User
  const deleteUser = (id: number) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== id),
    }));
  };

  // Refresh UserInfo
  const refreshUserInfo = async () => {
    if (account && state.circle) {
      try {
        let epochs = await getApiService().getEpochs();
        const me = await getApiService().getMe(account);
        const users = await getApiService().getUsers();

        epochs = epochs.sort(
          (a, b) => +new Date(a.start_date) - +new Date(b.start_date)
        );
        let epoch = epochs[epochs.length - 1];
        const pastEpochs = epochs.filter(
          (epoch) => +new Date(epoch.start_date) - +new Date() <= 0
        );
        const activeEpochs = epochs.filter(
          (epoch) => +new Date(epoch.end_date) - +new Date() >= 0
        );
        if (activeEpochs.length === 0) {
          epochs = [];
        } else {
          epoch = activeEpochs[0];
          epochs = activeEpochs.filter(
            (epoch) => +new Date(epoch.start_date) - +new Date() > 0
          );
        }

        setState((prev) => ({
          ...prev,
          pastEpochs: pastEpochs,
          epoch: epoch,
          epochs,
          me: me,
          users: users.filter(
            (user) => user.address.toLowerCase() !== account?.toLowerCase()
          ),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          epoch: null,
          epochs: [],
          me: null,
          users: [],
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        epoch: null,
        epochs: [],
        me: null,
        users: [],
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    refreshUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, state.circle]);

  // Return
  return (
    <UserInfoContext.Provider
      value={{
        ...state,
        setCircle,
        addEpoch,
        deleteEpoch,
        addUser,
        deleteUser,
        refreshUserInfo,
      }}
    >
      {props.children}
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </UserInfoContext.Provider>
  );
};
