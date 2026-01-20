import React, { createContext, useState, useEffect, useContext } from "react";
import { storeTokens, getAccessToken, clearTokens } from "../lib/authStorage";
import { Alert, Button } from "react-native";
// import { AuthContext } from "../(context)/AuthContext";
import { useRouter } from "expo-router";
import api from "../lib/api";

export const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // you can expand to store user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if a token exists and set user accordingly
    (async () => {
      const token = await getAccessToken();
      if (token) {
        await fetchMe();
      } else {
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await api.get("auth/me/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch /me", err);
      setUser(null);
    }
  };

  const signIn = async (tokens) => {
    await storeTokens(tokens);
    api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
    await fetchMe(); // fetch user details
  };

  const signOut = async () => {
    await clearTokens();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    Alert.alert("See you soon", "You have successfully logged out!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function LogoutButton() {
  const { signOut } = useContext(AuthContext);
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return <Button title="Logout" onPress={logout} />;
}

