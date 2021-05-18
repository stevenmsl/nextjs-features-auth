export interface User {
  email: string;
  password: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
}
