import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useLocalStorage } from './useLocalStorage';
const AuthContext = createContext<AuthContextType>(null);

type ProfileResponse = {
  id: string;
  name: string;
}

type AuthContextType = {
  user: ProfileResponse & { token: string } | null;
  login: (company: string) => Promise<void>;
  logout: () => void;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (company: string ) => {
    try {
      // Login endpoint
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ company }),
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed with status: ${loginResponse.status}`);
      }

      const { access_token } = await loginResponse.json();

      // Fetch profile using access token
      const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileResponse.ok) {
        throw new Error(`Fetching profile failed with status: ${profileResponse.status}`);
      }

      const profileData: ProfileResponse = await profileResponse.json();

      setUser({
        id: profileData.id,
        name: profileData.name,
        token: access_token,
      });

      navigate('/chat');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};