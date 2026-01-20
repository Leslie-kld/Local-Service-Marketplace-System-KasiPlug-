import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../(context)/AuthContext";
import { Alert, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { HapticTab } from "@/components/haptic-tab";

export default function TabsLayout() {
  const { user } = useContext(AuthContext);

  // Function to check provider access
  const handleProviderAccess = () => {
    if (!user?.is_provider) {
      Alert.alert(
        "Access Restricted",
        "You need to be a provider to access this section."
      );
      return false;
    }
    return true;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A393BF",
        tabBarInactiveTintColor: "#DBD8E3",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: {
          position: "absolute",
          paddingTop: 6,
          marginLeft: 20,
          marginRight: 20,
          bottom: 20,           // distance from bottom
          left: 80,             // distance from left edge
          right: 80,            // distance from right edge
          height: 70,
          borderRadius: 50,     // larger radius for full pill shape
          backgroundColor: "transparent",
          borderTopWidth: 0,
          paddingBottom: Platform.OS === "ios" ? 5 : 5,
          overflow: "hidden",   // ensures BlurView respects the border radius
          shadowColor: "#A393BF",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,         // Android shadow
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={70}
            style={{
              flex: 1,
              borderRadius: 25,
              // backgroundColor: "rgba(42, 36, 56, 0.7)", // semi-transparent glass
            }}
          />
        ),
      }}
    >
      {/* 🏠 Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />

      {/* 📋 Listings Tab (Provider-only) */}
      <Tabs.Screen
        name="listings"
        options={{
          title: "Listings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
        listeners={{
          tabPress: (e) => {
            if (!handleProviderAccess()) {
              e.preventDefault(); // stop navigation if not provider
            }
          },
        }}
      />

      {/* ⚙️ Find Tab */}
      <Tabs.Screen
        name="find"
        options={{
          title: "Find",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />

      {/* ⚙️ Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}
