// Individual play screen
'use client'

import { useGameStateCtx } from "@/context";
import { useCallback, useEffect } from "react";
import { getCurrentRound, getGameRoom, getIsPlaying, getPlayerId, getPlayerRoundGuess, getSocketId } from "@/context/selectors";
import { clearRoom, initGame, setGameComplete, setGameRoom, setGameStarted, setGameState, setPlayerId, setPlayerName, setPlayerRoundGuess, setRoundComplete } from "@/context/actions";
import { updatePlayer } from "@/lib/api/player";
import { getGame, joinGame, startGame } from "@/lib/api/game";
import PlayerRound from "../../../components/game/PlayerRound";
import useRefreshGame from "@/hooks/useRefreshGame";
import { GameUpdateData } from "@/lib/types";
import { socket, SOCKET_EVENTS } from "../../../socket";


const PlayPage = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

	const { gameId } = getGameRoom(gameState);
	const playerId = getPlayerId(gameState);
	const socketId = getSocketId(gameState);
	const isPlaying = getIsPlaying(gameState);

	useRefreshGame(gameDispatch)

	const onJoinGame = useCallback((gameCode: string) => {
		joinGame(socketId, gameCode, playerId)
			.then((res) => {
				const { player } = res.data

				console.log('join game --- setting local storage')
				window.localStorage.setItem('playerId', player.id);
				window.localStorage.setItem('gameId', player.gameId);

				gameDispatch(setGameRoom(player.gameId))
				gameDispatch(setPlayerId(player.id))
				gameDispatch(setPlayerName(player.displayName))
			})
			.catch(console.error);
	}, [gameDispatch, socketId, playerId])

	const onStartGame = () => {
		// to do - confirmation popup?
		startGame(gameId)
			.then((data: any) => {
				console.log(data);

				// gameDispatch(setGameStarted(data))
			})
			.catch(console.error)
	}

	useEffect(() => {
		if (socketId && playerId) socket.emit(SOCKET_EVENTS.PLAYER_JOINED_GAME, playerId)
	}, [socketId, playerId])

	useEffect(() => {
		function onGameStart({ game }: GameUpdateData) {
			gameDispatch(initGame(game.rounds))
		}
		function onRoundComplete() {
			gameDispatch(setRoundComplete())
		}
		function onGameComplete() {
			gameDispatch(setGameComplete())
		}

		// Check local storage for game re-joining
		const pId = window.localStorage.getItem('playerId')
		const gId = window.localStorage.getItem('gameId')

		console.log(`Checking local storage.\nPID: ${pId || 'null'}\nGID: ${gId || 'null'}`);
		
		if (pId && gId) {
			getGame(gId)
				.then((res: any) => {
					if (!res.data.game.isActive) {
						console.log('game inactive --- clearing local storage')
						window.localStorage.setItem('playerId', '')
						window.localStorage.setItem('gameId', '')
						gameDispatch(clearRoom())
					} else {
						gameDispatch(setGameRoom(gId))
						gameDispatch(setPlayerId(pId))
						if (res.data.game.isStarted) {
							gameDispatch(setGameState(res.data.game))
						}
					}
				})
				.catch(err => {
					console.error({err})
					console.log('fetch game error --- clearing local storage')

					window.localStorage.setItem('playerId', '')
					window.localStorage.setItem('gameId', '')
					gameDispatch(setGameRoom(''))
					gameDispatch(setPlayerId(''))
				})
		}

		socket.on(SOCKET_EVENTS.START_GAME, onGameStart)
		socket.on(SOCKET_EVENTS.COMPLETE_ROUND, onRoundComplete)
		socket.on(SOCKET_EVENTS.COMPLETE_GAME, onGameComplete)

		return () => {
			socket.off(SOCKET_EVENTS.START_GAME, onGameStart)
			socket.off(SOCKET_EVENTS.COMPLETE_ROUND, onRoundComplete)
			socket.off(SOCKET_EVENTS.COMPLETE_GAME, onGameComplete)
		}
	}, [gameDispatch])

	if (!socketId) {
		return <p>Loading...</p>
	}

	if (!gameId) {
		return (
			<JoinForm 
				handleJoinGame={onJoinGame}
			/>
		)
	}

	return (
		<>
			<p>Room Joined: {gameId}</p>
			<p>Player ID: {playerId}</p>
			<p>Socket ID: {socketId}</p>

			{isPlaying ? <PlayerRound /> : (
				<>
					<NameForm playerId={playerId} />
					<p>All players ready?</p>
					<button onClick={onStartGame}>Start Game</button>
				</>
			)}
		</>
	)
}

interface NameFormProps {
	playerId: string;
}

const NameForm = ({ playerId }: NameFormProps) => (
	<form onSubmit={(e) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			displayName: { value: string };
		};
		console.log(playerId, target.displayName.value)

		updatePlayer(playerId, target.displayName.value)
			.then((res) => {
				console.log(res.data)
				// to do - success message
			})
			.catch((err: Error) => console.error(err))
	}}>
		<label>
			Optionally Update Your Display Name:
			<input
				type="text"
				name="displayName"
				required
				className="text-black"
			/>
		</label>
	</form>
)

interface JoinFormPropTypes { 
	handleJoinGame: Function;
}

const JoinForm = ({
	handleJoinGame
}: JoinFormPropTypes) => {

	const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
		const target = e.target as typeof e.target & {
			gameCode: { value: string };
		};
		handleJoinGame(target.gameCode.value)
  }, [handleJoinGame]);

	return (
		<form onSubmit={onSubmit}>
			<label>
				Enter Room Code: 
				<input
					type="text"
					name="gameCode"
					required
					className="text-black"
				/>
			</label>
			<p>No Game Code? Start a game first to get a code.</p>
		</form>
	)
}

export default PlayPage;