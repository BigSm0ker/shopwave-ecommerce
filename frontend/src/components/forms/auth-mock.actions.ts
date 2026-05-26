import type { SigninCredentials, SignupRequest } from "@/models/auth.model";

const AUTH_MOCK_DELAY = 900;

const wait = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const simulateSignin = async (credentials: SigninCredentials) => {
  await wait(AUTH_MOCK_DELAY);

  return {
    email: credentials.email,
  };
};

export const simulateSignup = async (data: SignupRequest) => {
  await wait(AUTH_MOCK_DELAY);

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    mobile: data.mobile,
  };
};
