// Group game screen

"use client";

import { useCallback, useEffect, useState } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";
import { useGameStateCtx, withGameContext } from "@/context";
import { getGameRoom, getPlayersInRoom, getSocketId } from '@/context/selectors'
import { setGameRoom, setPlayers } from "@/context/actions";
import { PlayerData, RoomData } from "@/lib/types";
import useSockets from "@/hooks/useSockets";
import { Player } from "@prisma/client";
import PlayerIcon from "../../components/game/PlayerIcon";
import { createGame } from "@/lib/api/game";


const Game = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

	const { isConnected, transport } = useSockets();

	const { roomId, gameCode } = getGameRoom(gameState);
	const socketId = getSocketId(gameState);
	const playersInRoom = getPlayersInRoom(gameState);


	const onGameUpdated = useCallback((data: RoomData) => {
		console.log(`Game Updated -- Room ID: ${data.id}`)
		gameDispatch(setGameRoom(data.id, data.gameCode))
		gameDispatch(setPlayers(data.players || []))
	}, [gameDispatch])

	// console.log(gameState)
  useEffect(() => {

		function onGameRefresh(data: RoomData) {
			onGameUpdated(data)
		}

		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameRefresh)
		socket.on(SOCKET_EVENTS.PLAYERS_UPDATED, onGameRefresh)
		
    return () => {
      socket.off(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameRefresh);
			socket.off(SOCKET_EVENTS.PLAYERS_UPDATED, onGameRefresh)
    };
  }, [onGameUpdated]);

	const handleCreateGame = useCallback(() => {
		// socket.emit(SOCKET_EVENTS.CREATE_GAME)
		console.log(socketId)
		createGame(socketId)
			.then(data => {
				console.log(data)
				onGameUpdated(data.game);
			})
			.catch(console.error)
	}, [socketId, onGameUpdated])

  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <p>Transport: { transport }</p>

			{isConnected && <button onClick={handleCreateGame}>Create Game</button>}

			{gameCode && (
				<>
					<p>Room: { gameCode }</p>
					<p>Players Joined: { playersInRoom.length || 'Waiting For Players' }</p>
					{playersInRoom?.map((player: Player) => (
						<PlayerIcon
							key={player.id}
							name={player.displayName}
							// icon={player.displayIcon}
						/>
					))}
				</>
			)}
    </div>
  );
}

export default withGameContext(Game)