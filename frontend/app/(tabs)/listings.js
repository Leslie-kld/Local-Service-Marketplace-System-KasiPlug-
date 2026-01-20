import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../(context)/AuthContext";
import api from "../lib/api";
import ListingRow from "../../components/ListingRow";
import { useRouter } from "expo-router";

const COLORS = {
  bg: "#2A2438",
  slate: "#352F44",
  light: "#DBD8E3",
};

export default function ListingTab() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const insets = useSafeAreaInsets(); // safe area values

  useEffect(() => {
    if (!user?.is_provider) {
      Alert.alert("Access Restricted", "You need to be a provider to view your listings.");
      router.replace("/"); 
      return;
    }
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    try {
      const res = await api.get("listings/", { params: { provider: user.id } });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <Text style={styles.header}>My Listings</Text>

      {/* Listings */}
      {listings.length === 0 ? (
        <Text style={{ color: COLORS.light }}>No listings found.</Text>
      ) : (
        <FlatList
          style={{ width: "100%", }}
          data={listings}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ListingRow item={item} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => router.push("/listings/create")}
      >
        <Text style={{ color: COLORS.light, fontWeight: "bold" }}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: COLORS.bg,
  },
  header: {
    color: COLORS.light,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  fab: { 
    position: "absolute", 
    right: 18, 
    bottom: 1000, 
    padding: 12, 
    borderRadius: 50, 
    flexDirection: "row", 
    backgroundColor: "#352F44", 
    paddingVertical: 15, 
    paddingHorizontal: 16, 
    marginBottom: 60, 
    alignItems: "center"  },
    listingsCard: {
      borderRadius: 50
    }
});
