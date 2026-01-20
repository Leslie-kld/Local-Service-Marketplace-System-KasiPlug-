import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, ScrollView ,KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import api from "../lib/api";

const GOOGLE_API_KEY = "YOUR_GOOGLE_PLACES_API_KEY"; // <-- Replace with your key

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    is_provider: false,
    phone_number: "",
    town: "",
    suburb: "",
  });

  const handleSubmit = async () => {
    try {
      await api.post("auth/register/", form);
      Alert.alert("Account Created", "Please login to continue");
      router.replace("/(auth)/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert("Signup failed", "Try again with valid details");
    }
  };

  return (
      <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#2A2438" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#DBD8E3"
          onChangeText={(v) => setForm({ ...form, username: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#DBD8E3"
          onChangeText={(v) => setForm({ ...form, first_name: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#DBD8E3"
          onChangeText={(v) => setForm({ ...form, last_name: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#DBD8E3"
          keyboardType="email-address"
          onChangeText={(v) => setForm({ ...form, email: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#DBD8E3"
          secureTextEntry
          onChangeText={(v) => setForm({ ...form, password: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#DBD8E3"
          keyboardType="phone-pad"
          onChangeText={(v) => setForm({ ...form, phone_number: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Town"
          placeholderTextColor="#DBD8E3"
          onChangeText={(v) => setForm({ ...form, town: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Suburb"
          placeholderTextColor="#DBD8E3"
          onChangeText={(v) => setForm({ ...form, suburb: v })}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Are you a provider?</Text>
          <Switch
            value={form.is_provider}
            onValueChange={(v) => setForm({ ...form, is_provider: v })}
            thumbColor={form.is_provider ? "#A78BFA" : "#DBD8E3"}
            trackColor={{ false: "#5C5470", true: "#352F44" }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  switchLabel: { color: "#DBD8E3", fontSize: 16 },
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
