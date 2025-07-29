import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  visible: boolean;
  categories: { name: string; icon: string }[];
  onApply: (filters: {
    category: string | null;
    type: "debit" | "credit" | null;
    dateRange: "week" | "month" | "6months" | null;
  }) => void;
};

export default function TransactionFilter({ visible, categories, onApply }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"debit" | "credit" | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<"week" | "month" | "6months" | null>(null);

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      type: selectedType,
      dateRange: selectedDateRange,
    });
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" className="align-middle justify-center z-50">
      <View className=" bg-primary p-4">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
          showsVerticalScrollIndicator={false}
        >
          {/* Channel Filter */}
          <Text className="text-light-100 text-base font-semibold mb-2">Channel</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedCategory === null ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 mr-2 rounded-full ${
                  selectedCategory === cat.name ? "bg-green-500" : "bg-dark-200"
                }`}
              >
                <Text className="text-white font-medium">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Type Filter */}
          <Text className="text-light-100 text-base font-semibold mb-2">Transaction Type</Text>
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setSelectedType(null)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedType === null ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedType("debit")}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedType === "debit" ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">Debit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedType("credit")}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedType === "credit" ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">Credit</Text>
            </TouchableOpacity>
          </View>

          {/* Date Range Filter */}
          <Text className="text-light-100 text-base font-semibold mb-2">Date</Text>
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setSelectedDateRange("week")}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedDateRange === "week" ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedDateRange("month")}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedDateRange === "month" ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedDateRange("6months")}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedDateRange === "6months" ? "bg-green-500" : "bg-dark-200"
              }`}
            >
              <Text className="text-white font-medium">Last 6 Months</Text>
            </TouchableOpacity>
          </View>

          {/* OK Button */}
          <View className="items-end mt-auto">
            <TouchableOpacity
              onPress={handleApply}
              className="bg-green-500 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold text-base">OK</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
