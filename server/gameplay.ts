import { Round } from '@prisma/client';
import prisma from '../prisma'

const getRandomIndex = (array: Array<any>) => Math.floor(Math.random() * array.length)
const getRandom = (array: Array<any>) => {
	return array[getRandomIndex(array)]
}

export const generateRounds = async (count: number = 3) => {
	const rounds = []
	const roundSongIds: string[] = [] // for ease of checking

	const allSongs = await prisma.song.findMany({ 
		select: { id: true, lyricBlocks: true },
	});
	let songFindAttempts = 0;
	const maxSongFindAttempts = 10;
	const maxSongError = new Error('Could not find a unique song for requested round generation')
	for (let i = 0; i < count; i++) {
		// Find a random song not already in this round
		let randomSong: {
			id: string;
			lyricBlocks: Array<number>;
		};
		do {
			randomSong = getRandom(allSongs);
			songFindAttempts++;
			if (songFindAttempts > maxSongFindAttempts) {
				throw maxSongError
			}
		} while (roundSongIds.includes(randomSong.id))

		if (songFindAttempts > maxSongFindAttempts) {
			throw maxSongError
		}

		songFindAttempts = 0;
		roundSongIds.push(randomSong.id)

		// Do not need to connect gameId
		const round = {
			songId: randomSong.id,
			blockIndex: getRandomIndex(randomSong.lyricBlocks)
		}
		rounds.push(round)
	}
	return rounds;
}