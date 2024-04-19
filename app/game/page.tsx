// Group game screen

"use client";

import { useEffect, useState } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";
import { useGameStateCtx, withGameContext } from "@/context";
import { getGameRoom, getPlayersInRoom } from '@/context/selectors'
import { setGameRoom, setPlayers } from "@/context/actions";
import { PlayerData, RoomData } from "@/lib/types";
import useSockets from "@/hooks/useSockets";
import { Player } from "@prisma/client";
import PlayerIcon from "../../components/game/PlayerIcon";
import { updateGameData } from "@/lib/serverActions";


const Game = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

	const { isConnected, transport } = useSockets();

	const { roomId, gameCode } = getGameRoom(gameState);
	const playersInRoom = getPlayersInRoom(gameState);

	// console.log(gameState)
  useEffect(() => {
		function onGameUpdated(data: RoomData) {
			console.log(`Game Updated -- Room ID: ${data.id}`)
			gameDispatch(setGameRoom(data.id, data.gameCode))
			gameDispatch(setPlayers(data.players || []))
		}

		function onGameRefresh() {
			// updateGameData(gameId);
		}

		socket.on(SOCKET_EVENTS.GAME_CREATED, onGameUpdated)
		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameUpdated)
		socket.on(SOCKET_EVENTS.PLAYERS_UPDATED, onGameUpdated)
		
    return () => {
			socket.off(SOCKET_EVENTS.GAME_CREATED, onGameUpdated);
      socket.off(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameUpdated);
			socket.off(SOCKET_EVENTS.PLAYERS_UPDATED, onGameUpdated)
    };
  }, [gameDispatch]);

	const handleCreateGame = () => {
		socket.emit(SOCKET_EVENTS.CREATE_GAME)		
	}

  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <p>Transport: { transport }</p>

			<button onClick={handleCreateGame}>Create Game</button>

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