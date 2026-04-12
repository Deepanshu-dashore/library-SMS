/**
 * validators.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable field-level validators for the Library SMS forms.
 *
 * Each validator returns `null` when the value is valid, or a human-readable
 * error string when it is not. This makes them composable with any form state.
 *
 * Usage:
 *   import { validateEmail, validatePhone } from "@/app/lib/utils/validators";
 *   const err = validateEmail(formData.email);   // null | string
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Field must not be empty / whitespace. */
export function validateRequired(value: string, label = "This field"): string | null {
  return value.trim() === "" ? `${label} is required.` : null;
}

// ─── Name ─────────────────────────────────────────────────────────────────────

/**
 * Only letters, spaces, hyphens, and apostrophes.
 * Min 2 chars.
 */
export function validateName(value: string, label = "Name"): string | null {
  const req = validateRequired(value, label);
  if (req) return req;
  if (value.trim().length < 2) return `${label} must be at least 2 characters.`;
  if (!/^[A-Za-z\s'\-]+$/.test(value.trim()))
    return `${label} may only contain letters, spaces, hyphens, or apostrophes.`;
  return null;
}

// ─── Email ────────────────────────────────────────────────────────────────────

/** Standard RFC-5322-lite email check. */
export function validateEmail(value: string): string | null {
  const req = validateRequired(value, "Email");
  if (req) return req;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!pattern.test(value.trim())) return "Enter a valid email address (e.g. john@gmail.com).";
  return null;
}

// ─── Phone ────────────────────────────────────────────────────────────────────

/**
 * Accepts an optional +91 / 0 prefix followed by exactly 10 digits.
 * Strips spaces before checking.
 */
export function validatePhone(value: string, label = "Mobile number"): string | null {
  const req = validateRequired(value, label);
  if (req) return req;
  const digits = value.replace(/[\s\-]/g, "");
  const pattern = /^(\+91|0)?[6-9]\d{9}$/;
  if (!pattern.test(digits))
    return `${label} must be a valid 10-digit Indian mobile number.`;
  return null;
}

// ─── Aadhar ───────────────────────────────────────────────────────────────────

/** Exactly 12 digits, optionally formatted as XXXX XXXX XXXX. */
export function validateAadhar(value: string): string | null {
  const req = validateRequired(value, "Aadhar number");
  if (req) return req;
  const digits = value.replace(/\s/g, "");
  if (!/^\d{12}$/.test(digits))
    return "Aadhar number must be exactly 12 digits (e.g. 1234 5678 9012).";
  return null;
}

// ─── Pincode ──────────────────────────────────────────────────────────────────

/** Indian 6-digit pincode. */
export function validatePincode(value: string): string | null {
  const req = validateRequired(value, "Pincode");
  if (req) return req;
  if (!/^\d{6}$/.test(value.trim()))
    return "Pincode must be exactly 6 digits.";
  return null;
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 2;

/**
 * Validates a File object for type and size.
 *
 * @param file  The File from the input[type=file] element.
 * @param label Field label shown in the error message.
 */
export function validateImageFile(file: File, label = "Image"): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return `${label} must be a JPG, PNG, or WebP file.`;
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    return `${label} must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`;
  return null;
}

// ─── Composite: full Member form ─────────────────────────────────────────────

export interface MemberFormData {
  name: string;
  email: string;
  fatherName: string;
  motherName: string;
  dob: string;
  number: string;
  adharNumber: string;
  address: {
    detailedAddress: string;
    tehsil: string;
    district: string;
    state: string;
    pincode: string;
  };
}

export interface MemberFormErrors {
  name?: string;
  email?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  number?: string;
  adharNumber?: string;
  detailedAddress?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  signature?: string;
}

/**
 * Validates all required member-form fields at once.
 * Returns an errors object — empty means valid.
 */
export function validateMemberForm(
  data: MemberFormData,
  photoFile: File | null,
  signatureFile: File | null
): MemberFormErrors {
  const errors: MemberFormErrors = {};

  const name       = validateName(data.name, "Full name");
  const email      = validateEmail(data.email);
  const fatherName = validateName(data.fatherName, "Father's name");
  const motherName = validateName(data.motherName, "Mother's name");
  const dob        = validateRequired(data.dob, "Date of birth");
  const number     = validatePhone(data.number);
  const adhar      = validateAadhar(data.adharNumber);
  const address    = validateRequired(data.address.detailedAddress, "Detailed address");
  const tehsil     = validateRequired(data.address.tehsil, "Tehsil");
  const district   = validateRequired(data.address.district, "District");
  const state      = validateRequired(data.address.state, "State");
  const pincode    = validatePincode(data.address.pincode);

  if (name)       errors.name       = name;
  if (email)      errors.email      = email;
  if (fatherName) errors.fatherName = fatherName;
  if (motherName) errors.motherName = motherName;
  if (dob)        errors.dob        = dob;
  if (number)     errors.number     = number;
  if (adhar)      errors.adharNumber = adhar;
  if (address)    errors.detailedAddress = address;
  if (tehsil)     errors.tehsil     = tehsil;
  if (district)   errors.district   = district;
  if (state)      errors.state      = state;
  if (pincode)    errors.pincode    = pincode;

  if (photoFile) {
    const photoErr = validateImageFile(photoFile, "Member photo");
    if (photoErr) errors.photo = photoErr;
  }

  if (signatureFile) {
    const sigErr = validateImageFile(signatureFile, "Signature");
    if (sigErr) errors.signature = sigErr;
  }

  return errors;
}
