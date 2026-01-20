import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../../lib/api";
import Header from "../../../components/Header";
import { AuthContext } from "../../(context)/AuthContext";

const COLORS = {
  bg: "#2A2438",
  slate: "#352F44",
  muted: "#5C5470",
  light: "#DBD8E3",
};


export default function ListingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const res = await api.get(`listings/${id}/`);
      setListing(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`listings/${id}/`);
            router.replace("/(screens)");
          } catch (err) {
            Alert.alert("Error", "Could not delete");
          }
        },
      },
    ]);
  };

  const onBook = () => {
    Alert.alert("Booking", "Booking feature coming soon!");
  };

  if (!listing)
    return (
      <View style={styles.container}>
        <Text style={{ color: "#DBD8E3" }}>Loading...</Text>
      </View>
    );

  const isOwner = listing.provider?.id === user?.id; // ✅ Check if logged-in provider owns this listing

  return (
    <View style={styles.container}>
      {/* <Header title="About service" /> */}
      <Text style={styles.header}>About service</Text>

      {listing.image ? (
        <Image
          source={{
            uri: listing.image.startsWith("http")
              ? listing.image
              : `${api.defaults.baseURL}${listing.image}`,
          }}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.title}>
        {listing.provider?.first_name} {listing.provider?.last_name} ({listing.title})
      </Text>
      <Text style={styles.sub}>
        {listing.town} • {listing.suburb}
      </Text>
      <Text style={styles.desc}>{listing.description}</Text>
      <Text style={styles.price}>FROM R{listing.price ?? "—"}</Text>

      {isOwner ? (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
          <Text style={styles.btnText}>Book This Service</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2A2438", padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 50, marginBottom: 12 },
  title: { color: "#DBD8E3", fontSize: 22, fontWeight: "700" },
  sub: { color: "#5C5470", marginBottom: 8 },
  desc: { color: "#DBD8E3", marginBottom: 12 },
  price: { color: "#DBD8E3", fontWeight: "700", marginBottom: 20 },
  deleteBtn: {
    backgroundColor: "#B23B3B",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  bookBtn: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  btnText: { color: "#DBD8E3", fontWeight: "600" },
    header: {
    color: COLORS.light,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 50
  },
});
