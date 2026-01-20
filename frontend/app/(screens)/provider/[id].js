import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import api from "../../lib/api";
import ListingRow from "../../../components/ListingRow";

const COLORS = {
  bg: "#2A2438",
  slate: "#352F44",
  muted: "#5C5470",
  light: "#DBD8E3",
  accent: "#A393BF",
};

export default function ProviderProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      const [resProvider, resCatalog] = await Promise.all([
        api.get(`providers/${id}/`),
        api.get("listings/", { params: { provider: id } }),
      ]);
      setProvider(resProvider.data);
      setCatalog(resCatalog.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load provider data.");
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (type) => {
    if (!provider) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (type) {
      case "call":
        if (provider.phone) Linking.openURL(`tel:${provider.phone}`);
        break;
      case "whatsapp":
        if (provider.phone) Linking.openURL(`https://wa.me/${provider.phone}`);
        break;
      case "email":
        if (provider.email) Linking.openURL(`mailto:${provider.email}`);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.light} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.light }}>{error}</Text>
      </View>
    );
  }

  if (!provider) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {provider.profile_picture ? (
          <Image
            source={{
              uri: provider.profile_picture.startsWith("http")
                ? provider.profile_picture
                : `${api.defaults.baseURL}${provider.profile_picture}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-outline" size={80} color={COLORS.light} />
          </View>
        )}

        <Text style={styles.name}>
          {provider.first_name || provider.name} {provider.last_name || ""}
        </Text>

        {provider.is_provider && (
          <Text style={styles.roleBadge}>Provider</Text>
        )}

        <Text style={styles.bio}>{provider.bio || "No description provided."}</Text>
      </View>

      {/* Contact Buttons */}
      <View style={styles.contactRow}>
        {provider.phone && (
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => handleContact("call")}
          >
            <Ionicons name="call-outline" size={24} color={COLORS.light} />
            <Text style={styles.contactText}>Call</Text>
          </TouchableOpacity>
        )}
        {provider.phone && (
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => handleContact("whatsapp")}
          >
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.light} />
            <Text style={styles.contactText}>WhatsApp</Text>
          </TouchableOpacity>
        )}
        {provider.email && (
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => handleContact("email")}
          >
            <MaterialIcons name="email" size={24} color={COLORS.light} />
            <Text style={styles.contactText}>Email</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Catalog / Services */}
    <View style={{ marginTop: 20 }}>
    <Text style={styles.sectionHeader}>Services</Text>
    {catalog.length === 0 ? (
        <Text style={{ color: COLORS.muted, marginTop: 8 }}>
        No services listed.
        </Text>
    ) : (
        <FlatList
        data={catalog}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ListingRow item={item} />}
        scrollEnabled={false} // because it's inside ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        />
    )}
    </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  header: { alignItems: "center", marginBottom: 20, marginTop: 70 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.muted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: { color: COLORS.light, fontSize: 22, fontWeight: "700" },
  roleBadge: {
    marginTop: 4,
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  bio: { color: COLORS.muted, textAlign: "center", marginTop: 4 },
  contactRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 16 },
  contactBtn: { alignItems: "center" },
  contactText: { color: COLORS.light, marginTop: 4, fontSize: 12 },
  sectionHeader: { color: COLORS.light, fontSize: 18, fontWeight: "600", marginBottom: 8 },
});
