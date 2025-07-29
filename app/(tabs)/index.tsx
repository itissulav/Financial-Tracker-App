import AddAccountModal from "@/components/AddAccountModal";
import AddCard from "@/components/AddCard";
import CardOptionsModal from "@/components/CardOptionsModal";
import EditAccountModal from "@/components/EditAccountModal";
import GraphDropdown from "@/components/GraphDropdown";
import StorageCard from "@/components/StorageCard";
import TotalCard from "@/components/TotalCard";
import TransactionCard from "@/components/TransactionCard";
import { initDatabase, resetDatabase } from "@/db";
import { getAllAccounts } from "@/db/accounts";
import {
  getMonthlyExpenses,
  getRecentTransactions,
  MonthlyExpense,
} from "@/db/transactions";
import { Account, TransactionWithCategory } from "@/db/types";
import { handleDelete, handleLongPress } from "@/utilities/accountActions";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] =
    useState<TransactionWithCategory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editAccountModalVisible, setEditAccountModalVisible] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expenseByMonth, setExpenseByMonth] = useState<MonthlyExpense[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const fetchData = async () => {
    await initDatabase();
    const data = await getAllAccounts();
    const recent = await getRecentTransactions();
    const expenses = await getMonthlyExpenses();

    setAccounts(data as Account[]);
    setRecentTransactions(recent as TransactionWithCategory[]);
    setExpenseByMonth(expenses as MonthlyExpense[]);
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(Number(year), Number(monthNum) - 1);
    return date.toLocaleString("default", { month: "short", year: "2-digit" });
  };

  const labels = expenseByMonth
    .map((item) => formatMonth(item.month))
    .filter((month) => !!month);

  const values = expenseByMonth
    .map((item) => Number(item.total_spent))
    .filter((val) => !isNaN(val) && isFinite(val));

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleReset = async () => {
    await resetDatabase();
    Alert.alert("Database Reset", "All data has been reset.");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary pb-8">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#AB8BFF"]}
            tintColor="#AB8BFF"
          />
        }
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Add New Account */}
        <AddAccountModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSuccess={fetchData}
        />

        {/* Edit Account */}
        <EditAccountModal
          visible={editAccountModalVisible}
          onClose={() => setEditAccountModalVisible(false)}
          onSuccess={fetchData}
          account={selectedAccount}
        />

        {/* Card Options */}
        <CardOptionsModal
          visible={optionsVisible}
          onClose={() => setOptionsVisible(false)}
          onEdit={() => {
            setEditAccountModalVisible(true);
            setOptionsVisible(false);
          }}
          onDelete={() =>
            handleDelete(selectedAccount, setAccounts, setOptionsVisible)
          }
        />

        {/* Header */}
        <Text className="text-light-100 text-2xl font-bold mt-4 mb-2">
          Your Balance
        </Text>
        <Text className="text-light-300 mb-6">
          Track and manage all your accounts in one place.
        </Text>

        {/* Total Balance Card */}
        <View className="items-center mb-6">
          <TotalCard amount={total} />
        </View>

        {/* Storage Accounts */}
        <View className="mb-8">
          <Text className="text-light-200 text-lg font-semibold mb-3">
            Storage Accounts
          </Text>
          <View className="flex-row justify-center gap-4 items-center flex-wrap">
            {accounts.map((account) => (
              <StorageCard
                key={account.id}
                account={account}
                onLongPress={() =>
                  handleLongPress(
                    account,
                    setSelectedAccount,
                    setOptionsVisible
                  )
                }
              />
            ))}
            <AddCard onPress={() => setModalVisible(true)} />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="mb-8">
          <Text className="text-light-200 text-lg font-semibold mb-3">
            Recent Transactions
          </Text>
          {recentTransactions.length > 0 ? (
            <View className="bg-secondary rounded-xl p-4 space-y-4 shadow-md shadow-black/20">
              {recentTransactions.map((recentTransaction) => (
                <TransactionCard
                  key={recentTransaction.id}
                  recentTransaction={recentTransaction}
                />
              ))}
            </View>
          ) : (
            <Text className="text-muted-100 italic">
              No transactions found.
            </Text>
          )}
        </View>

        {/* Line Chart for Monthly Spending */}
        <View>
          <GraphDropdown
            value={selectedPeriod}
            setValue={setSelectedPeriod}
          />
          {labels.length > 0 && values.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-z-40">
              <LineChart
                data={{
                  labels: labels,
                  datasets: [{ data: values, strokeWidth: 2 }],
                }}
                width={Math.max(labels.length * 80, screenWidth)}
                height={220}
                chartConfig={{
                  backgroundColor: "#0f0d23",
                  backgroundGradientFrom: "#0f0d23",
                  backgroundGradientTo: "#0f0d23",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(171, 139, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                bezier
                style={{
                  borderRadius: 16,
                  marginVertical: 8,
                }}
              />
            </ScrollView>
          ) : (
            <Text className="text-muted-100 italic mt-2">
              Not enough data to display chart.
            </Text>
          )}

        </View>


        {/* Reset Button */}
        <TouchableOpacity
          onPress={handleReset}
          className="bg-error px-5 py-3 rounded-xl self-center"
        >
          <Text className="text-white font-semibold">Reset Database</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
