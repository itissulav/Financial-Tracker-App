// components/CategoryCard.tsx
import { TopSpendingCategory } from '@/db/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

export default function CategoryCard({
    category,
}: {
  category: TopSpendingCategory
    ;
}) {

    const icon = category.category_icon
    const name = category.category_name
    const total = category.total
    
  return (
    <View className="bg-secondary rounded-2xl shadow-md p-4 w-[48%] mb-4 items-center">
      <Ionicons name={icon} size={32} color="#38B2AC" className="mb-2" />

      <Text className="text-light-300 text-sm">{name}</Text>
      <Text className="text-light-300 text-xl">{total}</Text>
    </View>
  );
}
