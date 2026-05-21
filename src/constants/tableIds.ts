/** Keys for persisted DataTable state (sessionStorage). */
export const TABLE_IDS = {
  USERS: "users",
  SUBSCRIPTIONS: "subscriptions",
  PAYMENTS: "payments",
  TRASH: "trash",
  EXPENSES: "expenses",
  BANKING: "banking",
} as const;

export type TableId = (typeof TABLE_IDS)[keyof typeof TABLE_IDS];
