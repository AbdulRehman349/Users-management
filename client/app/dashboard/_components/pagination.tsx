'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
    const router = useRouter();
    const pathname = usePathname()
    const currentSearchParams = useSearchParams();

    const currentPage = Number(currentSearchParams.get('page') || "1")

    const goToPage = (page: number) => {
        const updatedSearchParams = new URLSearchParams(currentSearchParams.toString())
        updatedSearchParams.set("page", page.toString() || "1")

        router.push(pathname + "?" + updatedSearchParams.toString())
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i}>
                    <button
                        className={`px-3 py-1 mx-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                            } rounded-lg`}
                        onClick={() => goToPage(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <nav className="flex justify-center my-4">
            <ul className="flex">
                <li>
                    <button
                        className={`px-3 py-1 mx-1 ${currentPage === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'
                            } rounded-lg`}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                </li>
                {renderPageNumbers()}
                <li>
                    <button
                        className={`px-3 py-1 mx-1 ${currentPage === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white'
                            } rounded-lg`}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
