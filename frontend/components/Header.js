import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";

export default function Header({ title, user }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        
        <TouchableOpacity onPress={() => router.push("/account")}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                // : require("../app/assets/default-avatar.png")
                : { uri: "https://ui-avatars.com/api/?name=User&background=5C5470&color=DBD8E3" }
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Modal */}
      {/* <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.profileSection}>
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                //   : require("../app/assets/default-avatar.png")
                  : { uri: "https://ui-avatars.com/api/?name=User&background=5C5470&color=DBD8E3" }
              }
              style={styles.modalAvatar}
            />
            <View>
              <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Privacy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#2A2438",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#DBD8E3" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#5C5470" },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    backgroundColor: "#352F44",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { color: "#DBD8E3", fontSize: 18, fontWeight: "bold" },
  email: { color: "#AAA", fontSize: 14 },
  section: { marginBottom: 15 },
  sectionTitle: { color: "#DBD8E3", fontSize: 16, marginBottom: 10 },
  option: { paddingVertical: 10 },
  optionText: { color: "#DBD8E3", fontSize: 15 },
  logoutBtn: {
    backgroundColor: "#5C5470",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#DBD8E3", fontWeight: "bold" },
});
