// database/transactions.ts
import { getDatabase } from './index';
import { Category, InsertTransactionInput } from './types';

export const getAllTransactions = async () => {
  const db = await getDatabase();
  return await db.getAllAsync(`
    SELECT transactions.*, accounts.name AS account_name
    FROM transactions
    LEFT JOIN accounts ON transactions.account_id = accounts.id
    ORDER BY created_at DESC
  `);
};


export const insertTransaction = async (tx: InsertTransactionInput) => {
  const db = await getDatabase();

  await db.runAsync(
    `
    INSERT INTO transactions (account_id, type, amount, category_id, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    tx.account_id,
    tx.type,
    tx.amount,
    tx.category_id,
    tx.note ?? '',
    tx.created_at ?? new Date().toISOString()
  );
};


export const deleteTransaction = async (id: number) => {
  const db = await getDatabase();
  return await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
};

export const getRecentTransactions = async () => {
  const db = await getDatabase();

  const transactions = await db.getAllAsync(`
    SELECT 
      transactions.id,
      transactions.amount,
      transactions.note,
      transactions.type,
      transactions.created_at,
      categories.name as category_name,
      categories.icon as category_icon
    FROM transactions
    JOIN categories ON transactions.category_id = categories.id
    ORDER BY transactions.created_at DESC
    LIMIT 3
  `);

  return transactions;
};

export const getTransactionsByAccount = async (accountId: number) => {
  const db = await getDatabase();

  const transactions = await db.getAllAsync(`
    SELECT 
      transactions.id,
      transactions.amount,
      transactions.note,
      transactions.type,
      transactions.created_at,
      categories.name as category_name,
      categories.icon as category_icon
    FROM transactions
    JOIN categories ON transactions.category_id = categories.id
    WHERE transactions.account_id = ?
    ORDER BY transactions.created_at DESC
  `, [accountId]);

  return transactions;
};



export const getTopSpendingCategories = async () => {
  const db = await getDatabase();
  const results = await db.getAllAsync(
    `
    SELECT 
      c.id AS category_id,
      c.name AS category_name,
      c.icon AS category_icon,
      SUM(t.amount) AS total
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'debit' 
      AND t.created_at >= datetime('now', '-30 days')
    GROUP BY c.id, c.name, c.icon
    ORDER BY total DESC
    LIMIT 5;
    `
  );

  return results; // [{ category: 'Groceries', total: 4500 }, ...]
};

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDatabase();

  const results = await db.getAllAsync(`
    SELECT id, name, icon
    FROM categories
    ORDER BY name COLLATE NOCASE ASC
  `);

  // Depending on your db wrapper, `results` might be an array of objects
  // If using better-sqlite3, this returns rows as objects directly
  return results as Category[];
}

export const insertCategory = async (category: { name: string; icon: string }): Promise<boolean> => {
  const db = await getDatabase();

  try {
    await db.runAsync(
      `
      INSERT INTO categories (name, icon)
      VALUES (?, ?);
      `,
      category.name,
      category.icon
    );
    return true; // Success
  } catch (error) {
    console.error("Failed to insert category:", error);
    return false; // Failure
  }
};

export type MonthlyExpense = {
  month: string; // 'YYYY-MM'
  total_spent: number;
};

export const getMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  const db = await getDatabase();

  const query = `
    SELECT 
      strftime('%Y-%m', created_at) AS month,
      SUM(amount) AS total_spent
    FROM transactions
    WHERE type = 'debit'  -- filter only spending
    GROUP BY month
    ORDER BY month ASC;
  `;

  const result = await db.getAllAsync<MonthlyExpense>(query);

  // Optionally convert totals to number if needed (SQLite can return strings)
  return result.map(row => ({
    month: row.month,
    total_spent: Number(row.total_spent),
  }));
};

export const getDailyExpensesForMonth = async (yearMonth: string): Promise<DailyExpense[]> => {
  const db = await getDatabase();

  const query = `
    SELECT 
      strftime('%Y-%m-%d', created_at) AS day,
      SUM(amount) AS total_spent
    FROM transactions
    WHERE type = 'debit' 
      AND strftime('%Y-%m', created_at) = ?
    GROUP BY day
    ORDER BY day ASC;
  `;

  const result = await db.getAllAsync(query, [yearMonth]);
  return result.map((row: any) => ({
    day: row.day,
    total_spent: row.total_spent,
  }));
};

export type DailyExpense = {
  day: string; // e.g., '2025-07-27'
  total_spent: number;
};

export const getWeeklyExpensesForYear = async (year: string): Promise<WeeklyExpense[]> => {
  const db = await getDatabase();

  const query = `
    SELECT 
      strftime('%Y-W%W', created_at) AS week,
      SUM(amount) AS total_spent
    FROM transactions
    WHERE type = 'debit'
      AND strftime('%Y', created_at) = ?
    GROUP BY week
    ORDER BY week ASC;
  `;

  const result = await db.getAllAsync(query, [year]);
  return result.map((row: any) => ({
    week: row.week,
    total_spent: row.total_spent,
  }));
};

export type WeeklyExpense = {
  week: string; // e.g., '2025-W30'
  total_spent: number;
};

