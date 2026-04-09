/**
 * Generates a unique receipt number for payments.
 * Format: REC-YYYYMMDD-XXXX where XXXX is a random alphanumeric string.
 */
export const generateReceiptNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REC-${dateStr}-${randomStr}`;
};
