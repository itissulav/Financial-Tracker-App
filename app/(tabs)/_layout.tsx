import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

type Props = {
  focused: boolean,
  icon: ImageSourcePropType
};

const TabBarIcon = ({ focused, icon }: Props) => (
  <View className="items-center justify-center align-middle relative">
    {focused ? (
      <View className="bg-accent w-12 h-12 rounded-full items-center justify-center align-middle">
        <Image
          source={icon}
          className="w-6 h-6"
          style={{ tintColor: "#0F0D23" }}
        />
      </View>
    ) : (
      <Image
        source={icon}
        className="w-6 h-6"
        style={{ tintColor: "#A8B5DB" }}
      />
    )}
  </View>
);

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 63,
          paddingTop: 10,
          paddingBottom: 10,
          justifyContent: "center",
          marginHorizontal: 20,
          marginBottom: 34,
          borderRadius: 40,
          backgroundColor: "#0f0d23",
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 20,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.transaction} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.profile} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={icons.settings} />
          ),
        }}
      />
    </Tabs>
  );
}
