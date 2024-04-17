import { SearchResult } from "@/lib/types"

interface SongTitleArtistProps {
	song: SearchResult;
}

const SongTitleArtist = ({ song } : SongTitleArtistProps) => (
	<span>
		<span>{song.name}</span>
		{` by `}
		<span>{song.artistName}</span>
	</span>
);

export default SongTitleArtist