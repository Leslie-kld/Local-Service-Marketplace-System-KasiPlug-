import React, { useContext } from "react";
import { Button } from "react-native";
import { AuthContext } from "../app/(context)/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const { signOut } = useContext(AuthContext);
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return <Button title="Logout" onPress={logout} />;
}
