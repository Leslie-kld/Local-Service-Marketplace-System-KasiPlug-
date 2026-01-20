// components/ListingRow.js
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import api from "../app/lib/api";

export default function ListingRow({ item }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.row} onPress={() => router.push(`/listings/${item.id}`)}>
      {item.image ? <Image source={{ uri: item.image.startsWith("http") ? item.image : `${api.defaults.baseURL}${item.image}` }} style={styles.thumb} /> : <View style={styles.thumbPlaceholder}><Text style={styles.thumbText}>No</Text></View>}
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sub}>{item.town} • {item.suburb}</Text>
        <Text style={styles.price}>R{item.price ?? "—"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", backgroundColor: "#352F44", padding: 12, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  thumbPlaceholder: { width: 60, height: 60, borderRadius: 8, backgroundColor:"#5C5470", justifyContent:"center", alignItems:"center" },
  thumbText: { color: "#DBD8E3" },
  title: { color: "#DBD8E3", fontWeight: "700" },
  sub: { color:"#5C5470", fontSize:12 },
  price: { color:"#DBD8E3", marginTop: 6 },
});
