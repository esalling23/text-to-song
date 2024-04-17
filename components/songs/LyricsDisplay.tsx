import { useMemo } from "react";

interface SongLyricsProps {
	lyrics: String;
}

const LyricsDisplay = ({
	lyrics,
	selectedStartLine,
	selectedEndLine
} : SongLyricsProps) => {
	const parsedLyrics = useMemo(() =>  {
		if (!lyrics) return 'No Lyrics Available. Try another song.'
		return lyrics.split('\n').map(line => (
			<p key={line}>{line}</p>
		))
	}, [lyrics])
	return (
		<section>{parsedLyrics}</section>
	);
}

export default LyricsDisplay