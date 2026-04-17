import { Expense } from "../expencess/expence.model";
import { Payment } from "../payment/payment.model";

export class BankingService {
  static async getBankingData(year?: number, month?: number) {
    try {
      const matchStageExpense: any = {};
      const matchStagePayment: any = {};

      if (year) {
        let startDate: Date;
        let endDate: Date;

        if (month !== undefined) {
          startDate = new Date(Date.UTC(year, month - 1, 1));
          endDate = new Date(Date.UTC(year, month, 1));
        } else {
          startDate = new Date(Date.UTC(year, 0, 1));
          endDate = new Date(Date.UTC(year + 1, 0, 1));
        }

        matchStageExpense.date = { $gte: startDate, $lt: endDate };
        matchStagePayment.createdAt = { $gte: startDate, $lt: endDate };
      }

      // Fetch all matched expenses
      const expenses = await Expense.find(matchStageExpense).sort({ date: -1 });

      // Fetch all matched payments
      const payments = await Payment.find(matchStagePayment)
        .populate("userId", "name")
        .sort({ createdAt: -1 });

      // Calculate Totals
      const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      const totalIncome = payments.reduce((acc, curr) => acc + curr.amount, 0);
      const balance = totalIncome - totalExpense;

      // Expense Categories (for pie chart)
      const expensesCategoriesMap: Record<string, number> = {};
      expenses.forEach((e) => {
        if (!expensesCategoriesMap[e.category]) {
          expensesCategoriesMap[e.category] = 0;
        }
        expensesCategoriesMap[e.category] += e.amount;
      });

      const expenseCategories = Object.keys(expensesCategoriesMap).map(
        (key) => ({
          name: key,
          amount: expensesCategoriesMap[key],
        })
      );

      // Monthly Statistics (for bar chart)
      // Array of 12 elements, one for each month
      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2000, i, 1).toLocaleString('default', { month: 'short' }),
        income: 0,
        expense: 0,
      }));

      // Only populate monthly stats if we are querying for a year (no specific month), or in general all data
      if (month === undefined) {
        expenses.forEach((e) => {
          const m = new Date(e.date).getMonth();
          monthlyStats[m].expense += e.amount;
        });

        payments.forEach((p) => {
          const m = new Date(p.createdAt).getMonth();
          monthlyStats[m].income += p.amount;
        });
      }

      // Prepare Transactions List
      const transactions = [
        ...payments.map((p) => {
          const user = p.userId as any;
          return {
            id: p._id.toString(),
            title: user?.name ? `Payment from ${user.name}` : "Payment",
            date: (p as any).createdAt as Date,
            amount: p.amount,
            category: "Income",
            type: "income" as const,
            status: "Completed",
          };
        }),
        ...expenses.map((e) => ({
          id: e._id.toString(),
          title: e.title,
          date: e.date as Date,
          amount: e.amount,
          category: e.category as string,
          type: "expense" as const,
          status: "Completed",
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        totals: {
          totalIncome,
          totalExpense,
          balance,
        },
        expenseCategories,
        monthlyStats,
        transactions,
      };
    } catch (error) {
      throw error;
    }
  }
}
