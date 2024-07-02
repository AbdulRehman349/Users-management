'use client'
import { removeAuthCookie } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const Header = () => {
    const router = useRouter()
    const handleDeleteClick = async () => {
        removeAuthCookie()
        router.push('/')
    };
    return (
        <div className='w-full h-16 flex justify-end bg-black text-white'>
            <button onClick={handleDeleteClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Logout
            </button>
        </div>
    )
}

export default Header