'use client';

import { useCallback, useState, FormEvent, useMemo, Suspense } from 'react';
import SearchInput from '../../components/SearchInput';
import { SearchResult } from '@/lib/types';
import SearchResultDisplay from '../../components/SearchResultDisplay';
import SongDetailsDisplay from '../../components/songs/DetailsDisplay';


// interface MusicSearchProps {
// 	setSongSelected: Function;
// }

const MusicSearchPage = () => {
	const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
	const [songSelected, setSongSelected] = useState<SearchResult | null>(null)

	const handleSubmit = useCallback((e: FormEvent) => {
		e.preventDefault();
	}, []);

	const handleSelectResult = useCallback((value: SearchResult) => {
		return () => {
			setSongSelected(value)
		}
	}, [setSongSelected])

	const resultsDisplay = useMemo(() => {
		if (!searchResults) return '';
		if (searchResults.length == 0) return 'No Results Found. Try Again.';

		// Show song details
		if (songSelected) {
			return <SongDetailsDisplay 
				song={songSelected}
			/>;
		}

		// Show results list
		return searchResults.map((value: SearchResult) => {
			return <SearchResultDisplay
				result={value}
				key={value.id.toString()}
				handleSelectResult={handleSelectResult}
			/>;
		})
	}, [searchResults, songSelected, handleSelectResult]);

	return (
		<>
			<h1>Music Search Page</h1>

			<form onSubmit={handleSubmit}>
				<label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
				<div className="relative">
					<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg className="w-4 h-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20">
							<path stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<SearchInput
						setSearchResults={setSearchResults}
					/>
				</div>
			</form>

			<Suspense>{resultsDisplay}</Suspense>
		</>
	)
}

export default MusicSearchPage;