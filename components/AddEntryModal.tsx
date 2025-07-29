import { Account, Category } from "@/db/types";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddCategoryModal from "./AddCategoryModal";
import AddTransactionModal from "./AddTransactionModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: Account[];
  categories: Category[];
};

export default function AddEntryModal({
  visible,
  onClose,
  onSuccess,
  accounts,
  categories,
}: Props) {
  const [activeTab, setActiveTab] = useState<"transaction" | "category">("transaction");

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center bg-black/50 px-4"
      >
        <View className="bg-secondary rounded-xl w-full max-w-md shadow-lg p-4 max-h-[90%]">
          {/* Tab Buttons */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-tl-xl border-r border-gray-400 ${
                activeTab === "transaction" ? "bg-teal-600" : "bg-dark-100"
              }`}
              onPress={() => setActiveTab("transaction")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "transaction" ? "text-white" : "text-gray-300"
                }`}
              >
                Transaction
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-tr-xl ${
                activeTab === "category" ? "bg-teal-600" : "bg-dark-100"
              }`}
              onPress={() => setActiveTab("category")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "category" ? "text-white" : "text-gray-300"
                }`}
              >
                Category
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content wrapper with scroll */}
            {activeTab === "transaction" ? (
              <ScrollView className="flex-grow" contentContainerStyle={{ paddingBottom: 40 }}>
                <AddTransactionModal
                  visible={true}
                  onClose={onClose}
                  onSuccess={onSuccess}
                  accounts={accounts}
                  categories={categories}
                />
              </ScrollView>
            ) : (
              <ScrollView className="flex-grow">
                <AddCategoryModal
                  visible={true}
                  onClose={onClose}
                  onSave={onSuccess}
                />
              </ScrollView>
            )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
