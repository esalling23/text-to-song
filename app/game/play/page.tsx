// Individual play screen
'use client'

import { useGameStateCtx, withGameContext } from "@/context";
import { socket, SOCKET_EVENTS } from "../../../socket";
import { useEffect } from "react";
import { getGameRoom, getPlayersInRoom } from "@/context/selectors";
import useSockets from "@/hooks/useSockets";
import { RoomData } from "@/lib/types";
import { setGameRoom } from "@/context/actions";

interface RoomJoinFormData extends FormData {
	roomId: String;
}

const PlayPage = () => {
	
	const { gameDispatch, gameState } = useGameStateCtx();

	const { isConnected, transport } = useSockets();
	
	const gameRoom = getGameRoom(gameState);

	// console.log(gameState)
  useEffect(() => {
		function onGameJoined(roomData: RoomData) {
			gameDispatch(setGameRoom(roomData.gameCode))
		}

		socket.on(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameJoined)

    return () => {
      socket.off(SOCKET_EVENTS.PLAYER_JOINED_GAME, onGameJoined);
    };
  }, [gameDispatch]);


	if (gameState.socket.roomId == null) {
		return (
			<JoinForm />
		)
	}

	return (
		<p>Room: {gameState.socket.roomId}</p>
	)
}

const JoinForm = () => (
	<form onSubmit={(e) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			roomId: { value: string };
		};
		console.log(target.roomId.value)

		socket.emit(SOCKET_EVENTS.JOIN_GAME, { room: target.roomId.value })
	}}>
		<input
			type="text"
			name="roomId"
			required
			className="text-black"
		/>
	</form>
)


export default withGameContext(PlayPage);