import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../(context)/AuthContext";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";


export default function Account() {
  const { user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets(); // safe area values

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : { uri: "https://ui-avatars.com/api/?name=User&background=5C5470&color=DBD8E3&size=40&rounded=true" }
          }
          style={styles.avatar}
        /> */}
        <Ionicons style={styles.profilepic} name="person-circle-outline" size={60} color="#DBD8E3" />


        <View>
          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

  {/* ACCOUNT SECTION */}
  <View style={styles.group}>
    <Text style={styles.groupTitle}>Account</Text>
    <View style={styles.card}>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Manage Subscriptions</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Redeem Gift Card or Code</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Send Gift Card by Email</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowText}>Add Funds</Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* DEVICE SETTINGS SECTION */}
  <View style={styles.group}>
    <Text style={styles.groupTitle}>Device Settings</Text>
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/(screens)/settings/AppSettings")}
      >
        <Text style={styles.rowText}>App Settings</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/(screens)/settings/notifications")}
      >
        <Text style={styles.rowText}>Notification Settings</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/(screens)/settings/ManageFavouriteCategories")}
      >
        <Text style={styles.rowText}>Manage Favourite Categories</Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* LOGOUT */}
  <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A2438",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileSection: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  name: { color: "#DBD8E3", fontSize: 20, fontWeight: "bold" },
  email: { color: "#AAA", fontSize: 14 },
  sectionTitle: {
    color: "#DBD8E3",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  option: {
    backgroundColor: "#352F44",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionText: { color: "#DBD8E3", fontSize: 16 },
  logoutBtn: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#5C5470",
    borderRadius: 50,
    alignItems: "center",
  },
  logoutText: { color: "#DBD8E3", fontSize: 16, fontWeight: "bold" },
  profilepic: {
    marginRight: 10,
  },
  group: {
  marginBottom: 24,
  },
  groupTitle: {
    color: "#AAA",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#352F44",
    borderRadius: 30,
    overflow: "hidden",
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowText: {
    color: "#DBD8E3",
    fontSize: 16,
  },
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#5C5470",
    opacity: 0.6,
    marginHorizontal: 20,
  },
  logoutBtn: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#5C5470",
  },
  logoutText: {
    color: "#DBD8E3",
    fontSize: 16,
    fontWeight: "bold",
  },

});
