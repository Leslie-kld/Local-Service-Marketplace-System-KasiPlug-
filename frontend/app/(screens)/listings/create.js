import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Switch } from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../lib/api";
import { useRouter } from "expo-router";

export default function CreateListing() {
  const router = useRouter();
  const [form, setForm] = useState({ title:"", description:"", price:"", town:"", suburb:"", category: "", is_active: false });
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (res.status !== "granted") { Alert.alert("Permission required"); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true });
    if (!r.cancelled) setImage(r);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("town", form.town);
      fd.append("suburb", form.suburb);
      fd.append("is_active", form.is_active);
      fd.append("category", form.category);
      // if (form.category) fd.append("category", form.category);
      if (image?.uri) {
        const uriParts = image.uri.split(".");
        const ext = uriParts[uriParts.length - 1];

        fd.append("image", {
          uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
          name: `photo.${ext}`,
          type: `image/${ext}`,
        });
      }

      await api.post("listings/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      Alert.alert("Created", "Listing posted");
      router.replace("/(screens)");
    } catch (err) {
      console.error("create err", err?.response?.data || err);
      Alert.alert("Error", "Could not create listing");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Listing</Text>
      <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#DBD8E3" onChangeText={(v)=>setForm({...form, title:v})} />
      <TextInput style={[styles.input, {height:100}]} placeholder="Description" placeholderTextColor="#DBD8E3" multiline onChangeText={(v)=>setForm({...form, description:v})} />
      <TextInput style={styles.input} placeholder="Price" placeholderTextColor="#DBD8E3" keyboardType="numeric" onChangeText={(v)=>setForm({...form, price:v})} />
      <TextInput style={styles.input} placeholder="City/Town" placeholderTextColor="#DBD8E3" onChangeText={(v)=>setForm({...form, town:v})} />
      <TextInput style={styles.input} placeholder="Suburb" placeholderTextColor="#DBD8E3" onChangeText={(v)=>setForm({...form, suburb:v})} />
      <TextInput style={styles.input} placeholder="Category" placeholderTextColor="#DBD8E3" onChangeText={(v)=>setForm({...form, category:v})} />
      <Text style={styles.label}>Is Active</Text>
      <Switch value={form.is_active} onValueChange={(v) => setForm({ ...form, is_active: v })} trackColor={{ false: '#DBD8E3', true: '#6200EE' }} thumbColor={form.suburbChecked ? '#DBD8E3' : '#DBD8E3'}/>

      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}><Text style={{color:"#DBD8E3"}}>{image ? "Change Image" : "Pick Image"}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}><Text style={{color:"#DBD8E3", fontWeight:"700"}}>Post Listing</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#2A2438", padding:16,  paddingTop: 65 },
  title: { color:"#DBD8E3", fontSize:20, fontWeight:"700", marginBottom:12 },
  input: { backgroundColor:"#352F44", color:"#DBD8E3", padding:12, borderRadius:8, marginBottom:12 },
  pickBtn: { backgroundColor:"#5C5470", padding:12, borderRadius:8, alignItems:"center", marginBottom:12, marginTop: 15 },
  submitBtn: { backgroundColor:"#5C5470", padding:14, borderRadius:8, alignItems:"center" },
  label: { marginLeft: 8, color: '#DBD8E3', fontSize: 16, paddingBottom: 10, paddingTop: 10 }
});
