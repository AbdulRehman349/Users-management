import { TokenRes } from "@/lib/types";
import { ClassValue, clsx } from "clsx";
import Cookies from 'js-cookie';
import { twMerge } from "tailwind-merge";

export const mergeClasses = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};
export const getAbsolutePath = (relativePath: string) => {
    return `${process.env.NEXT_PUBLIC_CLIENT_PATH}${relativePath}`;
};

export const setAuthCookie = (authToken: TokenRes) => {
    Cookies.set('auth', JSON.stringify(authToken), {
        expires: 10000,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: process.env.NODE_ENV === 'production',
    });
};

export const getAuthCookie = (): string | null => {
    return Cookies.get('auth') || null
};

export const removeAuthCookie = () => {
    Cookies.remove('auth');
};

export const settlePromises = async (allPromises: Promise<any>[]) => {
    const results = await Promise.allSettled(allPromises);
    return results.map((result) => (result.status === "fulfilled" ? result.value : null));
};

export const checkError = (data: any[]) => {
    let error = null;
    data.forEach((eachDataSet) => {
        if (eachDataSet?.error !== undefined) {
            error = eachDataSet.error;
        }
    });
    return error;
};