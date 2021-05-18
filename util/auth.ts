import { hash, compare } from "bcryptjs";

export const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedpassword: string
) => {
  const isValid = compare(password, hashedpassword);
  return isValid;
};
