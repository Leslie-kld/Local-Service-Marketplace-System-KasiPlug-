// app/(settings)/ManageFavouriteCategories.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../../lib/api";

const COLORS = {
  darkBg: "#2A2438",
  darkCard: "#352F44",
  lightBg: "#F5F5F5",
  lightCard: "#E6E6E6",
  accent: "#5C5470",
  text: "#DBD8E3",
};

export default function ManageFavouriteCategories() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchCategories();
    loadSavedFavourites();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedFavourites = async () => {
    const saved = await AsyncStorage.getItem("favouriteCategories");
    if (saved) setSelected(JSON.parse(saved));
  };

  const toggleSelect = async (id) => {
    let updated;
    if (selected.includes(id)) {
      updated = selected.filter((x) => x !== id);
    } else {
      if (selected.length >= 3) {
        Alert.alert("Limit Reached", "You can only select up to 3 categories.");
        return;
      }
      updated = [...selected, id];
    }
    setSelected(updated);
    await AsyncStorage.setItem("favouriteCategories", JSON.stringify(updated));
  };

  const renderCategory = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { backgroundColor: isSelected ? COLORS.accent : COLORS.darkCard },
        ]}
        onPress={() => toggleSelect(item.id)}
      >
        <Text style={styles.categoryText}>{item.name}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={20} color={COLORS.text} />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <ActivityIndicator size="large" color={COLORS.text} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: COLORS.darkBg, paddingTop: insets.top + 16 },
      ]}
    >
      <Text style={styles.header}>Manage Favourite Categories</Text>
      <Text style={styles.subtext}>Select up to 3 categories you like most.</Text>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => Alert.alert("Saved!", "Your favourite categories were updated.")}
      >
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { color: COLORS.text, fontSize: 22, fontWeight: "700", marginTop: 10, marginBottom: 8 },
  subtext: { color: COLORS.accent, marginBottom: 16 },
  categoryCard: {
    width: "48%",
    backgroundColor: COLORS.darkCard,
    borderRadius: 50,
    padding: 18,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  categoryText: {
    color: COLORS.text,
    fontWeight: "600",
    marginRight: 6,
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
    alignItems: "center",
  },
  saveBtnText: { color: COLORS.text, fontWeight: "bold", fontSize: 16 },
});
