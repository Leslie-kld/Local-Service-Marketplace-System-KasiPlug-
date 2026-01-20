import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import api from "../lib/api";
import { AuthContext } from "../(context)/AuthContext";

export default function Login() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async () => {
    try {
      const res = await api.post("auth/login/", form);
      const tokens = { access: res.data.access, refresh: res.data.refresh };
      await signIn(tokens, res.data.user);
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Login failed", "Check username/password");
    }
  };

  return (
    <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#2A2438" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#DBD8E3"
        onChangeText={(v) => setForm({ ...form, username: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#DBD8E3"
        secureTextEntry
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A2438",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#DBD8E3",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#5C5470",
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#352F44",
    color: "#DBD8E3",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#5C5470",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#DBD8E3",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#DBD8E3",
    fontSize: 14,
  },
});
