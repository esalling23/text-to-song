import { useRouter } from "next/router"
import LyricsDisplay from "./LyricsDisplay"
import TitleArtist from "./TitleByArtist"
import { SearchResult } from "@/lib/types"

interface SongDetailsPageProps {
	song: SearchResult
}
const SongDetailsPage = ({ song } : SongDetailsPageProps) => {
	return (
		<section>
			<TitleArtist song={song} />
			<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
			<LyricsDisplay lyrics={song.plainLyrics} />
		</section>
	)
}

export default SongDetailsPage