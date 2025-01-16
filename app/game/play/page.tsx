// Individual play screen
'use client'

import { useGameStateCtx } from "@/context";
import { useCallback, useEffect, useMemo } from "react";
import { getGameRoom, getIsPlaying, getPlayerId, getPlayersInRoom, getSocketId } from "@/context/selectors";
import { clearRoom, initGame, setGameComplete, setGameRoom, setGameState, setPlayerId, setPlayerName, setPlayerRoundGuess, setPlayers, setRoundComplete } from "@/context/actions";
import { getGame, joinGame, startGame } from "@/lib/api/game";
import PlayerRound from "../../../components/game/PlayerRound";
import useRefreshGame from "@/hooks/useRefreshGame";
import { GameUpdateData, PlayerData } from "@/lib/types";
import { socket, SOCKET_EVENTS } from "../../../socket";
import { MIN_PLAYERS } from "../../../lib/constants";
import NameForm from "../../../components/game/PlayerForms/NameForm";
import IconForm from "../../../components/game/PlayerForms/IconForm";
import JoinForm from "../../../components/game/PlayerForms/JoinForm";


const PlayPage = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

	const { gameId, gameCode } = getGameRoom(gameState);
	const players = getPlayersInRoom(gameState);
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

				gameDispatch(setGameRoom(player.gameId, gameCode))
				gameDispatch(setPlayerId(player.id))
				gameDispatch(setPlayerName(player.displayName))
			})
			.catch(console.error);
	}, [gameDispatch, socketId, playerId])

	const onStartGame = useCallback(() => {
		// to do - confirmation popup?
		startGame(gameId)
			.then((data: any) => {
				console.log(data);

				// gameDispatch(setGameStarted(data))
			})
			.catch(console.error)
	}, [gameId])

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
		function onPlayerUpdate(players: Array<PlayerData>) {
			gameDispatch(setPlayers(players || []))
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
						gameDispatch(setGameRoom(gId, res.data.game.gameCode))
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
					gameDispatch(setGameRoom('', ''))
					gameDispatch(setPlayerId(''))
				})
		}

		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, onPlayerUpdate)
		socket.on(SOCKET_EVENTS.START_GAME, onGameStart)
		socket.on(SOCKET_EVENTS.COMPLETE_ROUND, onRoundComplete)
		socket.on(SOCKET_EVENTS.COMPLETE_GAME, onGameComplete)

		// Debugging only - remove from production
		socket.onAny((eventName, ...args) => {
			console.log('heard', { eventName, ...args })
		})
		
		return () => {
			socket.off(SOCKET_EVENTS.PLAYER_JOINED_GAME, onPlayerUpdate)
			socket.off(SOCKET_EVENTS.START_GAME, onGameStart)
			socket.off(SOCKET_EVENTS.COMPLETE_ROUND, onRoundComplete)
			socket.off(SOCKET_EVENTS.COMPLETE_GAME, onGameComplete)
		}
	}, [gameDispatch])

	const startGameOption = useMemo(() => {
		console.log({ players, MIN_PLAYERS })
		if (players?.length >= MIN_PLAYERS) {
			return (<>
				<p>All players ready?</p>
				<button onClick={onStartGame}>Start Game</button>
			</>)
		} else {
			return ''
		}
	}, [players, onStartGame])

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
			{(!isPlaying && playerId && gameCode) ? (
				<>
					<NameForm playerId={playerId} />
					<IconForm
						gameCode={gameCode} 
						playerId={playerId} 
						socket={socket}
					/>

					<hr className="m-2" />

					{startGameOption}
				</>
			) : <PlayerRound />}
		</>
	)
}

export default PlayPage;