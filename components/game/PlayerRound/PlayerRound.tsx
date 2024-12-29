import { FormEvent, useState } from 'react';
import './PlayerRound.css'

import { getGameRoom, getPlayerId, getPlayerRoundGuess, getSocketId } from '@/context/selectors';
import { useGameStateCtx } from '@/context';
import { poster } from '@/lib/fetchHelpers';
import { socket, SOCKET_EVENTS } from '../../../socket';
import { setPlayerRoundGuess } from '@/context/actions';

const PlayerRound = () => {
	const { gameState, gameDispatch } = useGameStateCtx();
	const { gameId } = getGameRoom(gameState);
	const playerId = getPlayerId(gameState);
	const socketId = getSocketId(gameState);
	const playerRoundGuess = getPlayerRoundGuess(gameState);

	// const [hasGuessed, setHasGuessed] = useState(playerRoundGuess || false);

	const handleReplay = () => {
		poster(`/api/game/${gameId}/round/replay`, { socketId })
			.then(console.log)
			.catch(console.error)
	}
	const handleStopClip = () => {
		socket.emit(SOCKET_EVENTS.STOP_CLIP)
	}

	const handleSubmitGuesses = (e: FormEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			title: { value: string };
			artist: { value: string };
		};
		console.log(target.title.value, target.artist.value)
		const guess = {
			title: target.title.value,
			artist: target.artist.value
		}
		poster(`/api/game/${gameId}/round/guess`, {
			...guess,
			playerId
		})
			.then((data) => {
				// setHasGuessed(true);
				gameDispatch(setPlayerRoundGuess(guess))
				console.log('guess success .then', data)
			})
			.catch(console.error)
	}

	if (playerRoundGuess) {
		return (
			// todo: expand, add more stuff players cna do while they wait
			// guess other songs, rate songs, create playlists, modify account
			<>
				<h2>Nice guess! Now time to wait for your fellow players...</h2>
				<h3>Your Guess:</h3>
				<p>Song: {playerRoundGuess.title}</p>
				<p>Artist: {playerRoundGuess.artist}</p>
			</>
		)
	}
	return (
		<div className="screen flex-center gap-6">
			<h2>Listen to the song & make your guess:</h2>
			<form 
				onSubmit={handleSubmitGuesses} 
				className="flex-center text-center p-4 divide-y divide-dashed border-solid border-2 border-sky-500 rounded-lg"
			>
				<label>
					Song Title: <br/>
					<input required name="title" placeholder="Song Title" className="ml-2" />
				</label>
				<label>
					Artist Name: <br/>
					<input required name="artist" placeholder="Artist Name" className="ml-2" />
				</label>
				<button type="submit">SUBMIT GUESS</button>
			</form>

			<div className="flex flex-row gap-2">
				<button onClick={handleReplay}>Replay Clip</button>
				<button onClick={handleStopClip}>Stop Clip</button>
			</div>
		</div>
	)
}

export default PlayerRound