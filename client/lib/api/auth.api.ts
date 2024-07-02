import { HTTP_METHODS } from "@/utils/constants";
import { sendRequest } from "@/utils/request-service";
import { LoginPayload, ProfileType, SignupPayload, SignupResponse, TokenRes } from "../types";


const API_REQUESTS = {
  SIGN_IN: {
    path: '/auth/login',
    method: HTTP_METHODS.POST,
  },
  SIGN_UP: {
    path: '/auth/register',
    method: HTTP_METHODS.POST,
  },
  SEARCH_USERS: {
    path: '/user',
    method: HTTP_METHODS.GET,
  },
  GET_ALL_USERS: {
    path: '/user',
    method: HTTP_METHODS.GET,
  },
  UPDATE_USER: {
    path: '/user',
    method: HTTP_METHODS.PATCH,
  },
  DELETE_USER: {
    path: '/user',
    method: HTTP_METHODS.DELETE,
  },
  REFRESH_TOKEN: {
    path: '/auth/refresh',
    method: HTTP_METHODS.POST,
  },

};


const AuthApi = {
  loginUser: async (body: LoginPayload): Promise<any> => {
    return await sendRequest(API_REQUESTS.SIGN_IN.method, API_REQUESTS.SIGN_IN.path, body);
  },
  registerUser: async (body: SignupPayload): Promise<SignupResponse> => {
    return await sendRequest(API_REQUESTS.SIGN_UP.method, API_REQUESTS.SIGN_UP.path, body);
  },
  getAllUsers: async (query: string, page: number): Promise<{ totalCount: number, users: ProfileType[] }> => {
    return await sendRequest(API_REQUESTS.GET_ALL_USERS.method, `${API_REQUESTS.GET_ALL_USERS.path}?query=${query}&page=${page}`);
  },
  updateUser: async (id: string, body: Partial<ProfileType>): Promise<ProfileType> => {
    return await sendRequest(API_REQUESTS.UPDATE_USER.method, `${API_REQUESTS.UPDATE_USER.path}/${id}`, body);
  },
  deleteUser: async (id: string): Promise<ProfileType> => {
    return await sendRequest(API_REQUESTS.DELETE_USER.method, `${API_REQUESTS.DELETE_USER.path}/${id}`);
  },
  refreshToken: async (userId: string): Promise<TokenRes> => {
    return await sendRequest(API_REQUESTS.REFRESH_TOKEN.method, `${API_REQUESTS.REFRESH_TOKEN.path}`, { userId });
  },
};

export { AuthApi };