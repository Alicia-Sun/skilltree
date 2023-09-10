import { createContext, useContext } from "react";

type User = {
  isLoggedIn: boolean;
};

// @ts-ignore
export const LoginContext = createContext<User>();

export function useLoginContext() {
  return useContext(LoginContext);
}
