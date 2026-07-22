import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface TableSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
}

const TableSearch: React.FC<TableSearchProps> = ({ search, onSearchChange }) => {
    return (
        <div
            className="
                w-full md:w-auto flex items-center gap-2 text-xs
                rounded-full px-3 py-1.5
                ring-[1.5px] ring-gray-300 dark:ring-gray-600
                bg-white dark:bg-gray-800
                text-gray-700 dark:text-gray-200
            "
        >
            <MagnifyingGlassIcon
                width={16}
                height={16}
                className="text-gray-500 dark:text-gray-400"
            />

            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="
                    w-50 max-w-full bg-transparent outline-none
                    text-gray-700 dark:text-gray-200
                    placeholder-gray-500 dark:placeholder-gray-400
                "
            />
        </div>
    );
};

export default TableSearch;
