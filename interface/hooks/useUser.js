import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const request = await fetch("/api/v1/sessions");

    const user = await request.json();

    setUser(user);
    setIsLoading(false);
  }, []);

  const userContextValue = {
    user,
    fetchUser,
    isLoading,
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
