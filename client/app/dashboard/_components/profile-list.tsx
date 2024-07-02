'use client'

import { AuthApi } from '@/lib/api/auth.api';
import { ProfileType } from '@/lib/types';
import ProfileCard from '@/ui/profile-card';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from './pagination';

const ProfileList = () => {

    const currentSearchParams = useSearchParams();
    const query = currentSearchParams.get('query')
    const page = currentSearchParams.get('page')
    const [allUsersData, setAllUsersData] = useState<{ totalCount: number, users: ProfileType[] }>({ totalCount: 1, users: [] })

    useEffect(() => {
        const fetchAllUsers = async () => {
            const userRes = await AuthApi.getAllUsers(query || '', Number(page) || 1)
            setAllUsersData(userRes)
        }
        fetchAllUsers()
    }, [query, page])


    if (!allUsersData?.users?.length) return <div>No Users</div>
    return (
        <div className='flex flex-col gap-4'>
            {allUsersData?.users?.map((each: ProfileType) => (<ProfileCard key={each._id} profile={each} />))}

            <Pagination totalPages={Math.ceil(allUsersData?.totalCount /5)} />
        </div>
    )
}

export default ProfileList