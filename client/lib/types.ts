export type HeadersType = {
  Authorization: string;
  'Content-Type': string;
};

export type SignupPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type ProfileType = {
  _id: string
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password?: string;
}

export type TokenRes = {
  createdOn: string;
  expires: string;
  expiresPrettyPrint: string;
  token: string;
}
export type LoginResponse = TokenRes

export type SignupResponse = TokenRes