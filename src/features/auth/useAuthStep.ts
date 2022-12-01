// TODO replace this with zustand

import { createContext, useContext } from 'react';

export type AuthStep = 'connect' | 'sign' | 'done';

type AuthContextType = [
  AuthStep,
  React.Dispatch<React.SetStateAction<AuthStep>>
];

export const AuthContext = createContext<AuthContextType>([
  'connect',
  () => {},
]);

export const useAuthStep = () => useContext(AuthContext);
