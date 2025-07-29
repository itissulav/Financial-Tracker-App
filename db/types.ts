import { Ionicons } from "@expo/vector-icons";

// database/types.ts
export type Account = {
  id: number;
  name: string;
  icon: string;
  balance: number;
};

export type Transaction = {
  id: number;
  account_id: number;
  type: 'credit' | 'debit';
  category: string;
  note: string;
  amount: number;
  created_at: string;
};

export type TopSpendingCategory = {
  category_id: number;
  category_name: string;
  category_icon: IoniconName; 
  total: number;
};


export type InsertTransactionInput = {
  account_id: number;
  type: "credit" | "debit";
  amount: number;
  category_id: number;
  note?: string;
  created_at?: string;
};


export type Category = {
  id: number;
  name: string;
  icon: string;
};

export type TransactionWithCategory = {
  id: number;
  amount: number;
  note: string | null;
  type: "credit" | "debit";
  created_at: string; // ISO timestamp
  category_name: string;
  category_icon: string;
};

type IoniconName = keyof typeof Ionicons.glyphMap;
