'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const pathname = usePathname()
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const handleSearch = () => {
        // Set the search query to the URL query parameters

        const updatedSearchParams = new URLSearchParams(currentSearchParams.toString())
        updatedSearchParams.set("query", query)
      
        router.push(pathname + "?" + updatedSearchParams.toString())
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <div className="flex items-center">
            <form onSubmit={handleSubmit} className="flex items-center w-full">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchComponent;
