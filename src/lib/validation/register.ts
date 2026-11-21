export type FieldName = "name" | "email" | "password" | "confirmPassword";
export type FormErrors = Partial<Record<FieldName, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an error message for one field, or undefined if valid. */
export const validateField = (
  field: FieldName,
  value: string,
  password = "",
): string | undefined => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Full name is required";
      return undefined;

    case "email":
      if (!value.trim()) return "Email is required";
      if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address";
      return undefined;

    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      if (!/[A-Z]/.test(value))
        return "Password must contain an uppercase letter";
      if (!/[a-z]/.test(value))
        return "Password must contain a lowercase letter";
      return undefined;

    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== password) return "Passwords do not match";
      return undefined;
  }
};

/** Validates every field and returns only the ones with errors. */
export const validateAll = (values: Record<FieldName, string>): FormErrors => {
  const errors: FormErrors = {};
  (Object.keys(values) as FieldName[]).forEach((field) => {
    const message = validateField(field, values[field], values.password);
    if (message) errors[field] = message;
  });
  return errors;
};
