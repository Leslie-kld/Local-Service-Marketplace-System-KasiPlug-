import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  darkBg: "#2A2438",
  darkCard: "#352F44",
  lightBg: "#F5F5F5",
  lightCard: "#E6E6E6",
  accent: "#5C5470",
  textDark: "#DBD8E3",
  textLight: "#2A2438",
};

export default function AppSettings() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState(true);
  const [language, setLanguage] = useState("English");
  const insets = useSafeAreaInsets(); // safe area values
  

  // Load saved preferences on mount
  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) setIsDarkMode(theme === "dark");
      const notif = await AsyncStorage.getItem("notifications");
      if (notif) setNotifications(JSON.parse(notif));
      const compact = await AsyncStorage.getItem("compactView");
      if (compact) setCompactView(JSON.parse(compact));
      const loc = await AsyncStorage.getItem("locationSuggestions");
      if (loc) setLocationSuggestions(JSON.parse(loc));
      const lang = await AsyncStorage.getItem("language");
      if (lang) setLanguage(lang);
    })();
  }, []);

  const savePref = async (key, value) => {
    await AsyncStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await savePref("theme", newMode ? "dark" : "light");
    Alert.alert("Theme changed", `Switched to ${newMode ? "Dark" : "Light"} Mode`);
  };

  const toggleSetting = async (key, value, setter) => {
    setter(!value);
    await savePref(key, !value);
  };

  const cycleLanguage = async () => {
    const langs = ["English", "Sepedi", "Zulu"];
    const next = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(next);
    await savePref("language", next);
  };

  const themeColors = isDarkMode
    ? { bg: COLORS.darkBg, card: COLORS.darkCard, text: COLORS.textDark }
    : { bg: COLORS.lightBg, card: COLORS.lightCard, text: COLORS.textLight };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bg }, { paddingTop: insets.top + 16 }]}>
      <Text style={[styles.header, { color: themeColors.text }]}>Notification Settings</Text>
      {/* Notifications */}
      <View style={[styles.row, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.label, { color: themeColors.text }]}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={() =>
            toggleSetting("notifications", notifications, setNotifications)
          }
          trackColor={{ true: COLORS.accent, false: "#999" }}
        />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
  },
});
