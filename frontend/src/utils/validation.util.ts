export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const isRequired = (value: string) => {
  return value.trim().length > 0;
};

export const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isValidPhone = (value: string) => {
  return /^\+?[0-9\s-]{7,15}$/.test(value.trim());
};

export const isValidZipCode = (value: string) => {
  return /^[a-zA-Z0-9\s-]{3,10}$/.test(value.trim());
};

export const hasEmptyFields = (values: string[]) => {
  return values.some((value) => !isRequired(value));
};

export const hasFormErrors = <T extends string>(errors: FieldErrors<T>) => {
  return Object.values(errors).some(Boolean);
};

export const getFirstError = <T extends string>(errors: FieldErrors<T>) => {
  return Object.values(errors).find(Boolean) ?? null;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Ocurrió un error inesperado."
) => {
  if (error && typeof error === "object") {
    const possibleError = error as {
      message?: unknown;
      data?: unknown;
    };

    if (possibleError.data && typeof possibleError.data === "object") {
      const data = possibleError.data as Record<string, unknown>;

      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }

    if (typeof possibleError.message === "string") {
      return possibleError.message;
    }
  }

  return fallback;
};

/* =========================
   Checkout
========================= */

export type CheckoutField =
  | "firstName"
  | "lastName"
  | "streetAddress"
  | "city"
  | "state"
  | "zipCode"
  | "mobile"
  | "cardholderName"
  | "cardNumber";

export interface CheckoutValidationInput {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
  cardholderName: string;
  cardNumber: string;
}

export const validateCheckoutForm = (
  form: CheckoutValidationInput
): FieldErrors<CheckoutField> => {
  const errors: FieldErrors<CheckoutField> = {};

  if (!isRequired(form.firstName)) {
    errors.firstName = "El nombre es obligatorio.";
  }

  if (!isRequired(form.lastName)) {
    errors.lastName = "El apellido es obligatorio.";
  }

  if (!isRequired(form.streetAddress)) {
    errors.streetAddress = "La dirección es obligatoria.";
  }

  if (!isRequired(form.city)) {
    errors.city = "La ciudad es obligatoria.";
  }

  if (!isRequired(form.state)) {
    errors.state = "El departamento/estado es obligatorio.";
  }

  if (!isValidZipCode(form.zipCode)) {
    errors.zipCode = "Ingresa un código postal válido.";
  }

  if (!isValidPhone(form.mobile)) {
    errors.mobile = "Ingresa un teléfono válido.";
  }

  if (!isRequired(form.cardholderName)) {
    errors.cardholderName = "El titular de la tarjeta es obligatorio.";
  }

  const cardDigits = form.cardNumber.replace(/\s/g, "");

  if (!/^\d{13,19}$/.test(cardDigits)) {
    errors.cardNumber = "El número de tarjeta debe tener entre 13 y 19 dígitos.";
  }

  return errors;
};

/* =========================
   Perfil
========================= */

export type ProfileField =
  | "firstName"
  | "lastName"
  | "mobile"
  | "streetAddress"
  | "city"
  | "state"
  | "zipCode";

export interface ProfileValidationInput {
  firstName: string;
  lastName: string;
  mobile: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export const validateProfileForm = (
  form: ProfileValidationInput
): FieldErrors<ProfileField> => {
  const errors: FieldErrors<ProfileField> = {};

  if (!isRequired(form.firstName)) {
    errors.firstName = "El nombre es obligatorio.";
  }

  if (!isRequired(form.lastName)) {
    errors.lastName = "El apellido es obligatorio.";
  }

  if (!isValidPhone(form.mobile)) {
    errors.mobile = "Ingresa un teléfono válido.";
  }

  if (!isRequired(form.streetAddress)) {
    errors.streetAddress = "La dirección es obligatoria.";
  }

  if (!isRequired(form.city)) {
    errors.city = "La ciudad es obligatoria.";
  }

  if (!isRequired(form.state)) {
    errors.state = "El departamento/estado es obligatorio.";
  }

  if (!isValidZipCode(form.zipCode)) {
    errors.zipCode = "Ingresa un código postal válido.";
  }

  return errors;
};

/* =========================
   Productos Admin
========================= */

export type ProductField =
  | "title"
  | "description"
  | "price"
  | "discountedPrice"
  | "discountPersent"
  | "quantity"
  | "brand"
  | "color"
  | "imageUrl"
  | "topLevelCategory"
  | "secondLevelCategory"
  | "thirdLevelCategory"
  | "sizes";

export interface SizeValidationInput {
  name: string;
  quantity: string;
}

export interface ProductValidationInput {
  title: string;
  description: string;
  price: string;
  discountedPrice: string;
  discountPersent: string;
  quantity: string;
  brand: string;
  color: string;
  imageUrl: string;
  topLevelCategory?: string;
  secondLevelCategory?: string;
  thirdLevelCategory?: string;
  sizes?: SizeValidationInput[];
}

interface ProductValidationOptions {
  requireCategories?: boolean;
}

export const validateProductForm = (
  form: ProductValidationInput,
  options: ProductValidationOptions = { requireCategories: true }
): FieldErrors<ProductField> => {
  const errors: FieldErrors<ProductField> = {};

  if (!isRequired(form.title)) {
    errors.title = "El título es obligatorio.";
  }

  if (!isRequired(form.description)) {
    errors.description = "La descripción es obligatoria.";
  }

  if (!isRequired(form.brand)) {
    errors.brand = "La marca es obligatoria.";
  }

  if (!isRequired(form.color)) {
    errors.color = "El color es obligatorio.";
  }

  if (!isRequired(form.imageUrl)) {
    errors.imageUrl = "La imagen es obligatoria.";
  }

  if (options.requireCategories) {
    if (!isRequired(form.topLevelCategory ?? "")) {
      errors.topLevelCategory = "La categoría principal es obligatoria.";
    }

    if (!isRequired(form.secondLevelCategory ?? "")) {
      errors.secondLevelCategory = "La subcategoría es obligatoria.";
    }

    if (!isRequired(form.thirdLevelCategory ?? "")) {
      errors.thirdLevelCategory = "La tercera categoría es obligatoria.";
    }
  }

  const price = Number(form.price);
  const discountedPrice = Number(form.discountedPrice);
  const discountPersent = Number(form.discountPersent);
  const quantity = Number(form.quantity);

  if (Number.isNaN(price) || price <= 0) {
    errors.price = "El precio debe ser mayor a 0.";
  }

  if (Number.isNaN(discountedPrice) || discountedPrice < 0) {
    errors.discountedPrice = "El precio con descuento no es válido.";
  }

  if (
    !Number.isNaN(price) &&
    !Number.isNaN(discountedPrice) &&
    discountedPrice > price
  ) {
    errors.discountedPrice =
      "El precio con descuento no puede ser mayor al precio normal.";
  }

  if (
    Number.isNaN(discountPersent) ||
    discountPersent < 0 ||
    discountPersent > 100
  ) {
    errors.discountPersent = "El descuento debe estar entre 0 y 100.";
  }

  if (Number.isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
    errors.quantity = "El stock debe ser un número entero mayor o igual a 0.";
  }

  const validSizes = (form.sizes ?? []).filter((size) => {
    const sizeQuantity = Number(size.quantity);

    return (
      isRequired(size.name) &&
      !Number.isNaN(sizeQuantity) &&
      sizeQuantity >= 0 &&
      Number.isInteger(sizeQuantity)
    );
  });

  if (validSizes.length === 0) {
    errors.sizes = "Agrega al menos una talla válida con cantidad mayor o igual a 0.";
  }

  return errors;
};