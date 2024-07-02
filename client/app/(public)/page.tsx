'use client'

import { AuthApi } from "@/lib/api/auth.api";
import { checkError, setAuthCookie } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";


export default function Home() {
  const navigate= useRouter()

  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const { id: target, value } = e.target;

    setFormValues({
      ...formValues,
      [target]: value,
    });
  };


  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createdProfile = await AuthApi.loginUser(formValues)
    const error=checkError([createdProfile])
    if(error){
      //sdasdsa
      return
    }

    setAuthCookie(createdProfile)
    navigate.replace('/dashboard')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formValues.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <BiHide className="h-6 w-6" /> : <BiShow className="h-6 w-6" />}
              </button>
            </div>
          </div>
          <Link
            href='/sign-up'
            className="cursor-pointer hover:text-blue-500 px-[6px] py-[2px] text-sm text-blue-400"
          >
            Don't have account? Sign-up
          </Link>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
