// Group game screen
"use client";

import { useCallback, useEffect } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";
import { useGameStateCtx } from "@/context";
import { getGameRoom, getIsPlaying, getPlayersInRoom, getSocketId } from '@/context/selectors'
import { initGame, setGameComplete, setPlayers, setRoundComplete, setRoundGuesses } from "@/context/actions";
import { GameGuessData, GameUpdateData, PlayerData } from "@/lib/types";
import { Player } from "@prisma/client";
import { createGame } from "@/lib/api/game";
import { fetcher } from "@/lib/fetchHelpers";
import useRefreshGame from "@/hooks/useRefreshGame";
import PlayerIcon from "../../components/game/PlayerIcon";
import GroupRound from "../../components/game/GroupRound";
import KillGameButton from "../../components/KillGameButton";
import PlayersDisplay from "../../components/game/PlayersDisplay";

const Game = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

	const { gameId, gameCode } = getGameRoom(gameState);
	const socketId = getSocketId(gameState);
	const playersInRoom = getPlayersInRoom(gameState);
	const isPlaying = getIsPlaying(gameState);

	const { onGameUpdated, refreshGameData } = useRefreshGame(gameDispatch)

	const handleCreateGame = useCallback(() => {
		createGame(socketId)
			.then(res => {
				onGameUpdated(res.data);
			})
			.catch(console.error)
	}, [socketId, onGameUpdated])

  useEffect(() => {
		// Attempt session refresh
		const gameId = window.localStorage.getItem('gameId')
		
		if (gameId && socketId) {
			console.log({ gameId, socketId })
			fetcher(`/api/game/${gameId}`, {
				method: 'patch',
				data: { socketId },
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then(console.log)
			.catch(console.error)
		} else {
			fetcher(`/api/games/cleanup`, {
				method: 'patch'
			})
			.catch(console.error)
		}

		// Socket Handling
		function onPlayerUpdate(players: Array<PlayerData>) {
			gameDispatch(setPlayers(players || []))
		}

		function onGameStart({ game, players }: GameUpdateData) {
			gameDispatch(initGame(game.rounds))
		}

		function onRoundComplete() {
			console.log('on round complete')
			gameDispatch(setRoundComplete())
		}

		function onGameComplete() {
			gameDispatch(setGameComplete())
		}

		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, onPlayerUpdate)
		socket.on(SOCKET_EVENTS.PLAYERS_UPDATED, onPlayerUpdate)
		socket.on(SOCKET_EVENTS.START_GAME, onGameStart)
		socket.on(SOCKET_EVENTS.COMPLETE_ROUND, onRoundComplete)
		socket.on(SOCKET_EVENTS.COMPLETE_GAME, onGameComplete)

    return () => {
			socket.off(SOCKET_EVENTS.PLAYER_JOINED_GAME, onPlayerUpdate);
			socket.off(SOCKET_EVENTS.PLAYERS_UPDATED, onPlayerUpdate)
			socket.off(SOCKET_EVENTS.START_GAME, onGameStart)
			socket.off(SOCKET_EVENTS.COMPLETE_ROUND, onRoundComplete)
			socket.off(SOCKET_EVENTS.COMPLETE_GAME, onGameComplete)

    };
  }, [refreshGameData, socketId, gameDispatch]);

	const onTalkToPlayers = () => {

	}

  return (
    <div>
			{!gameCode 
				&& <button onClick={handleCreateGame}>Create Game</button>}

			{gameCode && (
				<>
					<p>Room: { gameCode }</p>
					<p>Players Joined: { playersInRoom.length || 'Waiting For Players' }</p>
					<PlayersDisplay players={playersInRoom} />

					{isPlaying && <GroupRound />}
		
					<KillGameButton
						gameId={gameId}
						socketId={socketId}
						onSuccess={() => refreshGameData(gameId)}
					/>
				</>
			)}
    </div>
  );
}

export default Game