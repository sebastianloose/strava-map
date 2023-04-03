import { createContext, ReactElement, useEffect, useState } from "react";
import User from "../types/User";
import tokenService from "./token";

type Props = {
  children: ReactElement<any, any>;
};

export const UserContext = createContext<User | null>(null);

const AppState = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    tokenService.extractToken();
    if (tokenService.isTokenValid()) {
      setUser({ name: "User" });
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      <div>{children}</div>
    </UserContext.Provider>
  );
};

export default AppState;
