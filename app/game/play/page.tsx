// Individual play screen
'use client'

import { useGameStateCtx, withGameContext } from "@/context";
import { socket, SOCKET_EVENTS } from "../../../socket";
import { FormEvent, useCallback, useEffect } from "react";
import { getGameRoom, getPlayerId, getPlayersInRoom, getSocketId } from "@/context/selectors";
import useSockets from "@/hooks/useSockets";
import { PlayerData, RoomData } from "@/lib/types";
import { setGameRoom, setPlayerId, setPlayerName } from "@/context/actions";
import { updatePlayer } from "@/lib/api/player";
import { joinGame } from "@/lib/api/game";

interface RoomJoinFormData extends FormData {
	roomId: String;
}

const PlayPage = () => {
	const { gameDispatch, gameState } = useGameStateCtx();
	const { roomId } = getGameRoom(gameState);
	const playerId = getPlayerId(gameState);
	const socketId = getSocketId(gameState);

	const _ = useSockets();

	const onGameJoined = useCallback((data: PlayerData) => {
		console.log(data)
		gameDispatch(setGameRoom(data.gameId))
		gameDispatch(setPlayerId(data.id))
		gameDispatch(setPlayerName(data.displayName))
	}, [gameDispatch])

	if (roomId == null) {
		return (
			<JoinForm 
				socketId={socketId}
				onGameJoined={onGameJoined}
			/>
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

interface JoinFormPropTypes { 
	socketId: string; 
	onGameJoined: any;
}

const JoinForm = ({
	socketId,
	onGameJoined,
}: JoinFormPropTypes) => {
	const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
		const target = e.target as typeof e.target & {
			gameCode: { value: string };
		};
		console.log(target.gameCode.value)
		
    joinGame(socketId, target.gameCode.value)
			.then(data => {
				console.log(data);
				onGameJoined(data.player)
			})
			.catch(console.error);
  }, [socketId, onGameJoined]);
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


export default withGameContext(PlayPage);