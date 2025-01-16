
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

export interface PlayerData {
	gameId: string;
	id: string;
	displayName: string;
	gameCode?: string;
	totalScore: number;
  icon: string;
}

export interface GuessData {
	id: string;
	title: string;
	artist: string;
	playerId: string;
	roundId: string;
	score: number;
	isCorrect: boolean;
}

export interface GameUpdateData {
	game: GameData;
	players: Array<PlayerData>
}

export interface GameGuessData {
	roundGuesses: Array<GuessData>
}

export interface RoundData {
	id: string;
	song: {
		title: string;
		artist: {
			name: string;
		};
		lyricBlocks: Array<string>;
	};
	blockIndex: number;
}

export interface GameData {
	id: string;
	gameCode: string;
	groupSocketId: string;
	players: Array<string>;
	rounds: Array<RoundData>;
	isActive: boolean;
	isStarted: boolean;
	isCompleted: boolean;
}
