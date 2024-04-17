
export interface SearchResult {
	albumName: string;
	artistName: string;
	duration: number;
	id: number;
	instrumental: Boolean;
	name: string;
	plainLyrics: string;
	syncedLyrics: string;
	trackName: string;
}

export interface CreateGameData {
	groupSocketId: string;
}

export interface RoomData {
	id: string;
	gameCode: string;
	groupSocketId: string;
	players: Array<string> | undefined;
}