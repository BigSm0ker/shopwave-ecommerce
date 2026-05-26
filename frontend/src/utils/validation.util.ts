export const isRequired = (value: string) => {
  return value.trim().length > 0;
};

export const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const hasEmptyFields = (values: string[]) => {
  return values.some((value) => !isRequired(value));
};
