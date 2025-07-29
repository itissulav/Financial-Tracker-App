import { updateAccountBalance } from "@/db/accounts";
import { insertTransaction } from "@/db/transactions";
import { Account, Category } from "@/db/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: Account[];
  categories: Category[]; // category has at least id, name, icon
};

export default function AddTransactionModal({
  visible,
  onClose,
  onSuccess,
  accounts,
  categories,
}: Props) {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    accounts[0]?.id ?? null
  );
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories[0] ?? null
  );
  const [type, setType] = useState<"credit" | "debit">("debit");
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  const handleAdd = async () => {
    if (!selectedAccountId || !amount || !selectedCategory) return;

    const amountValue = parseFloat(amount);
    const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
    if (!selectedAccount) return;

    await insertTransaction({
      account_id: selectedAccountId,
      type,
      category_id: selectedCategory.id,
      note: "Manual Entry",
      amount: amountValue,
      created_at: date.toISOString(),
    });

    const updatedBalance =
      type === "credit"
        ? selectedAccount.balance + amountValue
        : selectedAccount.balance - amountValue;

    await updateAccountBalance(selectedAccountId, updatedBalance);

    setAmount("");
    setSelectedCategory(categories[0] ?? null);
    setType("debit");
    onSuccess();
    onClose();
  };

  return (

    <View className="flex-1 w-full">
      <ScrollView className="gap-4">
                  <Text className="text-light-100 text-xl font-bold mb-6">
            Add Transaction
          </Text>

          {/* Storage Picker with native iOS wheel style */}
          <View className="mb-4">
            <Text className="text-light-300 text-sm mb-1">Storage</Text>
            <View
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <Picker
                selectedValue={selectedAccountId}
                onValueChange={(value) => setSelectedAccountId(value)}
                style={{ color: "white", height: 150 }} // tall enough for wheel
                itemStyle={{ color: "white", fontSize: 20 }} // iOS wheel text style
              >
                {accounts.map((account) => (
                  <Picker.Item
                    key={account.id}
                    label={account.name}
                    value={account.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Type Toggle */}
          <View className="mb-4 flex-row justify-between">
            <TouchableOpacity
              onPress={() => setType("debit")}
              className={`flex-1 p-3 rounded-l-lg items-center ${
                type === "debit" ? "bg-red-500" : "bg-dark-100"
              }`}
            >
              <Text className="text-white font-semibold">Debit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType("credit")}
              className={`flex-1 p-3 rounded-r-lg items-center ${
                type === "credit" ? "bg-green-600" : "bg-dark-100"
              }`}
            >
              <Text className="text-white font-semibold">Credit</Text>
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <View className="mb-4">
            <Text className="text-light-300 text-sm mb-1">Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 1000"
              keyboardType="numeric"
              className="bg-dark-100 text-white rounded-lg p-3 text-base"
              placeholderTextColor="#9CA4AB"
            />
          </View>

          {/* Category Dropdown */}
          <View className="mb-4">
            <Text className="text-light-300 text-sm mb-1">Category</Text>
            <TouchableOpacity
              onPress={() => setCategoryDropdownVisible(true)}
              className="bg-dark-100 rounded-lg p-3 flex-row items-center justify-between"
            >
              {selectedCategory ? (
                <>
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name={selectedCategory.icon || "pricetag-outline"}
                      size={24}
                      color="#38B2AC"
                    />
                    <Text className="text-white text-base">
                      {selectedCategory.name}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down-outline" size={20} color="white" />
                </>
              ) : (
                <Text className="text-gray-400">Select category</Text>
              )}
            </TouchableOpacity>

            {/* Category selection modal */}
            <Modal
              visible={categoryDropdownVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setCategoryDropdownVisible(false)}
            >
              <TouchableOpacity
                className="flex-1 bg-black/50 justify-center items-center"
                onPress={() => setCategoryDropdownVisible(false)}
                activeOpacity={1}
              >
                <View className="bg-secondary rounded-lg p-4 w-80 max-h-96">
                  <ScrollView>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        className="flex-row items-center p-3 rounded-md mb-1"
                        onPress={() => {
                          setSelectedCategory(cat);
                          setCategoryDropdownVisible(false);
                        }}
                      >
                        <Ionicons
                          name={cat.icon || "pricetag-outline"}
                          size={28}
                          color="#38B2AC"
                          className="mr-3"
                        />
                        <Text className="text-light-100 text-lg">{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Date and Time Picker */}
          <View className="mb-6">
            <Text className="text-light-300 text-sm mb-1">Date & Time</Text>
            <TouchableOpacity
              className="bg-dark-100 rounded-lg p-3"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white">
                {date.toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="datetime"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-red-500 px-4 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-base">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAdd}
              className="flex-1 bg-teal-500 px-4 py-3 rounded-lg items-center"
              disabled={!amount || !selectedCategory || !selectedAccountId}
            >
              <Text className="text-white font-semibold text-base">Add</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </View>
  );
}
