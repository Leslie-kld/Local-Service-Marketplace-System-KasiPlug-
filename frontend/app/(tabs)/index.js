import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import api from "../lib/api";
import Header from "../../components/Header";
import { AuthContext } from "../(context)/AuthContext";
import HomeHeader from "../../components/HomeHeader";

const COLORS = {
  bg: "#2A2438",
  slate: "#352F44",
  muted: "#5C5470",
  light: "#DBD8E3",
};

function ListingCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.listingCard} onPress={onPress}>
      {item.image ? (
        <Image
          source={{
            uri: item.image.startsWith("http")
              ? item.image
              : `${api.defaults.baseURL}${item.image}`,
          }}
          style={styles.thumb}
        />
      ) : (
        <View style={styles.thumbPlaceholder}>
          <Text style={styles.thumbText}>No image</Text>
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingSub}>
          {item.town} • {item.suburb || "—"}
        </Text>
        <Text style={styles.price}>R{item.price ?? "—"}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Load data on mount
  useEffect(() => {
    fetchCategories();
    fetchListings();
    loadFavourites();
  }, []);

  // Reload favourites when coming back to Home
  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [])
  );

  const loadFavourites = async () => {
    try {
      const saved = await AsyncStorage.getItem("favouriteCategories");
      if (saved) setFavourites(JSON.parse(saved));
    } catch (err) {
      console.error("Error loading favourites", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("categories err", err);
    }
  };

  const fetchListings = async (search = "") => {
    try {
      const res = await api.get("listings/", { params: { search } });
      setListings(res.data);
    } catch (err) {
      console.error("listings err", err);
    }
  };

  const onSearch = () => fetchListings(query);

  return (
    <View style={styles.container}>
      <HomeHeader title="Home" user={user} style={styles.header} />

      <Text style={styles.subtitle}>Find local services near you</Text>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search (plumber, tutor, barber...)"
          placeholderTextColor={COLORS.light}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Section */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={{ flexDirection: "row", paddingBottom: 10, flexWrap: "wrap" }}>
        {(favourites.length
          ? categories.filter((cat) => favourites.includes(cat.id))
          : categories.slice(0, 3)
        ).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/listings?category=${item.id}`)}
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Listings */}
      <Text style={styles.sectionTitle}>Recent Listings</Text>
      <FlatList
        data={listings}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => router.push(`/listings/${item.id}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.bg },
  subtitle: { color: COLORS.muted, marginBottom: 12 },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.slate,
    color: COLORS.light,
    padding: 12,
    borderRadius: 50,
  },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: COLORS.muted,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  searchBtnText: { color: COLORS.light, fontWeight: "700" },
  sectionTitle: {
    color: COLORS.light,
    marginTop: 18,
    marginBottom: 10,
    fontWeight: "700",
  },
  categoryCard: {
    backgroundColor: COLORS.slate,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginRight: 12,
    marginBottom: 10,
    minWidth: 114,
    alignItems: "center",
  },
  categoryText: { color: COLORS.light, fontWeight: "600" },
  listingCard: {
    flexDirection: "row",
    backgroundColor: COLORS.slate,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 40,
    marginBottom: 12,
    alignItems: "center",
  },
  thumb: { width: 70, height: 70, borderRadius: 40 },
  thumbPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: COLORS.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbText: { color: COLORS.light, fontSize: 12 },
  listingTitle: { color: COLORS.light, fontWeight: "700", marginBottom: 4 },
  listingSub: { color: COLORS.muted, fontSize: 12 },
  price: { color: COLORS.light, marginTop: 6, fontWeight: "700" },
  header: { padding: 160, marginBottom: 20 },
});
