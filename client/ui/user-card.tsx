'use client'

import { AuthApi } from '@/lib/api/auth.api';
import { ProfileType } from '@/lib/types';
import { checkError, getAuthCookie, removeAuthCookie, setAuthCookie } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const initialState: ProfileType = {
    _id: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    middleName: '',
}

const UserCard = () => {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<ProfileType>(initialState)

    useEffect(() => {
        const fetchUserData = () => {
            const auth = JSON.parse(getAuthCookie() || '')
            setCurrentUser(auth?.user)
        }
        fetchUserData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCurrentUser(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleEditClick = async () => {
        const { email, firstName, lastName, phoneNumber, password, middleName } = currentUser
        const updatedUser = await AuthApi.updateUser(currentUser._id, { email, firstName, lastName, phoneNumber, password, middleName })
        const error = checkError([updatedUser])
        if (!error) {
            const updatedAuth = await AuthApi.refreshToken(currentUser._id)
            setAuthCookie(updatedAuth)
            router.refresh()

        }
    };

    const handleDeleteClick = async () => {
        const deletedUser = await AuthApi.deleteUser(currentUser._id)
        const error = checkError([deletedUser])
        if (!error) {
            removeAuthCookie()
            router.push('/')
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow">
            <div className=" flex flex-col gap-4 text-xl font-semibold">
                <input className='border' type="text" id="firstName" onChange={handleChange} value={currentUser.firstName} />
                <input className='border' type="text" id="middleName" onChange={handleChange} value={currentUser.middleName} />
                <input className='border' type="text" id="lastName" onChange={handleChange} value={currentUser.lastName} />
                <span >{currentUser.email}</span>
                <input className='border' type="text" id="phoneNumber" onChange={handleChange} value={currentUser.phoneNumber} />
            </div>
            <div className="flex gap-4 mt-2">
                <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Update
                </button>

                <button onClick={handleDeleteClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UserCard;
