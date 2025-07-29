import { TransactionWithCategory } from "@/db/types";
import { Text, View } from "react-native";

type Props = {
  recentTransaction: TransactionWithCategory;
}


export default function TransactionCard({recentTransaction}: Props) {

  const type = recentTransaction.type
  const purpose = recentTransaction.category_name
  const amount = recentTransaction.amount
  const timestamp = recentTransaction.created_at

  const isCredit = type === "credit";

  return (
    <View className="bg-secondary w-full p-4 rounded-xl mb-3 shadow-lg shadow-black/10 flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-light-100 text-base font-semibold">
          {purpose}
        </Text>
        <Text
          className={`text-lg mt-1 font-bold ${
            isCredit ? "text-teal-500" : "text-[#ca3232]"
          }`}
        >
          {isCredit ? "+" : "-"} Rs. {amount}
        </Text>
      </View>
      <Text className="text-gray-400 text-sm ml-4 text-right w-24">
        {timestamp}
      </Text>
    </View>
  );
}
