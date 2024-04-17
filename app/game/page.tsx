// Group game screen

"use client";

import { useEffect, useState } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";
import { createGame } from "@/lib/actions";
import { useGameStateCtx, withGameContext } from "@/context";
import { getGameRoom, getPlayersInRoom } from '@/context/selectors'
import { setGameRoom, setPlayers } from "@/context/actions";
import { RoomData } from "@/lib/types";
import useSockets from "@/hooks/useSockets";


const Game = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

	const { isConnected, transport } = useSockets();
	
	const gameRoom = getGameRoom(gameState);
	const playersInRoom = getPlayersInRoom(gameState);

	// console.log(gameState)
  useEffect(() => {
		function onGameUpdated(roomData: RoomData) {
			console.log(`Game Updated -- Room ID: ${roomData.id}`)
			gameDispatch(setGameRoom(roomData.gameCode))
			gameDispatch(setPlayers(roomData.players || []))
		}

		socket.on(SOCKET_EVENTS.GAME_CREATED, onGameUpdated)
		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameUpdated)

    return () => {
      socket.off(SOCKET_EVENTS.GAME_CREATED, onGameUpdated);
      socket.off(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameUpdated);
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

			{gameRoom && (
				<>
					<p>Room: { gameRoom }</p>
					<p>Players Joined: { playersInRoom.length || 'Waiting For Players' }</p>
				</>
			)}
    </div>
  );
}

export default withGameContext(Game)