'use server';
import { cookies } from 'next/headers';
import { HeadersType, TokenRes } from '../lib/types';
import { HTTP_METHODS, SERVER_BASE_URL } from './constants';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const fetchCookieToken = () => {
  const auth = cookies().get('auth') as RequestCookie
  if (!auth || !auth?.value?.length) console.error('Auth cookie not found');
  else{
    const parsedAuth = JSON.parse(auth?.value || '')
    return parsedAuth?.backendTokens?.token;
  }
};

export const sendRequest = async (
  method: HTTP_METHODS,
  path: string,
  data?: any,
) => {
  try {
    const cookieToken = fetchCookieToken()
    const headers: HeadersType = {
      Authorization: `Bearer ${cookieToken}`,
      'Content-Type': 'application/json'
    };

    const requestOptions: RequestInit = {
      method: method,
      headers: headers,
      cache: 'no-store',
      body: JSON.stringify(data)
    };
    const res = await fetch(`${SERVER_BASE_URL}${path}`, requestOptions);
    const response = await res.json();
    if (!response?.result) {
      return { error: response.message };
    }
    return response.result.at(0);
  } catch (error) {
    throw error;
  }
};