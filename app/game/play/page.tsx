// Individual play screen
'use client'

import { useGameStateCtx, withGameContext } from "@/context";
import { socket, SOCKET_EVENTS } from "../../../socket";
import { useEffect } from "react";
import { getGameRoom, getPlayerId, getPlayersInRoom } from "@/context/selectors";
import useSockets from "@/hooks/useSockets";
import { PlayerData, RoomData } from "@/lib/types";
import { setGameRoom, setPlayerId, setPlayerName } from "@/context/actions";
import { updatePlayer } from "@/api/player";

interface RoomJoinFormData extends FormData {
	roomId: String;
}

const PlayPage = () => {
	const { gameDispatch, gameState } = useGameStateCtx();
	const { roomId } = getGameRoom(gameState);
	const playerId = getPlayerId(gameState);

	const { isConnected, transport } = useSockets();
	
	// console.log(gameState)
  useEffect(() => {
		function onGameJoined(data: PlayerData) {
			gameDispatch(setGameRoom(data.gameId))
			gameDispatch(setPlayerId(data.id))
			gameDispatch(setPlayerName(data.displayName))
		}

		socket.on(SOCKET_EVENTS.JOIN_SUCCESS, onGameJoined)

    return () => {
      socket.off(SOCKET_EVENTS.JOIN_SUCCESS, onGameJoined);
    };
  }, [gameDispatch]);


	if (gameState.socket.roomId == null) {
		return (
			<JoinForm />
		)
	}

	return (
		<>
			<p>Room Joined: {gameState.socket.roomId}</p>
			<NameForm playerId={playerId} />
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
			.then(res => {
				console.log(res.data)
				socket.emit(SOCKET_EVENTS.UPDATE_PLAYER_NAME)
			})
			.catch(err => console.error(err))
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

const JoinForm = () => (
	<form onSubmit={(e) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			gameCode: { value: string };
		};
		console.log(target.gameCode.value)

		socket.emit(SOCKET_EVENTS.JOIN_GAME, { room: target.gameCode.value })
	}}>
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


export default withGameContext(PlayPage);