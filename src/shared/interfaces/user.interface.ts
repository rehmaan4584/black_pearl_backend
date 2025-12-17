export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  userType: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}
