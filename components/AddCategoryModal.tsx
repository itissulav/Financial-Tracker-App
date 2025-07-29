import { insertCategory } from "@/db/transactions";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ALL_ICONS = Object.keys(Ionicons.glyphMap);

export default function AddCategoryModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"name" | "icon">("name");
  const [searchText, setSearchText] = useState("");

  type NewCategoryInput = {
    name: string;
    icon: string;
  };

  // Filter icons based on search input (case insensitive)
  const filteredIcons = useMemo(() => {
    if (!searchText.trim()) return ALL_ICONS;
    return ALL_ICONS.filter((icon) =>
      icon.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const handleSave = async ({ name, icon }: NewCategoryInput) => {
    console.log("Name: ", name);
    console.log("Icon: ", icon)
    if (name && selectedIcon) {
      const success = await insertCategory({ name, icon });
      setName("");
      setSelectedIcon("");
      setSearchText("");
      onSave();
      onClose();
    } else {
      alert("Please enter a name and select an icon.");
    }
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center bg-black/40 px-4"
      >
        <View className="bg-primary rounded-2xl p-6 w-full max-w-md shadow-lg">
          <Text className="text-xl font-bold mb-4 text-light-100">
            Add Category
          </Text>

          {/* Tab Buttons */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setActiveTab("name")}
              className={`flex-1 py-2 rounded-tl-2xl rounded-bl-2xl border border-r-0 border-gray-400 ${
                activeTab === "name" ? "bg-teal-600" : "bg-primary"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "name" ? "text-white" : "text-gray-300"
                }`}
              >
                Name
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("icon")}
              className={`flex-1 py-2 rounded-tr-2xl rounded-br-2xl border border-gray-400 ${
                activeTab === "icon" ? "bg-teal-600" : "bg-primary"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "icon" ? "text-white" : "text-gray-300"
                }`}
              >
                Icon
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab content */}
          {activeTab === "name" ? (
            <View>
              <Text className="text-light-100 mb-1">Category Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Grocery"
                className="border border-gray-300 rounded-md p-3 text-base text-light-100"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ) : (
            <>

              <FlatList
                data={filteredIcons}
                keyExtractor={(item) => item}
                numColumns={6}
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ maxHeight: 200 }} // adjust as needed
                ListHeaderComponent={
                  <>
                    <TextInput
                      value={searchText}
                      onChangeText={setSearchText}
                      placeholder="Search icons..."
                      className="border border-gray-300 rounded-md p-2 mb-2 text-base text-light-100"
                      placeholderTextColor="#9CA3AF"
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                  </>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedIcon(item)}
                    className={`p-2 m-1 rounded-full border items-center justify-center ${
                      selectedIcon === item
                        ? "border-teal-600 bg-teal-100"
                        : "border-gray-300"
                    }`}
                    style={{ flex: 1, maxWidth: "16.66%" }}
                  >
                    <Ionicons
                      name={item}
                      size={24}
                      color={selectedIcon === item ? "#0f766e" : "#4B5563"}
                    />
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* Save / Cancel buttons */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 px-5 py-3 rounded-lg"
            >
              <Text className="text-gray-800 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress ={() => handleSave({name, icon: selectedIcon})}
              className="bg-teal-600 px-5 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

  );
}
