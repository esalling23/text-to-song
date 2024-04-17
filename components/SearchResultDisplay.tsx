import { SearchResult } from "@/lib/types";
import SongTitleArtist from "./songs/TitleByArtist";

interface SearchResultProps {
	result: SearchResult;
	handleSelectResult: Function;
}

const SearchResultDisplay = ({
	result,
	handleSelectResult,
} : SearchResultProps) => {
	return (
		<div
			key={result.id.toString()}
		>
			<button
				onClick={handleSelectResult(result)}
				className={'hover:underline'}
			>
				<SongTitleArtist song={result} />
			</button>
		</div>
	)
}

export default SearchResultDisplay;