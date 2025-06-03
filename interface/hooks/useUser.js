import { useRouter } from "next/router";
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
    const request = await fetch(`/api/v1/sessions`);

    if (request.status === 200) {
      const user = await request.json();
      setUser(user);
    }
  }, [user]);

  const userContextValue = {
    user,
    fetchUser,
    isLoading,
  };

  useEffect(() => {
    (async () => {
      if (isLoading) {
        await fetchUser();

        setIsLoading(false);
      }
    })();
  }, [isLoading]);

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default function useUser() {
  return useContext(UserContext);
}
