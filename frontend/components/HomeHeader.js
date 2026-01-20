import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeHeader({ title = "Home" }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>

      {/* Chat Icon */}
      <TouchableOpacity onPress={() => router.push("/(modals)/account")}>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color="#DBD8E3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#2A2438",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DBD8E3",
  },
});
