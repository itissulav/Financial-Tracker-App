import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  "All", "Grocery", "Food", "Travel", "Shopping", "Bills", "Entertainment"
];

const TRANSACTION_TYPES = ["All", "Debit", "Credit"];

const DATE_RANGES = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Past 6 Months", value: "6months" }
];

export default function TransactionFilter({ onConfirm }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRange, setSelectedRange] = useState("month");

  const getButtonClass = (active: boolean) =>
    `px-4 py-2 rounded-md mr-2 mb-2 ${
      active ? "bg-green-500 text-white" : "bg-dark-100 text-gray-300"
    }`;

  return (
    <SafeAreaView>
      <View className="bg-primary p-4 rounded-lg">

        {/* Category Section */}
        <Text className="text-light-100 font-semibold mb-2">Channel</Text>
        <View className="flex-row flex-wrap">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={getButtonClass(selectedCategory === cat)}
            >
              <Text>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction Type Section */}
        <Text className="text-light-100 font-semibold mt-4 mb-2">Transaction Type</Text>
        <View className="flex-row flex-wrap">
          {TRANSACTION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              className={getButtonClass(selectedType === type)}
            >
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Range Section */}
        <Text className="text-light-100 font-semibold mt-4 mb-2">Date</Text>
        <View className="flex-row flex-wrap">
          {DATE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.value}
              onPress={() => setSelectedRange(range.value)}
              className={getButtonClass(selectedRange === range.value)}
            >
              <Text>{range.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* OK Button */}
        <TouchableOpacity
          onPress={() =>
            onConfirm?.({
              category: selectedCategory,
              type: selectedType,
              dateRange: selectedRange,
            })
          }
          className="bg-green-500 mt-6 py-3 px-6 rounded-xl self-start"
        >
          <Text className="text-white font-semibold text-base">OK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  );
}
