'use client';
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';

import { searchQuery } from '@/api/lyrics'

const SearchInput = ({
	setSearchResults
}) => {
	const [searchValue, setSearchValue] = useState('');
	const [debouncedSearch] = useDebounce(searchValue, 300);

	useEffect(() => {
		if (debouncedSearch && debouncedSearch !== '') {
			console.log(`searching "${debouncedSearch}"...`);
			// perform search
			searchQuery(debouncedSearch)
				.then(data => {
					setSearchResults(data)
					console.log(data)
				})
				.catch(console.error)
		}
	}, [debouncedSearch, setSearchResults])

	const handleInputChange = useCallback((e) => {
		setSearchValue(e.target.value);
	}, [])

	return (
		<input type="search"
			id="search"
			className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Search"
			value={searchValue}
			onChange={handleInputChange}
			required />
	)
}

export default SearchInput