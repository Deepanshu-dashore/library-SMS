/**
 * Aadhaar validation: format (^[2-9]\d{11}$) + Verhoeff checksum.
 * Does not verify UIDAI records — only structure and checksum.
 */

const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/** First digit 2–9, then 11 more digits */
export const AADHAAR_PATTERN = /^[2-9]\d{11}$/;

const ALL_ZEROS_AADHAAR = "000000000000";

export function isBlockedAadhaar(digits: string): boolean {
  return digits === ALL_ZEROS_AADHAAR || /^0{12}$/.test(digits);
}

/** Strip spaces and non-digits, cap at 12 */
export function parseAadhaarInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 12);
}

/** Display as `1234 5678 9012` */
export function formatAadhaarDisplay(digits: string): string {
  const raw = parseAadhaarInput(digits);
  if (raw.length <= 4) return raw;
  if (raw.length <= 8) return `${raw.slice(0, 4)} ${raw.slice(4)}`;
  return `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8)}`;
}

export function validateVerhoeff(aadhaar: string): boolean {
  if (!/^\d{12}$/.test(aadhaar)) return false;
  let c = 0;
  const reversed = aadhaar.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    const digit = parseInt(reversed[i], 10);
    if (Number.isNaN(digit)) return false;
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]];
  }
  return c === 0;
}

export function isValidAadhaar(value: string): boolean {
  const aadhaar = parseAadhaarInput(value);
  if (aadhaar.length !== 12) return false;
  if (isBlockedAadhaar(aadhaar)) return false;
  if (!AADHAAR_PATTERN.test(aadhaar)) return false;
  return validateVerhoeff(aadhaar);
}

export function getAadhaarValidationError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Aadhar number is required.";

  const aadhaar = parseAadhaarInput(value);
  if (aadhaar.length !== 12) {
    return "Aadhar number must be exactly 12 digits (e.g. 1234 5678 9012).";
  }
  if (isBlockedAadhaar(aadhaar)) {
    return "Aadhar number cannot be all zeros.";
  }
  if (!AADHAAR_PATTERN.test(aadhaar)) {
    return "Aadhar must be 12 digits and start with 2–9.";
  }
  if (!validateVerhoeff(aadhaar)) {
    return "Invalid Aadhar number. Please check the digits.";
  }
  return null;
}
