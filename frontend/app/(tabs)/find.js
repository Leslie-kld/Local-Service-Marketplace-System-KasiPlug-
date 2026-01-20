import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../lib/api";

const COLORS = {
  bg: "#2A2438",
  slate: "#352F44",
  muted: "#5C5470",
  light: "#DBD8E3",
};

export default function Find() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async (search = "") => {
    try {
      setLoading(true);
      const res = await api.get("providers/", { params: { search } });
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = () => {
    fetchProviders(query);
  };

  const renderProvider = ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/provider/${item.id}`)}
      >

      {item.profile_picture ? (
        <Image
          source={{
            uri: item.profile_picture.startsWith("http")
              ? item.profile_picture
              : `${api.defaults.baseURL}${item.profile_picture}`,
          }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-outline" size={26} color={COLORS.light} />
        </View>
      )}

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.service}>
          {item.service_type || "No service listed"}
        </Text>
        <Text style={styles.location}>
          {item.town || "Unknown"} • {item.suburb || "—"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.header}>Find Service Providers</Text>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.light}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search for a provider or service..."
            placeholderTextColor={COLORS.light}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <TouchableOpacity onPress={onSearch}>
            <Ionicons name="arrow-forward-circle" size={24} color={COLORS.light} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.light}
            style={{ marginTop: 20 }}
          />
        ) : providers.length === 0 ? (
          <Text style={styles.noResults}>No providers found.</Text>
        ) : (
          <FlatList
            data={providers}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderProvider}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            style={{ flex: 1, width: "100%" }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 18,
  },
  header: {
    color: COLORS.light,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.slate,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: COLORS.light,
  },
  noResults: {
    color: COLORS.light,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.slate,
    borderRadius: 50,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: COLORS.light,
    fontWeight: "700",
    fontSize: 16,
  },
  service: {
    color: COLORS.muted,
    fontSize: 13,
  },
  location: {
    color: COLORS.light,
    fontSize: 12,
    marginTop: 2,
  },
});
