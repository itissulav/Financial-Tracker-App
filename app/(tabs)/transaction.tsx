import AddEntryModal from '@/components/AddEntryModal';
import CategoryCard from '@/components/CategoryCard';
import TransactionCard from '@/components/TransactionCard'; // <-- your card UI
import TransactionFilter from '@/components/TransactionFilter';
import { initDatabase } from '@/db';
import { getAllAccounts } from '@/db/accounts';
import { getAllCategories, getTopSpendingCategories, getTransactionsByAccount } from '@/db/transactions';
import { Account, Category, TopSpendingCategory, TransactionWithCategory } from '@/db/types';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };
type Route = {
  key: string;
  title: string;
};


export default function TransactionView() {
  const [topCategories, setTopSpendingCategories] = useState<TopSpendingCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [addEntryModalVisible, setAddEntryModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<any[]>([]);
  const [transactionByFilter, settransactionByFilter] = useState<{ [key: string]: TransactionWithCategory[] }>({});
  const [transactionFilterVisible, setTransactionFilterVisible] = useState(false);



  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleFilters = (filters: {
    category: string | null;
    type: "debit" | "credit" | null;
    dateRange: "week" | "month" | "6months" | null;
  }) => {

    setTransactionFilterVisible(false)
    // Use filters to fetch or filter transactions here
  };


  const fetchData = async () => {
    await initDatabase();

    const accounts: Account[] = await getAllAccounts() as Account[];
    setAccounts(accounts as Account[]);

    const topCategories = await getTopSpendingCategories();
    setTopSpendingCategories(topCategories as TopSpendingCategory[]);

    for(const topCategory of topCategories as TopSpendingCategory[]){
      console.log("Top Category Name: ", topCategory.category_name)
    }

    const categories = await getAllCategories();
    setCategories(categories);

    const transactionsMap: { [key: string]: TransactionWithCategory[] } = {};
    const routesList: any[] = [];

    for (const account of accounts) {
      const txns = await getTransactionsByAccount(account.id) as TransactionWithCategory[];
      transactionsMap[account.id] = txns;
      routesList.push({ key: String(account.id), title: account.name });
    }

    settransactionByFilter(transactionsMap);
    setRoutes(routesList);

  };

const renderScene = ({ route }: { route: { key: string; title: string } }) => {
  const transactions = transactionByFilter[route.key] || [];

  return (
    <ScrollView className="pt-4 gap-3">
      {transactions.length > 0 ? (
        transactions.map((txn) => (
          <TransactionCard key={txn.id} recentTransaction={txn} />
        ))
      ) : (
        <Text className="text-muted-100 italic px-2">No transactions yet.</Text>
      )}
    </ScrollView>
  );
};



  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#AB8BFF']}
            tintColor="#AB8BFF"
          />
        }
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className='gap-4'>
          {/* Modal for Adding Entry */}
          <AddEntryModal
            visible={addEntryModalVisible}
            onClose={() => setAddEntryModalVisible(false)}
            onSuccess={fetchData}
            accounts={accounts}
            categories={categories}
          />

          <TransactionFilter
            categories={categories}
            visible = {transactionFilterVisible}
            onApply ={(filters) => handleFilters(filters)}
          />

          {/* Header */}
          <Text className="text-light-100 text-2xl font-bold mb-2 mt-4">
            Transactions Overview
          </Text>
          <Text className="text-light-300 mb-6">
            Track where your money is going based on top spending categories.
          </Text>

          {/* Top Categories */}
          <View>
            <Text className="text-light-200 text-lg font-semibold mb-3">
              Top Spending Categories
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {topCategories.length > 0 ? (
                topCategories.map((cat) => (
                  <CategoryCard
                    key={cat.category_name}
                    category={cat as TopSpendingCategory}
                  />
                ))
              ) : (
                <Text className="text-muted-100 italic">No transactions yet.</Text>
              )}
            </View>
          </View>

          {/* Add New Button */}
          <TouchableOpacity
            onPress={() => setAddEntryModalVisible(true)}
            className="bg-accent px-6 py-4 rounded-2xl self-start shadow-md"
          >
            <Text className="text-white text-base font-semibold">+ New Entry</Text>
          </TouchableOpacity>

          <View className='mb-6'> 
            <View className='flex-row justify-between items-center pr-2'>
              <Text className='text-light-200 text-lg font-semibold mb-3'>Transactions by Account</Text>

              <TouchableOpacity 
                onPress={() => {setTransactionFilterVisible(true)}}
                className='bg-accent px-6 py-2 rounded-2xl self-start shadow-md'
              >
                <Text className='text-white text-base font-semibold'>Filter</Text>
              </TouchableOpacity>

            </View>            
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                style = {{height : 400}}
                renderTabBar={({navigationState, jumpTo}) => (
                  <View className="flex-row gap-3 mb-3">
                    {navigationState.routes.map((route, i) => (
                      <TouchableOpacity
                        key={route.key}
                        onPress={() => jumpTo(route.key)}
                        className={`px-4 py-2 rounded-full ${
                          index === i ? 'bg-accent' : 'bg-muted-200'
                        }`}
                      >
                        <Text
                          className={`${
                            index === i ? 'text-white' : 'text-light-300'
                          } text-sm font-medium`}
                        >
                          {route.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
