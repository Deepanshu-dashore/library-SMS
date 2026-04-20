import mongoose from "mongoose";
import { connectDB } from "../../db/connectDB";
import { User } from "../user/user.model";
import { Subscription } from "../subscription/subscription.model";
import { Seat } from "../seat/seats.model";
import { Payment } from "../payment/payment.model";
import { Expense } from "../expencess/expence.model";

export class DashboardService {
  static async getDashbordData(params: any) {
    let StateCards = {
      totalMembers: Number(0),
      totalActiveSubscriptions: Number(0),
      totalOccupiedSeats: Number(0),
      totalAvailableSeats: Number(0),
      totalRevenue: Number(0), //Paymnet total
      totalMonthlyRevenue: Number(0), //revenue total
      totalExpenses: Number(0),
      totalMonthlyExpenses: Number(0),
      ExpiringSoon: Number(0),
      pendingRenewals: Number(0),
    };

    let FloorWishSeats: any = {};
    let Alerts: any = {};
    let BalanceSheet: any = [];
    let liveActivity: any = {
      recentRegistrations: [],
      recentPayments: [],
      recentSeatAllocation: [],
    };
    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      //--------------STATE_CARDS----------------------------
      StateCards.totalMembers = await User.countDocuments({}).session(session);
      StateCards.totalActiveSubscriptions = await Subscription.countDocuments({
        status: "active",
        endDate: { $gte: new Date() },
      }).session(session);
      StateCards.totalOccupiedSeats = await Seat.countDocuments({
        status: "occupied",
      }).session(session);
      StateCards.totalAvailableSeats = await Seat.countDocuments({
        status: "available",
      }).session(session);
      StateCards.totalRevenue =
        (
          await Payment.aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]).session(session)
        )[0]?.total || 0;
      StateCards.totalExpenses =
        (
          await Expense.aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]).session(session)
        )[0]?.total || 0;
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      StateCards.totalMonthlyRevenue =
        (
          await Payment.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: startOfMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]).session(session)
        )[0]?.total || 0;
      StateCards.totalMonthlyExpenses =
        (
          await Expense.aggregate([
            {
              $match: {
                date: {
                  $gte: startOfMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]).session(session)
        )[0]?.total || 0;
      StateCards.pendingRenewals = await Subscription.countDocuments({
        endDate: { $lt: new Date() },
        status: "active",
      }).session(session);
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      StateCards.ExpiringSoon = await Subscription.countDocuments({
        endDate: { $lt: sevenDaysFromNow },
        status: "active",
      }).session(session);

      //--------------Graphs----------------------------
      const SetsFloorWishTotals = await Seat.aggregate([
        {
          $match: {
            status: "$status",
          },
        },
        {
          $group: {
            _id: "$floor",
            total: { $sum: 1 },
          },
        },
      ]).session(session);
      const Sets = await Seat.find({}).lean().session(session);
      FloorWishSeats = {
        SetsFloorWishTotals,
        Sets,
        totalSets: Sets.length,
        totalOccupiedSeats: StateCards.totalOccupiedSeats,
        totalAvailableSeats: StateCards.totalAvailableSeats,
      };
      //--------------Alerts----------------------------
      const ExpiringToday = await Subscription.countDocuments({
        endDate: { $lt: new Date() },
        status: "active",
      }).session(session);
      const usersWithoutSeat = await User.aggregate([
        {
          $lookup: {
            from: "subscriptions",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$userId", "$$userId"] },
                  status: "active",
                  endDate: { $gte: new Date() },
                },
              },
            ],
            as: "activeSubscriptions",
          },
        },
        {
          $match: {
            activeSubscriptions: { $size: 0 },
          },
        },
      ]).session(session);
      const UnverifiedUsers = await User.countDocuments({
        status: "Unverify",
      }).session(session);
      Alerts = {
        ExpiringToday: ExpiringToday,
        ExpiringSoon: StateCards.ExpiringSoon,
        PendingRenewals: StateCards.pendingRenewals,
        UnassignedSeats: usersWithoutSeat.length,
        UnverifiedUsers: UnverifiedUsers,
      };

      //--------------Live Activity----------------------------
      liveActivity.recentRegistrations = await User.find({})
        .sort({ createdAt: -1 })
        .select("createdAt name email")
        .limit(5)
        .session(session);
      liveActivity.recentPayments = await Payment.find({})
        .sort({ createdAt: -1 })
        .select("createdAt amount paymentMode userId")
        .populate("userId", "name")
        .limit(5)
        .session(session);
      liveActivity.recentSeatAllocation = await Seat.find({})
        .sort({ updatedAt: -1 })
        .select("updatedAt seatNumber type floor")
        .limit(5)
        .session(session);

      //--------------Balance Sheet----------------------------
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
      const endOfYear = new Date(Date.UTC(currentYear + 1, 0, 1));

      const paymentsOfYear = await Payment.find({
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      }).session(session);

      const expensesOfYear = await Expense.find({
        date: { $gte: startOfYear, $lt: endOfYear },
      }).session(session);

      BalanceSheet = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2000, i, 1).toLocaleString("default", {
          month: "short",
        }),
        income: 0,
        expense: 0,
      }));

      paymentsOfYear.forEach((p) => {
        const m = new Date(p.createdAt).getMonth();
        BalanceSheet[m].income += p.amount;
      });

      expensesOfYear.forEach((e) => {
        const m = new Date(e.date).getMonth();
        BalanceSheet[m].expense += e.amount;
      });

      await session.commitTransaction();
      session.endSession();
      return {
        StateCards,
        FloorWishSeats,
        Alerts,
        BalanceSheet,
        liveActivity,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
