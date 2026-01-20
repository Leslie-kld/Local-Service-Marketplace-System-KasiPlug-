import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSearchParams } from "expo-router";
import api from "../../lib/api";
import ListingRow from "../../../components/ListingRow"; // create a small reusable row component

export default function ListingsPage() {
  const { category } = useSearchParams();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch();
  }, [category]);

  const fetch = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      const res = await api.get("listings/", { params });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Listings</Text>
      <FlatList data={listings} keyExtractor={(i)=>String(i.id)} renderItem={({item})=> <ListingRow item={item} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: "#2A2438", padding: 12 },
  header: { color: "#DBD8E3", fontSize: 20, marginBottom: 8 },
});
