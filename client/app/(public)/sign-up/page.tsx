'use client'

import { AuthApi } from '@/lib/api/auth.api';
import { ProfileType } from '@/lib/types';
import { checkError, setAuthCookie } from '@/utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';

type FormState = Omit<ProfileType, '_id'> & {
  confirmPassword: string,
  showPassword: boolean,
  showConfirmPassword: boolean,
}

const initialState: FormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
}

const SignUp = () => {
  const navigate= useRouter()
  const [formState, setFormState] = useState<FormState>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const toggleShowPassword = () => {
    setFormState(prevState => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const toggleShowConfirmPassword = () => {
    setFormState(prevState => ({
      ...prevState,
      showConfirmPassword: !prevState.showConfirmPassword,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { showPassword, showConfirmPassword, confirmPassword, ...rest } = formState
    const createdProfile = await AuthApi.registerUser(rest)
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <div>
            <label htmlFor="firstName" className="block text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formState.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="middleName" className="block text-gray-700">Middle Name</label>
            <input
              type="text"
              id="middleName"
              value={formState.middleName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formState.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={formState.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={formState.showPassword ? "text" : "password"}
                id="password"
                value={formState.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
              >
                {formState.showPassword ? <BiHide className="h-6 w-6" /> : <BiShow className="h-6 w-6" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={formState.showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
              >
                {formState.showConfirmPassword ? <BiHide className="h-6 w-6" /> : <BiShow className="h-6 w-6" />}
              </button>
            </div>
          </div>
          <Link
            href='/'
            className="cursor-pointer hover:text-blue-500 px-[6px] py-[2px] text-sm text-blue-400"
          >
            Already have account? Login-up
          </Link>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
