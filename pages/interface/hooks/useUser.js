import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const fetchUser = useCallback(async () => {
    const request = await fetch("/api/v1/sessions");

    const user = await request.json();

    setUser(user);
  }, []);

  const userContextValue = {
    user,
    fetchUser,
  };

  useEffect(() => {
    if (!user) fetchUser();
  });

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default function useUser() {
  return useContext(UserContext);
}
