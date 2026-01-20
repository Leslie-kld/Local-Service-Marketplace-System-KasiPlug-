import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../(context)/AuthContext";
import api from "../lib/api";

const COLORS = {
  bg: "#2A2438",
  slate: "#352F44",
  muted: "#5C5470",
  light: "#DBD8E3",
};


export default function ChatPage({ route }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]); // list of chat threads
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Fetch all chats for logged-in user
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chats", { params: { user_id: user.id } });
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages for a selected chat
  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/chats/${chatId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post(`/chats/${selectedChat.id}/messages`, {
        sender_id: user.id,
        text: text.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Chat Threads */}
      {!selectedChat ? (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={styles.header}>Chats</Text>
          {chats.length === 0 ? (
            <Text style={styles.noChats}>No chats yet.</Text>
          ) : (
            <FlatList
              data={chats}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.chatThread}
                  onPress={() => {
                    setSelectedChat(item);
                    fetchMessages(item.id);
                  }}
                >
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={styles.lastMsg}>{item.last_message || "No messages yet"}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      ) : (
        // Selected Chat View
        <View style={{ flex: 1 }}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)}>
              <Ionicons name="arrow-back-outline" size={24} color={COLORS.light} />
            </TouchableOpacity>
            <Text style={styles.chatHeaderText}>{selectedChat.name}</Text>
          </View>

          <FlatList
            style={{ flex: 1, padding: 16 }}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender_id === user.id ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={{ color: COLORS.light }}>{item.text}</Text>
                <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.muted}
              style={styles.textInput}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
              <Ionicons name="send" size={22} color={COLORS.light} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { color: COLORS.light, fontSize: 22, fontWeight: "700", marginBottom: 16 },
  noChats: { color: COLORS.muted },
  chatThread: { padding: 12, backgroundColor: COLORS.slate, borderRadius: 12, marginBottom: 12 },
  chatName: { color: COLORS.light, fontWeight: "700", fontSize: 16 },
  lastMsg: { color: COLORS.muted, marginTop: 4 },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.slate,
  },
  chatHeaderText: { color: COLORS.light, fontSize: 18, fontWeight: "700", marginLeft: 12 },

  messageBubble: { padding: 10, borderRadius: 12, marginBottom: 8, maxWidth: "80%" },
  myMessage: { backgroundColor: COLORS.muted, alignSelf: "flex-end" },
  theirMessage: { backgroundColor: COLORS.slate, alignSelf: "flex-start" },
  timestamp: { color: COLORS.light, fontSize: 10, marginTop: 2, textAlign: "right" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.slate,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    color: COLORS.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
  },
  sendBtn: { marginLeft: 8 },
});
