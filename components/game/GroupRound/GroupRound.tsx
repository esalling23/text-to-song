import { getCurrentRoundIndex, getGuessCount, getPlayersInRoom, getSongLyrics } from '@/context/selectors';
import './GroupRound.css'
import { useGameStateCtx } from '@/context';
import { socket, SOCKET_EVENTS } from '../../../socket';
import { useEffect } from 'react';
import { GuessData } from '@/lib/types';
import RoundResults from '../RoundResults';
import { setRoundGuesses } from '@/context/actions';
import RoundScores from '../RoundScores';

const GroupRound = () => {
	const { gameState, gameDispatch } = useGameStateCtx();

	const roundIndex = getCurrentRoundIndex(gameState)
	const lyrics = getSongLyrics(gameState);
	const playerCount = getPlayersInRoom(gameState).length;
	const roundGuessCount = getGuessCount(gameState);

	useEffect(() => {
		const handlePlayClip = () => {
			const synth = window.speechSynthesis
	
			synth.speak(new SpeechSynthesisUtterance(lyrics))
		}
		const handleKillClip = () => {
			const synth = window.speechSynthesis
	
			synth.cancel()
		}

		const handleRoundGuess = (roundGuesses: Array<GuessData>) => {
			console.log(roundGuesses)
			gameDispatch(setRoundGuesses(roundGuesses))
		}

		socket.on(SOCKET_EVENTS.STOP_CLIP, handleKillClip)
		socket.on(SOCKET_EVENTS.REPLAY_CLIP, handlePlayClip)
		socket.on(SOCKET_EVENTS.ROUND_GUESS, handleRoundGuess)
		
		handlePlayClip() // play once on load
		
		return () => {
			socket.off(SOCKET_EVENTS.STOP_CLIP, handleKillClip)
			socket.off(SOCKET_EVENTS.REPLAY_CLIP, handlePlayClip)
			socket.off(SOCKET_EVENTS.ROUND_GUESS, handleRoundGuess)
		}
	}, [lyrics])

	if (roundGuessCount >= playerCount) {
		console.log('triggering round results')
		return <RoundResults />
	}

	return (
		<div className="screen flex-center">
			<h2>This is round {roundIndex + 1}</h2>
			<h3>Waiting for guesses...</h3>
			<p>Total Round Guesses: {roundGuessCount}</p>
			{/* <SpeechPlayer /> */}
			{/* <PlayerDisplay isPlaying /> */}
		</div>
	)
}

export default GroupRound