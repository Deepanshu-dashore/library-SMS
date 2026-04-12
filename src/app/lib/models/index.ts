/**
 * Central model registry — import this once at the top of every API route
 * handler (or in a shared db-connect helper) to guarantee all Mongoose
 * schemas are registered before any query runs.
 *
 * Usage:
 *   import "@/app/lib/models";
 */

import "../featuers/user/user.model";
import "../featuers/seat/seats.model";
import "../featuers/subscription/subscription.model";
import "../featuers/payment/payment.model";
